#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""将 DWS_SQL 目录下的 .sql 文件转换为 DWS .script 格式。"""

import json
import os

SQL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "DWS_SQL")
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts")


def build_up2dir(rel_path: str) -> str:
    rel_dir = os.path.dirname(rel_path).replace("\\", "/")
    if rel_dir:
        return f"/{rel_dir}"
    return "/"


def build_script(sql_path: str, rel_path: str) -> dict:
    with open(sql_path, "r", encoding="utf-8") as file:
        content = file.read()

    base_name = os.path.splitext(os.path.basename(sql_path))[0]
    dbName = "{db_name}" # 数据库名, 示例: dws_dev
    link_name = "{link_name}" # 链接名, 示例: db_link_dws
    up2dir = build_up2dir(rel_path) # 上传目录

    return {
        "configuration": {},
        "connectionName": link_name,
        "content": content,
        "currentDatabase": dbName,
        "description": "",
        "directory": up2dir,
        "name": base_name,
        "owner": "DWS",
        "templateVersion": "1.0",
        "type": "DWSSQL",
    }


def write_script_file(script: dict, out_path: str) -> None:
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as file:
        json.dump(script, file, ensure_ascii=False, indent="\t")
        file.write("\n")


def iter_sql_files(root_dir: str) -> list[tuple[str, str]]:
    """递归收集 root_dir 下所有 .sql，返回 (绝对路径, 相对路径)。"""
    sql_files: list[tuple[str, str]] = []
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.lower().endswith(".sql"):
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir)
                sql_files.append((full_path, rel_path))
    return sorted(sql_files, key=lambda item: item[1].lower())


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    sql_files = iter_sql_files(SQL_DIR)
    if not sql_files:
        raise FileNotFoundError(f"未在 {SQL_DIR} 及其子目录找到 SQL 文件")

    for sql_path, rel_path in sql_files:
        script = build_script(sql_path, rel_path)
        rel_script = os.path.splitext(rel_path)[0] + ".script"
        out_path = os.path.join(OUT_DIR, rel_script)
        write_script_file(script, out_path)
        print(f"generated: {out_path}")


if __name__ == "__main__":
    main()
