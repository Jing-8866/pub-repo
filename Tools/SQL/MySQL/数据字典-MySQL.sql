-- MySQL
select
    t.table_schema, -- db
    t.table_name, -- 表名
    t.table_comment, -- 表名
    c.column_name, -- 字段名
    c.column_comment, -- 字段描述
    c.column_type, -- 数据类型
    c.ordinal_position -- 字段排序
    ,concat(',',c.COLUMN_NAME ,' -- ',coalesce(c.column_comment,'')) as t_sql
    ,concat(',',c.COLUMN_NAME ,' ',c.column_type,' comment ''',coalesce(c.column_comment,''),'''') as ddl_sql
from information_schema.TABLES t 
join information_schema.COLUMNS c on t.table_schema = c.table_schema and t.table_name = c.table_name
where 1 = 1
	and t.table_schema= 'schema_name'
    and t.table_name = 'table_name'
order by
    t.table_schema, -- db
    t.table_name, -- 表名
    c.ordinal_position -- 字段排序
;