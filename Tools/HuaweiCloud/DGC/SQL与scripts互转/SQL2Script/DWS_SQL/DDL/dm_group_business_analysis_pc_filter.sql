-- DWS sql 
-- ******************************************************************** --
-- author: 
-- create time: 2026/06/10 23:11:24 GMT+08:00
-- 视图日期筛选器
-- ******************************************************************** --


DROP TABLE IF EXISTS kl_dm.dm_group_business_analysis_pc_filter;

CREATE TABLE kl_dm.dm_group_business_analysis_pc_filter (
    view_id varchar comment '视图编码',
    view_name varchar comment '视图名称',
    view_short_name varchar comment '视图名称简称',
    dm bigint comment '分区年月',
    data_date timestamp comment '数据日期',
    year varchar comment '年份',
    year_name varchar comment '年份名称',
    year_month varchar comment '年月',
    period varchar comment '会计期间',
    period_code varchar comment '会计期间编码',
    period_name varchar comment '会计期间名称',
    period_short_name varchar comment '会计期间简称',
    period_num bigint comment '期间序号',
    quarter_code varchar comment '季度编码',
    quarter_name varchar comment '季度名称',
    quarter_short_code varchar comment '季度简称编码',
    quarter_short_name varchar comment '季度简称',
    create_time timestamp default current_timestamp(0) comment '数据创建时间',
    update_time timestamp default current_timestamp(0) on update current_timestamp(0) comment '数据更新时间'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '视图日期筛选器'
;
