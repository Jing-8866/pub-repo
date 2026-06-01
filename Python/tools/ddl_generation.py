import sys
import os
import pandas as pd

# 当前项目文件路径
current_dir = sys.path[0]
# 配置文件存放的文件夹
config_folder = os.path.join(current_dir, "Config")
ddl_folder = os.path.join(config_folder, 'ddl')
# 模板文件存放文件目录
template_folder = os.path.join(current_dir, 'Template')
# 输出文件存放的文件目录
export_folder = os.path.join(current_dir, 'Output')
# ddl_export_folder = os.path.join(export_folder, 'DDL') # ddl输出的目录

# ddl_export_folder = 'DDL' # ddl输出的目录

blank_space = ' ' * 4


# 创建文件夹
def create_folder(folder_name):
    """
    创建文件夹
    :param folder_name: 文件夹名
    :return:
    """
    folder_path = os.path.join(export_folder, folder_name)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    return folder_path


# 将脚本写输出到指定文件中
def write_to_file(ddl_filename, ddl_scripts):
    """
    将脚本写输出到指定文件中
    :param ddl_filename: 文件名
    :param ddl_scripts: 脚本内容
    :return:
    """
    # open file
    w_ddl = open(ddl_filename, 'w', encoding='utf8')
    # write scripts to filename
    w_ddl.write(ddl_scripts)
    # close file
    w_ddl.close()
    return None


# generation table comment
def comment_table(schema_name, table_name, table_desc):
    """
    生成表注释脚本
    :param schema_name: schema名称
    :param table_name: 表名
    :param table_desc: 表描述
    :return:
    """
    comment_table_sql = "-- Comment TABLE" + '\n'
    comment_table_sql = comment_table_sql + "COMMENT ON TABLE "
    if schema_name is not None and str(schema_name).strip() != 'nan':
        comment_table_sql = comment_table_sql + str(schema_name.lower()) + "."

    if table_desc is None or str(table_desc).strip() == 'nan':
        comment_table_sql = ''
    else:
        comment_table_sql = comment_table_sql + str(table_name.lower()) + " IS '" + table_desc + "';"


    # if table_desc is None or str(table_desc).strip() == 'nan':
    #     column_desc = ''
    # comment_table_sql = "-- Comment TABLE" + '\n'
    # comment_table_sql = comment_table_sql + "COMMENT ON TABLE " + str(schema_name.lower()) + "." + str(table_name.lower()) + " IS '" + table_desc + "'"

    return comment_table_sql


# generation column comment
def comment_column(schema_name, table_name, column_name, column_desc):
    """
    生成字段注释
    :param schema_name: schema名称
    :param table_name: 表名
    :param column_name: 字段名
    :param column_desc: 字段描述
    :return:
    """
    comment_column_sql = "COMMENT ON COLUMN "
    if schema_name is not None and str(schema_name).strip() != 'nan':
        comment_column_sql = comment_column_sql + str(schema_name.lower()) + "."
    if column_desc is None or str(column_desc).strip() == 'nan':
        comment_column_sql = ''
    else:
        comment_column_sql = comment_column_sql + str(table_name.lower()) + "." + str(column_name.lower()) + " IS '" + str(column_desc) + "';" + '\n'
    return comment_column_sql


# 字段格式转换
def column_trans(column_name, datatype):
    """
    DDL字段内容拼接
    :param column_name: 字段名
    :param datatype: 数据类型
    :return:
    """
    return column_name.lower() + " " + datatype.lower()


def column_trans_with_comm(column_name, datatype,column_desc):
    """
    DDL字段内容拼接
    :param column_name: 字段名
    :param datatype: 数据类型
    :param column_desc: 字段描述
    :return:
    """
    if column_desc is None or str(column_desc).strip() == 'nan':
        column_desc = ''
    return column_name.lower() + " " + datatype.lower() + " comment '" + str(column_desc) + "'"


def table_attr(db_type,hash_key,table_desc):
    """
    建表类型描述
    :param db_type: 数据库类型
    :param schema_name: schema名称
    :param hash_key: hash键
    :param table_desc: 表说明
    :return:
    """

    if table_desc is None or str(table_desc).strip() == 'nan':
        table_desc = ''

    if db_type.upper() == "DWS":
        return "WITH (ORIENTATION = COLUMN, COMPRESSION = NO) DISTRIBUTE BY HASH (" + hash_key + ")" + '\n' + "COMMENT = '" + table_desc + "'"
    elif db_type.upper() == "HIVE":
        return "COMMENT = '" + table_desc + "'" + '\n' + "STORED AS ORC"
    elif db_type.upper() == "HUDI":
        return ("USING hudi OPTIONS (" + '\n'
                + blank_space + "TYPE = 'cow'," + '\n'
                + blank_space + "primaryKey = '" + hash_key + "'," + '\n'
                + blank_space + "preCombineField = 'update_time'," + '\n'
                + blank_space + "COMMENT = '" + table_desc + "'" + '\n'
                + ')')
    elif db_type.upper() == "MYSQL":
        return "COMMENT = '" + table_desc + "'"
    else:
        return ""

