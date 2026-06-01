-- 查询维度数据
with dim_hp_base_data as(
        -- 递归查询维度的所有子代成员
        SELECT object_id
                ,object_name
                ,parent_id 
                ,object_type 
                ,has_children 
                ,level AS lv 
        FROM ODS_HP.HSP_OBJECT
        START WITH OBJECT_NAME = 'Product' -- Account,Currency,Customer,DataType,Department,Entity,Factor,Material,Period,Product,Project,Region,Scenario,Spare1,Spare2,Version,Years
        CONNECT BY PRIOR OBJECT_ID = PARENT_ID
)
SELECT
         obj.object_name as prod_id -- 产品编码
        ,obj_alia.object_name AS prod_name -- 名称
        ,p_obj.object_name AS p_prod_id -- 父级成员编码
        ,p_obj_alia.object_name AS p_prod_name -- 父级成员名称
        ,CASE WHEN hm.base_mbrid IS NULL THEN '否' ELSE '是' END AS is_share -- 是否共享成员
        ,case when obj.has_children = 1 then '否' else '是' end as is_leaf --是否末级节点
        ,obj.lv
FROM dim_hp_base_data obj
LEFT JOIN ODS_HP.hsp_member HM ON OBJ.OBJECT_ID = HM.MEMBER_ID 
LEFT JOIN ODS_HP.hsp_alias ha ON ha.member_id = (case when hm.base_mbrid is null then obj.object_id else hm.base_mbrid end) -- 别名表
LEFT JOIN ODS_HP.hsp_object obj_alia ON ha.alias_id = obj_alia.object_id -- 根据ALIAS_ID获取ALIA名称
LEFT JOIN ODS_HP.hsp_object p_obj ON obj.parent_id = p_obj.object_id -- 根据object_id获取父级成员object_name
LEFT JOIN ODS_HP.hsp_alias p_ha ON p_ha.member_id = obj.parent_id -- 父级成员别名表
LEFT JOIN ODS_HP.hsp_object p_obj_alia ON p_ha.alias_id = p_obj_alia.object_id -- 根据ALIAS_ID获取父级成员ALIA名称
WHERE 1 = 1
ORDER BY obj.lv,OBJ.OBJECT_ID