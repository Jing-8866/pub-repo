
set query_dop= -16;
set enable_force_vector_engine=on;

with tmp as (
    select DISTINCT
         t.table_type 
        ,t.table_catalog as db_name
        ,t.table_schema as schema_name -- db
        ,t.table_name -- 表名
        -- ,cast(obj_description(relfilenode,'pg_class') as varchar) AS table_desc -- 表别名
        ,obj_description(c.oid,'pg_class') AS table_desc -- 表别名
        ,col.column_name -- 字段名
        ,(case 
            when col.column_name = 'did' and col.column_default like 'nextval%' then 'bigserial'
            when col.data_type = 'bigint' and col.column_default like 'nextval%' then 'bigserial'
            when col.data_type = 'int' and col.column_default like 'nextval%' then 'serial'
            when col.column_name = 'create_time' then 'timestamp default current_timestamp(0)'
            when col.column_name = 'update_time' then 'timestamp default current_timestamp(0) on update current_timestamp(0)'
            when col.data_type = 'numeric' and col.numeric_precision > 0 and col.numeric_scale > 0 then col.data_type || '(' || col.numeric_precision || ',' || col.numeric_scale || ')'
            when col.data_type = 'numeric' and col.numeric_precision > 0 then col.data_type || '(' || col.numeric_precision || ',0' || ')'
            when col.data_type = 'numeric' then col.data_type
            when col.data_type = 'timestamp without time zone' then 'timestamp'
            else col.data_type || (case when col.column_default is not null then ' default ' || col.column_default else '' end)
        end) as data_type -- 数据类型
        ,b.description AS comment
        ,col.ordinal_position -- 字段排序
        ,',' || col.column_name || ' -- ' || b.description as t_sql
        ,',nvl(' || col.column_name || ','''') -- ' || b.description as null_sql
        ,(',' || col.column_name 
            || ' ' || (case 
                when col.column_name = 'did' and col.column_default like 'nextval%' then 'bigserial'
                when col.data_type = 'bigint' and col.column_default like 'nextval%' then 'bigserial'
                when col.data_type = 'int' and col.column_default like 'nextval%' then 'serial'
                when col.column_name = 'create_time' then 'timestamp default current_timestamp(0)'
                when col.column_name = 'update_time' then 'timestamp default current_timestamp(0) on update current_timestamp(0)'
                when col.data_type = 'numeric' and col.numeric_precision > 0 and col.numeric_scale > 0 then col.data_type || '(' || col.numeric_precision || ',' || col.numeric_scale || ')'
                when col.data_type = 'numeric' and col.numeric_precision > 0 then col.data_type || '(' || col.numeric_precision || ',0' || ')'
                when col.data_type = 'numeric' then col.data_type
                when col.data_type = 'timestamp without time zone' then 'timestamp'
                else col.data_type || (case when col.column_default is not null then ' default ' || col.column_default else '' end)
            end) 
            || ' COMMENT ''' || b.description || '''') as ddl_sql
        ,',t.' || col.column_name || ' = s.' || col.column_name || ' -- ' ||b.description as upd_sql
        ,'OR t.' || col.column_name || ' <> s.' || col.column_name || ' -- ' ||b.description as upd_sql2
        ,col.data_type as data_type_src -- 数据类型
        ,col.numeric_precision
        ,col.numeric_scale
        ,col.column_default -- 默认值
        -- ,a.attnum -- 字段排序
    from information_schema.TABLES t 
    join information_schema.COLUMNS col on t.table_schema = col.table_schema and t.table_name = col.table_name
    join pg_class c on t.table_name = c.relname
    join pg_attribute a on a.attrelid = c.oid AND a.attnum > 0 and a.attname = col.column_name -- 字段名
    LEFT JOIN pg_description b ON a.attrelid = b.objoid AND a.attnum = b.objsubid
    join pg_type tp on a.atttypid = tp.oid
    where 1 = 1
        -- and t.table_catalog = 'kl_fin_dws_dev' -- db_name
        -- and t.table_schema in () -- schema_name
        and col.column_default like 'nextval%'
    order by
        t.table_schema, -- db
        t.table_name, -- 表名
        col.ordinal_position -- 字段排序
)
SELECT 
table_type,db_name,schema_name,table_name,table_desc,column_name,comment,data_type,column_default,replace(replace(column_default,'nextval(''',''),'''::regclass)','') as 序列名
FROM tmp
where 1 = 1
-- and data_type like '%serial%'
order by db_name,schema_name,table_type,table_name,column_name
;