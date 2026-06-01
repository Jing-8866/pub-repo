import json

# 打开JSON文件
with open('pathDir/filename.json') as f:
    data = json.load(f)

# print(data)
rst = data.get("links")
# print(len(rst))
for row in range(0,len(rst)):
    cdm_linkname = rst[row].get("name")  # CDM连接名
    cdm_connector = rst[row].get("connector-name")  # 连接类型
    # 获取链接属性
    cdm_config = rst[row].get("link-config-values")
    link_input = cdm_config.get("configs")[0].get("inputs")
    if len(link_input) == 0:
        print(cdm_linkname, '+', cdm_connector)
    else:
        for i in range(0,len(link_input)):
            if link_input[i].get("name") == "linkConfig.databaseType":   # 数据库类型
                db_type = link_input[i].get("value")
            elif link_input[i].get("name") == "linkConfig.host":         # ip地址
                db_ip = link_input[i].get("value")
            elif link_input[i].get("name") == "linkConfig.port":         # 端口
                db_port = link_input[i].get("value")
            elif link_input[i].get("name") == "linkConfig.database":         # 链接数据库
                db_name = link_input[i].get("value")
            elif link_input[i].get("name") == "linkConfig.username":         # 用户名
                db_username = link_input[i].get("value")
            elif link_input[i].get("name") == "linkConfig.password":         # 密码
                db_pwd = link_input[i].get("value")
                if db_pwd == "Add password here.":
                    db_pwd = ""
            continue
        # print(cdm_linkname, '+', cdm_connector, '+', db_type, '+', db_ip, '+', db_port, '+', db_name, '+', db_username, '+', db_pwd)
        print(cdm_linkname, '+', cdm_connector, '+', db_type, '+', db_ip, '+', db_port, '+', db_name, '+', db_username)