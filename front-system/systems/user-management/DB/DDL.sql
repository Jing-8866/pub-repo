
create database if not exists my_system;

use my_system;


drop table if exists my_system.user_info;
CREATE TABLE if not exists my_system.user_info (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL COMMENT '用户名',
  nickname varchar(100) DEFAULT NULL COMMENT '昵称',
	relname varchar(100) DEFAULT NULL COMMENT '真实姓名',
  password varchar(255) NOT NULL COMMENT '密码',
  sex int DEFAULT NULL COMMENT '0-未知 1-男 2-女',
  email varchar(100) DEFAULT NULL COMMENT '邮箱',
  mobile_phone varchar(20) DEFAULT NULL COMMENT '手机号码',
  address varchar(255) DEFAULT NULL COMMENT '住址',
	`status` varchar(255) DEFAULT 'Enable' COMMENT '状态。码表类型：USER_STATUS',
  is_delete int DEFAULT '0' COMMENT '是否删除（0:未删除;1:已删除）',
  create_time timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) COMMENT='用户表';

-- SELECT * FROM my_system.user_info;
TRUNCATE TABLE my_system.user_info;
INSERT INTO my_system.user_info (username,relname,nickname,password,sex,email,mobile_phone,address,status) VALUES
('admin','管理员','管理员','admin','1','admin@example.com','13800138000','北京市朝阳区','Enable'),
('demo','普通用户','普通用户','demo','1','demo@example.com','13800138001','北京市朝阳区','Enable'),
('zhangsan','张三','张三','123456','1','zhangsan@example.com','13800138002','','Enable'),
('lisi','李四','李四','123456','2','lisi@example.com','13800138003','','Enable'),
('wangwu','王五','王五','123456','1','wangwu@example.com','13800138004','','Enable'),
('zhaoliu','赵六','赵六','123456','2','zhaoliu@example.com','13800138005','','Approving'),
('sunqi','孙七','孙七','123456','1','sunqi@example.com','13800138006','','Unable'),
('zhouba','周八','周八','123456','2','zhouba@example.com','13800138007','','Enable'),
('wujiu','吴九','吴九','123456','2','wujiu@example.com','13800138008','','Enable'),
('zhengshi','郑十','郑十','123456','1','zhengshi@example.com','13800138009','','Unable'),
('testuser','测试用户','测试用户','123456','1','testuser@example.com','13800138010','','Enable')
;


drop table if exists my_system.role_info;
CREATE TABLE if not exists my_system.role_info (
  id int NOT NULL AUTO_INCREMENT,
  role_code varchar(50) DEFAULT NULL COMMENT '角色编码（ADMIN、USER）',
  role_name varchar(50) DEFAULT NULL COMMENT '角色名称',
  sort int COMMENT '排序',
  sys_code varchar(255) DEFAULT NULL COMMENT '系统编码',
  sys_name varchar(255) DEFAULT NULL COMMENT '系统名称',
  parent_code varchar(50) DEFAULT NULL COMMENT '父级角色',
  remark varchar(50) DEFAULT NULL COMMENT '备注',
  status varchar(50) DEFAULT NULL COMMENT '状态。码表类型：USER_STATUS',
  is_delete int DEFAULT '0' COMMENT '是否删除（0:未删除;1:已删除）',
  create_time timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) COMMENT='角色表';

-- SELECT * FROM my_system.role_info order by sys_code,parent_code,sort;
TRUNCATE TABLE my_system.role_info;
INSERT INTO my_system.role_info(role_code,role_name,sort,sys_code,sys_name,parent_code,remark,status) VALUES
('SUPER_ADMIN','超级管理员','1','ROOT','','','','Enable'),
('ADMIN','管理员','2','Platform','平台用户','SUPER_ADMIN','','Enable'),
('USER','普通用户','3','Platform','平台用户','SUPER_ADMIN','','Enable'),
('GUSSET','访客','4','Platform','平台用户','SUPER_ADMIN','','Enable'),
('ADMIN_ORDER','管理员_订单系统','1','my-order','订单系统','ADMIN','','Enable'),
('USER_ORDER','普通用户_订单系统','2','my-order','订单系统','USER','','Enable'),
('GUSSET_ORDER','访客_订单系统','3','my-order','订单系统','GUSSET','','Enable'),
('ADMIN_DB','管理员_数据库管理系统','1','my-database','数据库管理系统','ADMIN','','Enable'),
('USER_DB','普通用户_数据库管理系统','2','my-database','数据库管理系统','USER','','Enable'),
('GUSSET_DB','访客_数据库管理系统','3','my-database','数据库管理系统','GUSSET','','Enable'),
('ADMIN_SCHOOL','管理员_校园管理系统','1','my-student','校园管理系统','ADMIN','','Enable'),
('USER_SCHOOL','普通用户_校园管理系统','2','my-student','校园管理系统','USER','','Enable'),
('GUSSET_SCHOOL','访客_校园管理系统','3','my-student','校园管理系统','GUSSET','','Enable'),
('Teacher_SCHOOL','教师','1','my-student','校园管理系统','USER_SCHOOL','','Enable'),
('Student_SCHOOL','学生','2','my-student','校园管理系统','USER_SCHOOL','','Enable')
;



