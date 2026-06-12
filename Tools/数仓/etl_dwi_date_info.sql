-- DWS sql 
-- ******************************************************************** --
-- author: 
-- create time: 
-- 功能描述: 时间标准表
-- 更新类型: 增量更新
-- 更新频率: 待更新
-- 参数: 待更新 
-- ******************************************************************** --
-- 将初始化时间中间表数据插入到全量表中

MERGE INTO 
	kl_dwi.dwi_date_info T    -- 时间标准表
USING 
	(
	 SELECT 
          to_char(P.date,'yyyy') AS dy,    --分区字段-按年分区
          to_char(P.date,'yyyymmdd') AS day_name,    --日期名称，主键
          P.date AS day_date,    --日期
          extract(day from P.date) AS day_month_name,    --当前日期是本月第几天
          extract(isodow from P.date) AS week_name,    --每周的星期几
          extract(week from P.date) AS week_year_name,    --当前日期是本年第几周
          concat('Q',extract(quarter from P.date)) AS quarter_name,    --当前日期是本年第几季度
          to_char(P.date,'yyyy') AS year_name,    --年名称
          DATE_FORMAT(P.date, '%m') AS month_code,    --月份名称
          DATE_FORMAT(P.date, '%m') AS acct_period,    --会计期
          last_day(P.date) AS month_lst_dt,    --当前日期本月最后一天
          if(P.date=last_day(P.date),'是','否') AS is_month_lst_flag,-- 当前日期是否为本月最后一天
          DATE_TRUNC('quarter', P.date) + INTERVAL '3' MONTH - INTERVAL '1' DAY AS quarter_lst_dt,--当前日期本季度最后一天
          date_trunc('year', P.date) + interval '1 year' - interval '1 day' AS year_end_dt,    --当前日期本年最后一天
          CURRENT_TIMESTAMP AS update_time,    --数据更新时间
          CURRENT_TIMESTAMP AS create_time     --数据创建时间
     FROM 
        (-- 生成时间序列，初始化时间维表
          SELECT 
               date_trunc('day',to_timestamp(s)) AS date -- 调整时间格式为'yyyy-mm-dd hh:mm:ss'
          FROM 
               generate_series(
                            extract(epoch from timestamp '2000-01-01'),-- 设置开始日期 
                            extract(epoch from timestamp '2034-01-01'),-- 设置结束日期
                            24 * 60 * 60 -- one day in seconds
                              ) S
         )P ) M    -- 时间标准表
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
              T.month_lst_dt=M.month_lst_dt,     -- 当前日期本月最后一天
              T.quarter_lst_dt=M.quarter_lst_dt,--当前日期本季度最后一天
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
          T.month_lst_dt,    --当前日期本月最后一天
          T.quarter_lst_dt,--当前日期本季度最后一天
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
          M.month_lst_dt,    --当前日期本月最后一天
          M.quarter_lst_dt,--当前日期本季度最后一天
          M.year_end_dt,    --当前日期本年最后一天
          M.is_month_lst_flag,-- 当前日期是否为本月最后一天
          M.create_time    --数据创建日期
		) ;
		
		--更新半年度最后一天
		--更新上半年
		UPDATE kl_dwi.dwi_date_info a SET a.HALF_YEAR_LST_DT=b.HALF_YEAR_LST_DT
		FROM (
			select distinct year_name,month_code,day_date AS HALF_YEAR_LST_DT
			from kl_dwr.dim_date_info b 
			where month_code='06' and is_month_lst_flag ='是'
		)b  WHERE a.year_name=b.year_name and a.month_code in ('01','02','03','04','05','06')
		;
		
	--更新下半年
	UPDATE kl_dwi.dwi_date_info a SET a.HALF_YEAR_LST_DT=a.year_end_dt WHERE a.month_code in ('07','08','09','10','11','12')
	;
