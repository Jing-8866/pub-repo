#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""将 DDL 目录下的 .sql 文件转换为 DWS .script 格式。"""

import json
import os
import re
from datetime import datetime, timedelta, timezone

DDL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "DDL")
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "DWS_scripts")

TABLE_BLOCK_PATTERN = re.compile(
    r"DROP TABLE IF EXISTS\s+[^\n]+\s*\n\s*"
    r"CREATE TABLE\s+(\S+)\s*\((.*?)\)\s*\n"
    r"(WITH[^\n]+)\s*\n"
    r"comment\s+('(?:''|[^'])*')\s*;",
    re.IGNORECASE | re.DOTALL,
)


def format_columns(columns_text: str) -> str:
    lines = [line.strip().rstrip(",") for line in columns_text.splitlines() if line.strip()]
    formatted = []
    for index, line in enumerate(lines):
        prefix = "     " if index == 0 else "    ,"
        formatted.append(f"{prefix}{line}")
    return "\n".join(formatted)


def normalize_header(sql_text: str) -> str:
    # 保留源脚本注释说明区域，仅压缩注释区与 DDL 之间的多余空行
    return re.sub(r"(\* --\s*\n)\s+\n", r"\1\n", sql_text)


def convert_table_block(block: str) -> str:
    block = normalize_header(block)

    def replace_create(match: re.Match[str]) -> str:
        table_name = match.group(1)
        columns = format_columns(match.group(2))
        with_clause = match.group(3).strip()
        table_comment = match.group(4).strip()
        drop_sql = re.search(
            r"DROP TABLE IF EXISTS\s+[^\n]+",
            match.group(0),
            re.IGNORECASE,
        ).group(0)
        return (
            f"{drop_sql}\n"
            f"CREATE TABLE {table_name}(\n"
            f"{columns}\n"
            f")\n"
            f"{with_clause}\n"
            f"COMMENT = {table_comment}\n"
            f";"
        )

    converted, count = TABLE_BLOCK_PATTERN.subn(replace_create, block, count=1)
    if count == 0:
        raise ValueError("未能识别 DDL 表结构，请检查 SQL 格式")
    return converted.strip() + "\n"


def convert_sql_content(sql_text: str) -> str:
    parts = re.split(r"(?=-- DWS sql)", sql_text)
    blocks = [part.strip() for part in parts if part.strip()]
    if not blocks:
        raise ValueError("SQL 内容为空")

    if len(blocks) == 1 and blocks[0].startswith("-- DWS sql"):
        return convert_table_block(blocks[0])

    converted_blocks = []
    for block in blocks:
        if block.startswith("-- DWS sql"):
            converted_blocks.append(convert_table_block(block))
        else:
            converted_blocks.append(block)
    return "\n\n".join(converted_blocks)


def build_script(sql_path: str) -> dict:
    with open(sql_path, "r", encoding="utf-8") as file:
        sql_text = file.read()

    base_name = os.path.splitext(os.path.basename(sql_path))[0]
    content = convert_sql_content(sql_text)
    dtName = 'kl_fin_dws_dev' # 数据库名
    up2dir = '/对象创建/dws/永年库存预测' # 脚本上传目录

    return {
        "configuration": {},
        "connectionName": "ur_kl_dws_uown_0",
        "content": content,
        "currentDatabase": dtName,
        "description": "",
        "directory": up2dir,
        "name": base_name,
        "owner": "DWS",
        "templateVersion": "1.0",
        "type": "DWSSQL",
    }


def write_script_file(script: dict, out_path: str) -> None:
    with open(out_path, "w", encoding="utf-8") as file:
        json.dump(script, file, ensure_ascii=False, indent="\t")
        file.write("\n")


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    sql_files = sorted(
        path for path in os.listdir(DDL_DIR)
        if path.lower().endswith(".sql")
    )
    if not sql_files:
        raise FileNotFoundError(f"未在 {DDL_DIR} 找到 SQL 文件")

    for sql_name in sql_files:
        sql_path = os.path.join(DDL_DIR, sql_name)
        script = build_script(sql_path)
        out_path = os.path.join(OUT_DIR, f"{os.path.splitext(sql_name)[0]}.script")
        write_script_file(script, out_path)
        print(f"generated: {out_path}")


if __name__ == "__main__":
    main()
