-- DWS sql
-- ******************************************************************** --
-- author:
-- create time: 2026/06/09
-- 任意门_订单明细底表
-- ******************************************************************** --
-- SELECT * FROM kl_dwi.dwi_bridge_order_dtl_info;

-- ====================================================================
-- Step1: 删除增量范围内主表对应的底表数据
-- 说明: 按 main_id 删除，避免同一订单重复抓取时产生脏数据
-- ====================================================================
DELETE FROM kl_dwi.dwi_bridge_order_dtl_info tgt
WHERE tgt.main_id IN (
    SELECT t.id
    FROM kl_dwi.dwi_dmp_order_main t
    WHERE t.etl_date >= CURRENT_DATE - 2  -- 增量范围: 近2天及以后
);

-- ====================================================================
-- Step2: 整合来源表数据并写入目标表
-- ====================================================================
INSERT INTO kl_dwi.dwi_bridge_order_dtl_info (
     fetch_date              -- 数据抓取日期
    ,main_id                 -- 主键ID
    ,order_id                -- 订单ID（业务ID）
    ,order_sn                -- 订单号
    ,order_type              -- 订单类型
    ,flow_price              -- 实付金额
    ,refund_amount           -- 退款金额
    ,distributor_code        -- 分销员编码
    ,distributor_name        -- 分销员
    ,clerk_name              -- 分销员所属团队
    ,order_status            -- 订单状态编码
    ,order_status_name       -- 订单状态说明（码表映射）
    ,payer_name              -- 购买人姓名
    ,address                 -- 收货地址
    ,logistics_name          -- 快递公司
    ,logistics_no            -- 快递单号
    ,coupon_price_detail     -- 优惠金额明细
    ,discount_type           -- 折扣类型-优惠券
    ,coupon_price            -- 优惠券金额
    ,coupon_now_price        -- 立即领取优惠券金额
    ,ordre_create_time       -- 订单创建时间（业务时间）
    ,order_update_time       -- 订单更新时间（业务时间）
    ,payment_time            -- 付款时间
    ,logistics_time          -- 发货时间
    ,fetch_time              -- 数据抓取时间
    ,order_item_sn           -- 子订单单号
    ,prod_id                 -- 产品编码
    ,goods_id                -- 商品编码
    ,goods_name              -- 商品名称
    ,goods_upc               -- 商品UPC
    ,simple_specs            -- 规格信息
    ,goods_num               -- 下单商品数量
    ,goods_price             -- 商品价格
    ,unit_price              -- 商品单价
    ,unit_wsprice            -- 无税单价
    ,rmbhs                   -- 无税金额
    ,sub_total               -- 小计
    ,hgg_num                 -- 海关申报数量
    ,distribution_name       -- 分销员姓名
    ,distribution_level      -- 分销级别
    ,distribution_money      -- 分销金额
    ,service_sn              -- 售后单号
    ,service_trade_sn        -- 交易编号
    ,service_type            -- 售后类型编码
    ,service_type_name       -- 售后类型说明（码表映射）
    ,service_status          -- 售后单状态编码
    ,service_status_name     -- 售后单状态说明（码表映射）
    ,service_num             -- 申请数量（汇总）
    ,service_apply_refund_price   -- 申请退款金额（汇总）
    ,service_actual_refund_price  -- 实际退款金额（汇总）
    ,service_refund_way      -- 退款方式
    ,service_reason          -- 申请原因
    ,service_problem_desc    -- 问题描述
    ,service_create_time     -- 售后创建时间（业务时间）
    ,service_update_time     -- 售后更新时间（业务时间）
    ,src_system              -- 来源系统
    ,create_time             -- 数据创建时间
    ,update_time             -- 数据更新时间
)

-- --------------------------------------------------------------------
-- CTE: order_main_scope
-- 作用: 确定本次增量处理的主表数据范围
-- 条件: etl_date >= 系统日期-2天
-- --------------------------------------------------------------------
WITH order_main_scope AS (
    SELECT
         t.id
        ,t.order_id
        ,t.sn
        ,t.order_type
        ,t.flow_price
        ,t.refund_amount
        ,t.distributor_code
        ,t.distributor_name
        ,t.clerk_name
        ,t.order_status
        ,t.payer_name
        ,t.address
        ,t.logistics_name
        ,t.logistics_no
        ,t.coupon_price_detail
        ,t.discount_type
        ,t.coupon_price
        ,t.coupon_now_price
        ,t.create_time_col
        ,t.update_time_col
        ,t.payment_time
        ,t.logistics_time
        ,t.fetch_time
    FROM kl_dwi.dwi_dmp_order_main t
    WHERE t.etl_date >= CURRENT_DATE - 2
),

