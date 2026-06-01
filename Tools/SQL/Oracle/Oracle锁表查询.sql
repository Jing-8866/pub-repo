
-- 死锁查询
select s.username,
       s.sid,
       s.serial#,
       decode(l.type, 'TM', 'Table Lock', 'TX', 'Row Lock', null) "Lock Level",
       l.TYPE,
       s.ACTION,
       o.owner,
       o.object_name,
       o.object_type,
       s.terminal,
       s.machine,
       s.module,
       s.logon_time,
       s.lockwait,
       s.command
  from v$session s, v$lock l, dba_objects o
 where s.sid = l.sid
   and o.object_id = l.id1
   and s.username is not Null
   and upper(s.username) = 'BIDW'
 order by s.sid;

-- 查询死掉的进程
SELECT 'alter system kill session ''' || C.SID || '' || ',' || C.SERIAL# || ''';' L_SQL,
       A.OBJECT_ID,
       A.SESSION_ID,
       B.OBJECT_NAME,
       C.*
  FROM V$LOCKED_OBJECT A, DBA_OBJECTS B, V$SESSION C
 WHERE A.OBJECT_ID = B.OBJECT_ID
   AND A.SESSION_ID = C.SID(+)
   AND UPPER(schemaname) ='BIDW' 
 ORDER BY LOGON_TIME;


-- 查看被锁住的session
SELECT S.USERNAME, -- 用户(表空间)
       S.SID, -- session_id
       S.SERIAL#, --   serial# 是序列号
       S.LOGON_TIME, -- 登录时间
       L.LOCKED_MODE
  FROM V$SESSION       S, -- v$Session 是session视图
       V$LOCKED_OBJECT L
 WHERE S.SID = L.SESSION_ID
 ORDER BY S.LOGON_TIME;

-- 查看被锁住的session(带上dba_objects)
-- dba_objects.object_name可以显示对象名等，如表名。这样在kill的时候更有把握些。
SELECT S.SID, -- session_id
       S.SERIAL#, --   serial# 是序列号
       S.USERNAME, -- 用户(表空间)
       S.LOGON_TIME, -- 登录时间
       O.OWNER,
       O.OBJECT_NAME
  FROM V$SESSION       S, -- v$Session 是session视图
       V$LOCKED_OBJECT L,
       DBA_OBJECTS     O
 WHERE S.SID = L.SESSION_ID
   AND L.OBJECT_ID = O.OBJECT_ID
 ORDER BY S.LOGON_TIME;

-- 解锁
-- alter system kill session '5633,12566';  -- sid和serial# 共同确定一条数据

-- 批量解锁语句
SELECT A.OBJECT_NAME,
       B.SESSION_ID,
       C.SERIAL#,
       'alter system kill session ''' || B.SESSION_ID || ',' || C.SERIAL# || '''; ' AS DEAL_SQL,
       C.PROGRAM,
       C.USERNAME,
       C.COMMAND,
       C.MACHINE,
       C.LOCKWAIT
  FROM ALL_OBJECTS A, V$LOCKED_OBJECT B, V$SESSION C
 WHERE A.OBJECT_ID = B.OBJECT_ID
   AND C.SID = B.SESSION_ID;


-- 查看阻塞的语句
SELECT B.SID,
       A.SQL_ID,
       A.SQL_TEXT,
       A.HASH_VALUE,
       B.USERNAME,
       B.MACHINE,
       A.MODULE,
       DECODE(C.BLOCK, 1, 'blocking') BLOCKING,
       DECODE(C.REQUEST, 0, 'null', 'blocked') BLOCKED,
       TO_CHAR(B.LOGON_TIME, 'yyyy-mm-dd hh24:mi:ss')
  FROM V$SQL A, V$SESSION B, V$LOCK C
 WHERE C.TYPE = 'TX'
   AND A.SQL_ID = B.SQL_ID
   AND B.SID = C.SID
UNION ALL
SELECT B.SID,
       A.SQL_ID,
       A.SQL_TEXT,
       A.HASH_VALUE,
       B.USERNAME,
       B.MACHINE,
       A.MODULE,
       DECODE(C.BLOCK, 1, 'blocking') BLOCKING,
       DECODE(C.REQUEST, 0, 'null', 'blocked') BLOCKED,
       TO_CHAR(B.LOGON_TIME, 'yyyy-mm-dd hh24:mi:ss')
  FROM V$SQL A, V$SESSION B, V$LOCK C
 WHERE C.TYPE = 'TX'
   AND A.SQL_ID = B.PREV_SQL_ID
   AND B.SID = C.SID
   AND C.BLOCK = 1 -- BLOCK = 1 表示阻塞了别人
   ;