drop table if exists my_system.system_list;
CREATE TABLE my_system.system_list (
  id int NOT NULL AUTO_INCREMENT,
  sys_code varchar(255) DEFAULT NULL COMMENT '系统编码',
  sys_name varchar(255) DEFAULT NULL COMMENT '系统名称',
	sys_sort int comment '系统排序',
	sys_category VARCHAR(255) COMMENT '系统分类',
	sys_status varchar(255) COMMENT '系统状态',
  sys_url varchar(1000) DEFAULT NULL COMMENT '系统链接地址',
  icon varchar(1000) DEFAULT NULL COMMENT '系统链接地址',
  icon_color_rgb varchar(1000) DEFAULT NULL COMMENT '系统链接地址',
  sys_desc varchar(1000) DEFAULT NULL COMMENT '系统描述',
  remark varchar(1000) COMMENT '备注',
  is_delete int DEFAULT '0' COMMENT '是否删除（0:未删除;1:已删除）',
  create_time timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) COMMENT='系统清单';

-- select * from my_system.system_list;
-- 初始化系统清单数据
TRUNCATE table my_system.system_list;
INSERT INTO my_system.system_list(sys_code,sys_name,sys_sort,sys_category,sys_status,sys_url,icon,icon_color_rgb,sys_desc,remark) VALUES
('my-user-manage','用户管理系统','1','security','active','systems/user-management.html','fas fa-users-cog','#3498db','管理用户账户、权限和角色的核心系统，支持多级权限分配和用户行为审计。','蓝色'),
('my-order','订单商城管理系统','2','business','inactive','systems/order-system.html','fas fa-shopping-cart','#f39c12','处理电商订单、物流跟踪和库存管理的业务系统，支持多仓库管理。','橙色'),
('my-student','校园管理系统','3','business','inactive','systems/school-system.html','fas fa-folder-open','#d35400','统一校园系统网页入口。包含教师、学生、班级、课程、宿舍的管理控制。','红色'),
('my-server-manage','服务器监控','4','operations','expired','systems/server-monitor.html','fas fa-server','#2ecc71','实时监控服务器状态、资源使用情况和网络流量，提供告警和性能分析功能。','绿色'),
('my-database','数据库管理','5','operations','expired','systems/db-management.html','fas fa-database','#e74c3c','数据库配置、备份、恢复和性能优化工具，支持MySQL、PostgreSQL和Redis。','红色'),
('my-log','日志分析平台','6','operations','inactive','systems/user-logs.html','fas fa-clipboard-list','#1abc9c','集中收集、分析和可视化系统日志，提供实时监控和异常检测。','藏青色')
;


drop table if exists my_system.role_user_relation;
CREATE TABLE if not exists my_system.role_user_relation (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL COMMENT '用户名',
	role_code varchar(255) comment '角色编码',
  is_delete int DEFAULT '0' COMMENT '是否删除（0:未删除;1:已删除）',
  create_time timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) COMMENT='用户角色关系表';

-- SELECT * FROM my_system.role_user_relation ORDER BY username,role_code;
TRUNCATE TABLE my_system.role_user_relation;
INSERT INTO my_system.role_user_relation(username,role_code) VALUES
('admin','SUPER_ADMIN'),
('demo','ADMIN'),
('zhangsan','USER'),
('lisi','GUSSET'),
('wangwu','ADMIN_ORDER'),
('zhaoliu','USER_ORDER'),
('sunqi','GUSSET_ORDER'),
('zhouba','ADMIN_DB'),
('wujiu','USER_DB'),
('zhengshi','GUSSET_DB'),
('testuser','USER')
;



drop table if exists my_system.user_privilege_list;
CREATE TABLE if not exists my_system.user_privilege_list (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL COMMENT '用户名',
	sys_code varchar(255) comment '系统编码',
  is_delete int DEFAULT '0' COMMENT '是否删除（0:未删除;1:已删除）',
  create_time timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) COMMENT='用户权限表';

-- SELECT * FROM my_system.user_privilege_list ORDER BY username,role_code;