-- --------------------------------------------------------------------
-- CTE: os_filtered
-- 作用: 在汇总前先按主表增量范围缩小 os 数据量，并排除拒绝售后记录
-- 关联: os.main_id = t.id AND os.order_id = t.order_id
-- 过滤: service_status <> 'REFUSE'
-- --------------------------------------------------------------------
os_filtered AS (
    SELECT
         os.main_id
        ,os.order_id
        ,os.order_sn
        ,os.order_item_sn
        ,os.sn
        ,os.trade_sn
        ,os.service_type
        ,os.service_status
        ,os.num
        ,os.apply_refund_price
        ,os.actual_refund_price
        ,os.refund_way
        ,os.reason
        ,os.problem_desc
        ,os.create_time_col
        ,os.update_time_col
        ,os.fetch_time
    FROM kl_dwi.dwi_dmp_order_after_sale os
    INNER JOIN order_main_scope t
        ON os.main_id = t.id
       AND os.order_id = t.order_id
    WHERE NVL(os.service_status, '') <> 'REFUSE'
),

-- --------------------------------------------------------------------
-- CTE: os_agg
-- 作用: 按主键汇总售后数量及退款金额
-- 主键: main_id + order_id + order_item_sn
-- 汇总: num, apply_refund_price, actual_refund_price
-- --------------------------------------------------------------------
os_agg AS (
    SELECT
         os.main_id
        ,os.order_id
        ,os.order_item_sn
        ,SUM(NVL(os.num, 0)) AS num
        ,SUM(NVL(os.apply_refund_price, 0)) AS apply_refund_price
        ,SUM(NVL(os.actual_refund_price, 0)) AS actual_refund_price
    FROM os_filtered os
    GROUP BY
         os.main_id
        ,os.order_id
        ,os.order_item_sn
),

-- --------------------------------------------------------------------
-- CTE: os_latest
-- 作用: 取每组主键下最新一条售后记录（非汇总字段来源）
-- 最新判定: update_time_col DESC, order_item_sn DESC, sn DESC
-- --------------------------------------------------------------------
os_latest AS (
    SELECT
         os.main_id
        ,os.order_id
        ,os.order_sn
        ,os.order_item_sn
        ,os.sn
        ,os.trade_sn
        ,os.service_type
        ,os.service_status
        ,os.refund_way
        ,os.reason
        ,os.problem_desc
        ,os.create_time_col
        ,os.update_time_col
        ,os.fetch_time
        ,ROW_NUMBER() OVER (
            PARTITION BY os.main_id, os.order_id, os.order_item_sn
            ORDER BY os.update_time_col DESC NULLS LAST, os.order_item_sn DESC, os.sn DESC
        ) AS rn
    FROM os_filtered os
),

-- --------------------------------------------------------------------
-- CTE: os_pre
-- 作用: 合并最新记录与汇总结果，得到最终售后预处理结果
-- 规则: 汇总字段取 os_agg，其余字段取 os_latest 最新一条
-- --------------------------------------------------------------------
os_pre AS (
    SELECT
         l.main_id
        ,l.order_id
        ,l.order_sn
        ,l.order_item_sn
        ,l.sn
        ,l.trade_sn
        ,l.service_type
        ,l.service_status
        ,a.num
        ,a.apply_refund_price
        ,a.actual_refund_price
        ,l.refund_way
        ,l.reason
        ,l.problem_desc
        ,l.create_time_col
        ,l.update_time_col
        ,l.fetch_time
    FROM os_latest l
    INNER JOIN os_agg a
        ON a.main_id = l.main_id
       AND a.order_id = l.order_id
       AND a.order_item_sn = l.order_item_sn
    WHERE l.rn = 1
)

