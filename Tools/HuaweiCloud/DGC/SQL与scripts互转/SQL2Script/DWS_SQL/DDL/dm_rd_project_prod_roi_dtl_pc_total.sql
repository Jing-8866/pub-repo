-- DWS sql 
-- ******************************************************************** --
-- author: 
-- create time: 2026/06/10 23:11:24 GMT+08:00
-- 研发PC端总体情况
-- ******************************************************************** --


DROP TABLE IF EXISTS kl_dm.dm_rd_project_prod_roi_dtl_pc_total;

CREATE TABLE kl_dm.dm_rd_project_prod_roi_dtl_pc_total (
    create_time timestamp default current_timestamp(0) comment '数据创建时间',
    update_time timestamp default current_timestamp(0) comment '数据更新时间',
    year varchar comment '年份代码',
    period varchar comment '会计期间',
    dm bigint comment '年月',
    period_code varchar comment '会计期间编码',
    data_date timestamp comment '数据日期',
    view_id varchar comment '视图',
    unit varchar comment '单位',
    category varchar comment '分类',
    subcategory varchar comment '子分类',
    amt numeric(30,11) comment '本期研发费用',
    amt_yoy numeric(30,11) comment '同期研发费用',
    amt_change numeric(30,11) comment '变动',
    amt_change_rate numeric(30,11) comment '变动率'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '研发PC端总体情况'
;

DROP TABLE IF EXISTS kl_dwr.dwr_rd_project_prod_rl_pc_total_01;

CREATE TABLE kl_dwr.dwr_rd_project_prod_rl_pc_total_01 (
    value_id varchar comment '源项目分类编码',
    value_name varchar comment '源项目分类名称',
    targ_id varchar comment '目标项目分类编码',
    targ_name varchar comment '目标项目分类名称',
    active_date timestamp comment '生效开始',
    expiry_date timestamp comment '生效结束时间'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '项目分类编码映射01表'
;

DROP TABLE IF EXISTS kl_dwr.dwr_rd_project_prod_rl_pc_total_02;

CREATE TABLE kl_dwr.dwr_rd_project_prod_rl_pc_total_02 (
    targ_id varchar comment '目标项目分类编码',
    targ_name varchar comment '目标项目分类名称',
    category varchar comment '分类',
    subcategory varchar comment '子分类'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '项目分类展示分类表'
;

DROP TABLE IF EXISTS kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid01_dt_ctl;

CREATE TABLE kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid01_dt_ctl (
    create_time timestamp default current_timestamp(0) comment '数据创建时间',
    update_time timestamp default current_timestamp(0) on update current_timestamp(0) comment '数据更新时间',
    data_date timestamp comment '数据日期',
    dm bigint comment '年月',
    year varchar comment '年份代码',
    period varchar comment '会计期间',
    period_code varchar comment '会计期间编码',
    data_date_yoy timestamp comment '数据日期_同期',
    data_date_mom timestamp comment '数据日期_上月'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '项目分类展示分类表'
;

DROP TABLE IF EXISTS kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid01_entity_ctl;

CREATE TABLE kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid01_entity_ctl (
    create_time timestamp default current_timestamp(0) comment '数据创建时间',
    update_time timestamp default current_timestamp(0) on update current_timestamp(0) comment '数据更新时间',
    data_date timestamp comment '数据日期',
    entity_id varchar comment '实体编码',
    group_id varchar comment '组织编码'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '小合并实体范围'
;

DROP TABLE IF EXISTS kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid01;

CREATE TABLE kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid01 (
    data_date timestamp comment '数据日期',
    levels varchar comment '优先级',
    busi_id varchar comment '主键',
    proj_id varchar comment '项目编码',
    entity_id varchar comment '实体编码',
    audit_trail_id varchar comment '审计线索编码',
    proj_category_id varchar comment '项目分类编码',
    proj_category_name varchar comment '项目分类名称',
    targ_id varchar comment '配置表对应的分类编码',
    targ_name varchar comment '配置表对应的分类名称',
    group_id_tag varchar comment '组织标签'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '优先级标记'
;

DROP TABLE IF EXISTS kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid02;

CREATE TABLE kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid02 (
    create_time timestamp default current_timestamp(0) comment '数据创建时间',
    update_time timestamp default current_timestamp(0) on update current_timestamp(0) comment '数据更新时间',
    busi_id varchar comment '主键',
    proj_id varchar comment '项目编码',
    entity_id varchar comment '实体编码',
    audit_trail_id varchar comment '审计线索编码',
    targ_id varchar comment '源id',
    targ_name varchar comment '源id名称',
    year varchar comment '年份代码',
    period varchar comment '期间',
    data_date timestamp comment '数据日期',
    unit varchar comment '单位',
    amt numeric(30,11) comment '本期数',
    amt_yoy numeric(30,11) comment '同期数',
    amt_change numeric(30,11) comment '变动'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '按优先级对应的组合从mid03表取数'
;

DROP TABLE IF EXISTS kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid03;

CREATE TABLE kl_dm.dm_rd_project_prod_roi_dtl_pc_total_mid03 (
    create_time timestamp default current_timestamp(0) comment '数据创建时间',
    update_time timestamp default current_timestamp(0) on update current_timestamp(0) comment '数据更新时间',
    data_date timestamp comment '数据日期',
    busi_id varchar comment '主键',
    dm bigint comment '年月',
    year varchar comment '年份代码',
    period varchar comment '会计期间',
    period_code varchar comment '会计期间编码',
    group_id varchar comment '组织编码',
    entity_id varchar comment '实体编码',
    proj_id varchar comment '项目编码',
    audit_trail_level1_id varchar comment '审计线索一级编码',
    audit_trail_level2_id varchar comment '审计线索二级编码',
    audit_trail_id varchar comment '审计线索编码',
    amount numeric(30,11) comment '本期数',
    amount_yoy numeric(30,11) comment '同期数'
)
WITH (ORIENTATION = column, COMPRESSION = MIDDLE, colversion=3.0, enable_hstore_opt = true) DISTRIBUTE BY Roundrobin
comment '数据准备'
;
