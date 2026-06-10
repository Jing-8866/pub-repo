#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""将 scripts 目录下的 .script 文件还原为 DWS_SQL 格式的 .sql 文件。"""

import json
import os

SCRIPT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts")
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "DWS_SQL")


def parse_script_file(script_path: str) -> str:
    with open(script_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise ValueError("script 文件格式无效，根节点须为 JSON 对象")

    if "content" not in data:
        raise ValueError("script 文件缺少 content 字段")

    content = data["content"]
    if not isinstance(content, str):
        raise ValueError("content 字段须为字符串")
    return content


def write_sql_file(content: str, out_path: str) -> None:
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as file:
        file.write(content)
        if content and not content.endswith("\n"):
            file.write("\n")


def iter_script_files(root_dir: str) -> list[tuple[str, str]]:
    """递归收集 root_dir 下所有 .script，返回 (绝对路径, 相对路径)。"""
    script_files: list[tuple[str, str]] = []
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.lower().endswith(".script"):
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir)
                script_files.append((full_path, rel_path))
    return sorted(script_files, key=lambda item: item[1].lower())


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    script_files = iter_script_files(SCRIPT_DIR)
    if not script_files:
        raise FileNotFoundError(f"未在 {SCRIPT_DIR} 及其子目录找到 .script 文件")

    for script_path, rel_path in script_files:
        content = parse_script_file(script_path)
        rel_sql = os.path.splitext(rel_path)[0] + ".sql"
        out_path = os.path.join(OUT_DIR, rel_sql)
        write_sql_file(content, out_path)
        print(f"generated: {out_path}")


if __name__ == "__main__":
    main()
