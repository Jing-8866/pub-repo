-- Query 1: 检查等待中的锁 Check locks with activity details
SELECT 
    l.locktype, 
    l.database, 
    a.datname as db_name,
    l.relation::regclass AS table_name, 
    l.mode, 
    l.granted,
    a.pid,
    a.usename as username,
    a.state,
    a.query,
    a.query_start,
    now() - a.query_start as query_duration
FROM 
    pg_locks l 
JOIN 
    pg_stat_activity a 
ON 
    l.pid = a.pid 
WHERE 
    l.granted = false  -- Show only waiting locks
ORDER BY 
    a.query_start;

-- Query 2: 检查活动会话 Check active sessions
SELECT 
    datname as db_name,
    pid,
    usename as username,
    application_name,
    client_addr,
    state,
    query,
    query_start,
    now() - query_start as query_duration
FROM 
    pg_stat_activity 
WHERE 
    state != 'idle'
ORDER BY 
    query_start;

-- Query 3: 检查具体锁详情 Check lock details
SELECT 
    l.database,
    l.locktype,
    l.relation::regclass AS table_name,
    l.mode,
    l.granted,
    l.pid
FROM 
    pg_locks l
WHERE 
    l.relation is not null
ORDER BY 
    l.relation;