-- --------------------------------------------------------------------
-- 主查询: 多表关联整合并映射目标字段
-- 关联关系:
--   t  LEFT JOIN dtl  ON t.id = dtl.main_id AND t.order_id = dtl.order_id
--   t  LEFT JOIN dis  ON t.id = dis.main_id AND t.order_id = dis.order_id
--   dtl LEFT JOIN os  ON dtl.order_id = os.order_id AND dtl.order_item_sn = os.order_item_sn
-- 码表映射:
--   m1: ORDER_STATUS   -> order_status_name
--   m2: SERVICE_TYPE   -> service_type_name
--   m3: SERVICE_STATUS -> service_status_name
-- --------------------------------------------------------------------
SELECT
     to_char(t.fetch_time, 'YYYY-MM-DD') AS fetch_date                    -- 数据抓取日期 <- t.fetch_time
    ,t.id AS main_id                               -- 主键ID <- t.id
    ,t.order_id                                    -- 订单ID <- t.order_id
    ,t.sn AS order_sn                              -- 订单号 <- t.sn
    ,t.order_type                                  -- 订单类型 <- t.order_type
    ,t.flow_price                                  -- 实付金额 <- t.flow_price
    ,t.refund_amount                               -- 退款金额 <- t.refund_amount
    ,t.distributor_code                            -- 分销员编码 <- t.distributor_code
    ,t.distributor_name                            -- 分销员 <- t.distributor_name
    ,t.clerk_name                                  -- 分销员所属团队 <- t.clerk_name
    ,t.order_status                                -- 订单状态编码 <- t.order_status
    ,m1.name AS order_status_name                  -- 订单状态说明 <- m1.name
    ,t.payer_name                                  -- 购买人姓名 <- t.payer_name
    ,t.address                                     -- 收货地址 <- t.address
    ,t.logistics_name                              -- 快递公司 <- t.logistics_name
    ,t.logistics_no                                -- 快递单号 <- t.logistics_no
    ,t.coupon_price_detail                         -- 优惠金额明细 <- t.coupon_price_detail
    ,t.discount_type                               -- 折扣类型 <- t.discount_type
    ,t.coupon_price                                -- 优惠券金额 <- t.coupon_price
    ,t.coupon_now_price                            -- 立即领取优惠券金额 <- t.coupon_now_price
    ,t.create_time_col AS ordre_create_time        -- 订单创建时间 <- t.create_time_col
    ,t.update_time_col AS order_update_time        -- 订单更新时间 <- t.update_time_col
    ,t.payment_time                                -- 付款时间 <- t.payment_time
    ,t.logistics_time                              -- 发货时间 <- t.logistics_time
    ,t.fetch_time                                  -- 数据抓取时间 <- t.fetch_time
    ,dtl.order_item_sn                             -- 子订单单号 <- dtl.order_item_sn
    ,dtl.product_code AS prod_id                   -- 产品编码 <- dtl.product_code
    ,dtl.goods_id                                  -- 商品编码 <- dtl.goods_id
    ,dtl.goods_name                                -- 商品名称 <- dtl.goods_name
    ,dtl.goods_upc                                 -- 商品UPC <- dtl.goods_upc
    ,dtl.simple_specs                              -- 规格信息 <- dtl.simple_specs
    ,dtl.goods_num                                 -- 下单商品数量 <- dtl.goods_num
    ,dtl.goods_price                               -- 商品价格 <- dtl.goods_price
    ,dtl.unit_price                                -- 商品单价 <- dtl.unit_price
    ,dtl.unit_wsprice                              -- 无税单价 <- dtl.unit_wsprice
    ,dtl.rmbhs                                     -- 无税金额 <- dtl.rmbhs
    ,dtl.sub_total                                 -- 小计 <- dtl.sub_total
    ,dtl.hgg_num                                   -- 海关申报数量 <- dtl.hgg_num
    ,dis.distribution_name                         -- 分销员姓名 <- dis.distribution_name
    ,dis.level AS distribution_level               -- 分销级别 <- dis.level
    ,dis.money AS distribution_money               -- 分销金额 <- dis.money
    ,os.sn AS service_sn                           -- 售后单号 <- os.sn
    ,os.trade_sn AS service_trade_sn               -- 交易编号 <- os.trade_sn
    ,os.service_type                               -- 售后类型编码 <- os.service_type
    ,m2.name AS service_type_name                  -- 售后类型说明 <- m2.name
    ,os.service_status                             -- 售后单状态编码 <- os.service_status
    ,m3.name AS service_status_name                -- 售后单状态说明 <- m3.name
    ,os.num AS service_num                         -- 申请数量（汇总） <- os.num
    ,os.apply_refund_price AS service_apply_refund_price    -- 申请退款金额（汇总）
    ,os.actual_refund_price AS service_actual_refund_price  -- 实际退款金额（汇总）
    ,os.refund_way AS service_refund_way           -- 退款方式 <- os.refund_way
    ,os.reason AS service_reason                   -- 申请原因 <- os.reason
    ,os.problem_desc AS service_problem_desc       -- 问题描述 <- os.problem_desc
    ,os.create_time_col AS service_create_time     -- 售后创建时间 <- os.create_time_col
    ,os.update_time_col AS service_update_time     -- 售后更新时间 <- os.update_time_col
    ,'任意门' AS src_system                          -- 来源系统（固定值）
    ,current_timestamp(0) AS create_time             -- 数据创建时间（系统时间）
    ,current_timestamp(0) AS update_time             -- 数据更新时间（系统时间）
FROM order_main_scope t
LEFT JOIN kl_dwi.dwi_dmp_order_item dtl
    ON t.id = dtl.main_id
   AND t.order_id = dtl.order_id
LEFT JOIN kl_dwi.dwi_dmp_order_distribution_wallet dis
    ON t.id = dis.main_id
   AND t.order_id = dis.order_id
LEFT JOIN os_pre os
    ON dtl.order_id = os.order_id
   AND dtl.order_item_sn = os.order_item_sn
LEFT JOIN kl_dwi.dwi_bridge_order_code_enum_mapping_mrp m1
    ON t.order_status = m1.code
   AND m1.platform = '任意门'
   AND m1.type_id = 'ORDER_STATUS'
   AND m1.is_delete = 0
LEFT JOIN kl_dwi.dwi_bridge_order_code_enum_mapping_mrp m2
    ON os.service_type = m2.code
   AND m2.platform = '任意门'
   AND m2.type_id = 'SERVICE_TYPE'
   AND m2.is_delete = 0
LEFT JOIN kl_dwi.dwi_bridge_order_code_enum_mapping_mrp m3
    ON os.service_status = m3.code
   AND m3.platform = '任意门'
   AND m3.type_id = 'SERVICE_STATUS'
   AND m3.is_delete = 0
;