# generate ddl files
def create_table(db_type):
    """
    生成脚本内容
    :return:
    """
    comment_column_script_t = ""
    # fetch file in path 'ddl_folder'
    for file in os.listdir(ddl_folder):
        ddl_export_folder = file.replace("." + file.split('.')[len(file.split('.')) - 1],"") # ddl输出的目录
        # ddl_export_folder = file.split('.')[len(file.split('.')) - 1]  # ddl输出的目录
        confifile = os.path.join(ddl_folder, file)
        if os.path.isfile(confifile):
            print()
            print("Generation the query file according to file " + file)
            print()
            # read Config information in excel file
            # ddl_info = pd.read_excel(confifile, sheet_name="DWS")
            ddl_info = pd.read_excel(confifile, sheet_name=db_type.lower())
            # total rows in excel that sheetname is "DDL"
            total_row = ddl_info.index.stop
            hash_key = "did"

            for i in ddl_info.index:
                # print("行号：" + str(i))
                column_id = ddl_info['column_id'][i] # 字段序号
                schema_name = str(ddl_info['schema'][i]) # schema
                table_name = str(ddl_info['table_name'][i]) # 表名
                table_desc = str(ddl_info['table_desc'][i]) # 表描述
                column_name = str(ddl_info['column_name'][i]) # 字段名
                datatype = str(ddl_info['dateType'][i]) # 数据类型
                column_desc = str(ddl_info['comment'][i]) # 字段描述
                table_hash_key = str(ddl_info['hash_key'][i]) # hash建

                if table_hash_key is not None and table_hash_key.strip() != 'nan':
                    hash_key = str(column_name)

                if column_id == 1:
                    # 第一个字段
                    ddl_script = ""
                    # target table ddl
                    if db_type.upper() == "HUDI" or db_type.upper() == "HIVE" :
                        # 表名不带schema
                        ddl_script = "-- DROP TABLE IF EXISTS " + table_name + ";" + '\n'
                        ddl_script = ddl_script + "CREATE TABLE " + table_name + " (" + '\n'
                    else:
                        # 表名带schema
                        ddl_script = "-- DROP TABLE IF EXISTS " + schema_name + "." + table_name + ";" + '\n'
                        ddl_script = ddl_script + "CREATE TABLE " + schema_name + "." + table_name + " (" + '\n'


                    if db_type.upper() == "ORACLE":
                        # DDL字段中不含字段注释
                        ddl_script = ddl_script + "     " + str(column_trans(column_name, datatype)) + '\n'
                    else:
                        # DDL字段中含字段注释
                        ddl_script = ddl_script + "     " + str(
                            column_trans_with_comm(column_name, datatype, column_desc)) + '\n'

                    # comment column
                    # comment_column_script = '-- Comment Columns' + '\n'
                    comment_column_script = ''
                    comment_column_script_t = comment_column_script + comment_column(schema_name, table_name,
                                                                                     column_name, column_desc)
                elif i == total_row - 1 or (i < total_row - 1 and ddl_info['column_id'][i + 1] == 1):
                    # 最后一个字段
                    # target table ddl
                    # ddl_script = ddl_script + "    ," + str(column_trans_with_comm(column_name, datatype, column_desc)) + '\n'
                    # ddl_script = ddl_script + ') ' + table_attr(db_type, hash_key, table_desc) + ";" + '\n\n'
                    if db_type.upper() == "ORACLE":
                        # DDL字段中不含字段注释
                        ddl_script = ddl_script + "    ," + str(column_trans(column_name, datatype)) + '\n'
                        ddl_script = ddl_script + ') ' + table_attr(db_type, hash_key, table_desc) + ";" + '\n\n'
                    else:
                        # DDL字段中含字段注释
                        ddl_script = ddl_script + "    ," + str(column_trans_with_comm(column_name, datatype, column_desc)) + '\n'
                        ddl_script = ddl_script + ') ' + table_attr(db_type, hash_key, table_desc) + ";" + '\n\n'

                    if db_type.upper() == "ORACLE":
                        # comment column
                        comment_column_script_t = comment_column_script_t + comment_column(schema_name, table_name,
                                                                                           column_name, column_desc)
                        # comment table
                        ddl_script = ddl_script + comment_table(schema_name, table_name, table_desc) + '\n\n' + comment_column_script_t

                    # create dirs which stored ddl scripts
                    out_ddl_folder_t = create_folder(os.path.join(ddl_export_folder, db_type, schema_name))
                    # ddl file name with folder
                    target_file_name = os.path.join(out_ddl_folder_t, table_name.lower() + '.sql')

                    # 将scripts写入文件
                    print(ddl_script)
                    write_to_file(target_file_name, ddl_script)
                    print()

                else:
                    # 既不是第一个字段，也不是最后一个字段
                    # ddl_script = ddl_script + "    ," + str(column_trans_with_comm(column_name, datatype, column_desc)) + '\n'

                    if db_type.upper() == "ORACLE":
                        # DDL字段中不含字段注释
                        ddl_script = ddl_script + "    ," + str(column_trans(column_name, datatype)) + '\n'
                    else:
                        # DDL字段中含字段注释
                        ddl_script = ddl_script + "    ," + str(column_trans_with_comm(column_name, datatype, column_desc)) + '\n'

                    # comment column
                    comment_column_script_t = comment_column_script_t + comment_column(schema_name, table_name,
                                                                                       column_name, column_desc)



if __name__ == '__main__':
    create_table('dws')
    # create_table('hudi')
    # create_table('hive')
    # create_table('mysql')
    # create_table('oracle')
    exit()
