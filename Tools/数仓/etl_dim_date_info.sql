-- DWS sql 
-- ******************************************************************** --
-- author: 
-- create time: 
-- 功能描述: 时间维度标准
-- 更新类型: 增量更新
-- 更新频率: 待更新
-- 参数: 待更新 
-- ******************************************************************** --
-- 将时间标准表中间表数据插入到全量表中
MERGE INTO 
	kl_dwr.dim_date_info T    -- 时间维度标准
USING 
	(
	 SELECT 
          P.dy,    --分区字段-按年分区
          P.day_name,    --日期名称
          P.day_date,    --日期
          P.day_month_name,    --当前日期是本月第几天
          P.week_name,    --每周的星期几
          P.week_year_name,    --当前日期是本年第几周
          P.quarter_name,    --当前日期是本年第几季度
          P.year_name,    --年名称
          P.month_code,    --月份名称
          P.acct_period,    --会计期
          to_char(P.day_date,'yyyy-mm') as year_month, -- 年-月
          to_char(P.day_date,'yyyymm') as year_month_num, -- 年月
          P.month_lst_dt,    --当前日期本月最后一天
          P.quarter_lst_dt,--当前日期本季度最后一天
          P.is_month_lst_flag,-- 当前日期是否为本月最后一天
          p.HALF_YEAR_LST_DT,--当前日期半年最后一天
          P.year_end_dt,    --当前日期本年最后一天
          CURRENT_TIMESTAMP AS update_time,    --数据更新时间
          CURRENT_TIMESTAMP AS create_time     --数据创建时间
     FROM  kl_dwi.dwi_date_info P ) M    -- 时间标准表
 ON T.day_name = M.day_name    -- 依赖主键
WHEN MATCHED THEN    -- 如果数据主键匹配相同, 则更新数据
	UPDATE SET	
              T.day_date=M.day_date,     -- 日期
              T.day_month_name=M.day_month_name,     -- 当前日期是本月第几天
              T.week_name=M.week_name,     -- 每周的星期几
              T.week_year_name=M.week_year_name,     -- 当前日期是本年第几周
              T.quarter_name=M.quarter_name,     -- 当前日期是本年第几季度
              T.year_name=M.year_name,     -- 年名称
              T.month_code=M.month_code,     -- 月份名称
              T.acct_period=M.acct_period,     -- 会计期
              
              T.year_month=M.year_month,     -- 年-月
              T.year_month_num=M.year_month_num, -- 年月
              
              T.month_lst_dt=M.month_lst_dt,     -- 当前日期本月最后一天
              T.quarter_lst_dt=M.quarter_lst_dt,--当前日期本季度最后一天
              T.HALF_YEAR_LST_DT=M.HALF_YEAR_LST_DT,--当前日期半年最后一天
              T.year_end_dt=M.year_end_dt,     -- 当前日期本年最后一天
              T.is_month_lst_flag=M.is_month_lst_flag,-- 当前日期是否为本月最后一天
              T.update_time=M.update_time     -- 数据更新日期
WHEN NOT MATCHED THEN    -- 如果数据主键不匹配, 则直接插入
	INSERT
		(
          T.dy,    --分区字段-按年分区
          T.day_name,    --日期名称
          T.day_date,    --日期
          T.day_month_name,    --当前日期是本月第几天
          T.week_name,    --每周的星期几
          T.week_year_name,    --当前日期是本年第几周
          T.quarter_name,    --当前日期是本年第几季度
          T.year_name,    --年名称
          T.month_code,    --月份名称
          T.acct_period,    --会计期
          T.year_month,     -- 年-月
          T.year_month_num, -- 年月
          T.month_lst_dt,    --当前日期本月最后一天
          T.quarter_lst_dt,--当前日期本季度最后一天
          T.HALF_YEAR_LST_DT,--当前日期半年最后一天
          T.year_end_dt,    --当前日期本年最后一天
          T.is_month_lst_flag,-- 当前日期是否为本月最后一天
          T.create_time    --数据创建日期
		)
	VALUES
		(
          M.dy,    --分区字段-按年分区
          M.day_name,    --日期名称
          M.day_date,    --日期
          M.day_month_name,    --当前日期是本月第几天
          M.week_name,    --每周的星期几
          M.week_year_name,    --当前日期是本年第几周
          M.quarter_name,    --当前日期是本年第几季度
          M.year_name,    --年名称
          M.month_code,    --月份名称
          M.acct_period,    --会计期
          M.year_month,     -- 年-月
          M.year_month_num, -- 年月
          M.month_lst_dt,    --当前日期本月最后一天
          M.quarter_lst_dt,--当前日期本季度最后一天
          M.HALF_YEAR_LST_DT,--当前日期半年最后一天
          M.year_end_dt,    --当前日期本年最后一天
          M.is_month_lst_flag,-- 当前日期是否为本月最后一天
          M.create_time    --数据创建日期
		) ;
