
WITH RECURSIVE dim_hp_base_data AS (
	-- 递归查询维度的所有子代成员
	SELECT 
		 t.object_name as dim_type_id -- 维度类型编码
	    ,t.object_id
		,t.object_name -- 维度编码
		,t.parent_id
		,t.object_type 
		,t.has_children 
		,0 AS lv 
	FROM dwi.dwi_hp_jt_hsp_object_sdi t
	JOIN dwi.dwi_hp_jt_hsp_object_sdi p on t.parent_id = p.object_id
	WHERE p.object_name = 'Dimensions' and t.object_type = p.object_id
	UNION ALL
	SELECT 
	     nodeset.dim_type_id
	    ,tree.object_id
		,tree.object_name
		,tree.parent_id 
		,tree.object_type 
		,tree.has_children 
		, lv + 1 as lv
	FROM dwi.dwi_hp_jt_hsp_object_sdi tree
		,dim_hp_base_data nodeset 
	WHERE tree.parent_id = nodeset.object_id 
)
,dim_hp_base_data_alia AS (
	-- 关联查询出维度编码对应的名称
	SELECT 
		 obj.object_type 
		,obj.dim_type_id
		,obj.object_id as id -- id
		,obj.object_name as dim_id -- 维度编码
		,obj_alia.object_name AS dim_name -- 名称
		,obj.parent_id AS parent_id  -- 父级成员id
		,p_obj.object_name AS p_dim_id -- 父级成员编码
		,p_obj_alia.object_name AS p_dim_name -- 父级成员名称
		,CASE WHEN hm.base_mbrid IS NULL THEN '否' ELSE '是' END AS is_share -- 是否共享成员
		,case when obj.has_children = 1 then '否' else '是' end as is_leaf --是否末级节点
		,obj.lv as dim_level -- 维度层级
	FROM dim_hp_base_data obj
	LEFT JOIN dwi.dwi_hp_jt_hsp_member_sdi HM ON OBJ.OBJECT_ID = HM.MEMBER_ID 
	LEFT JOIN dwi.dwi_hp_jt_hsp_alias_sdi ha ON ha.member_id = (case when hm.base_mbrid is null then obj.object_id else hm.base_mbrid end) -- 别名表
	LEFT JOIN dwi.dwi_hp_jt_hsp_object_sdi obj_alia ON ha.alias_id = obj_alia.object_id -- 根据ALIAS_ID获取ALIA名称
	LEFT JOIN dwi.dwi_hp_jt_hsp_object_sdi p_obj ON obj.parent_id = p_obj.object_id -- 根据object_id获取父级成员object_name
	LEFT JOIN dwi.dwi_hp_jt_hsp_alias_sdi p_ha ON p_ha.member_id = obj.parent_id -- 父级成员别名表
	LEFT JOIN dwi.dwi_hp_jt_hsp_object_sdi p_obj_alia ON p_ha.alias_id = p_obj_alia.object_id -- 根据ALIAS_ID获取父级成员ALIA名称
)
SELECT 
     current_timestamp(0) as update_time
    ,current_timestamp(0) as create_time
    ,'HP' as src_system-- 来源系统
	,dim_type_id || '_' || dim_id || '_' || nvl(p_dim_id,'') as busi_id --业务主键
	,dim_type_id -- 维度类型
	,dim_type_id as dim_type_name -- 维度类型
	,dim_id -- 维度编码
	,nvl(dim_name,dim_id) as dim_name -- 名称
	,dim_level -- 维度层级
	,p_dim_id as parent_id -- 父级成员编码
	,nvl(p_dim_name,p_dim_id) as parent_name -- 父级成员名称
	,is_share -- 是否共享成员
	,is_leaf --是否末级节点
	,0 as is_delete -- 是否删除(0:否;1:是)
FROM dim_hp_base_data_alia
;