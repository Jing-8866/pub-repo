
/*
    递归查询
*/
WITH recursive acct_tmp AS (
    SELECT  t.acct_id AS acct_type
        ,t.acct_name as acct_type_name
        ,t.acct_id
        ,t.acct_name
        ,t.rpt_sort
        ,t.parent_id
        ,t.parent_name
        ,1 as lv
        ,t.is_leaf
		,t.rho_qty
    FROM dwi.dwi_account_conso_rpt2 t
    WHERE t.acct_id IN ('MR0101','MR0110')
    UNION ALL
    SELECT  p.acct_type
        ,p.acct_type_name
        ,t.acct_id
        ,t.acct_name
        ,t.rpt_sort
        ,t.parent_id
        ,t.parent_name
        ,p.lv+1 as lv
        ,t.is_leaf
		,t.rho_qty
    FROM dwi.dwi_account_conso_rpt2 t
    JOIN acct_tmp p
    ON t.parent_id = p.acct_id
)
SELECT *
FROM acct_tmp
-- where is_leaf = '是'
;
