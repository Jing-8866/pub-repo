// 系统清单数据
const systemList = [
    {
        id: 'user-management',
        name: '用户管理系统',
        description: '管理用户账户、角色和权限',
        icon: 'fas fa-users',
        status: 'active',
        path: 'systems/user-management/index.html'
    }
    ,{
        id: 'order-system',
        name: '订单管理系统',
        description: '处理订单、发货和退款',
        icon: 'fas fa-shopping-cart',
        status: 'maintenance',
        path: 'systems/order-system/index.html'
    }
    // ,{
    //     id: 'campus-system',
    //     name: '校园管理系统',
    //     description: '管理学生、课程和教务',
    //     icon: 'fas fa-university',
    //     status: 'maintenance',
    //     path: 'systems/campus-system/index.html'
    // }
    // ,{
    //     id: 'database-system',
    //     name: '数据库管理系统',
    //     description: '管理数据库、备份和查询',
    //     icon: 'fas fa-database',
    //     status: 'maintenance',
    //     path: 'systems/database-system/index.html'
    // }
    // ,{
    //     id: 'report-system',
    //     name: '报表系统',
    //     description: '生成各类报表和数据分析',
    //     icon: 'fas fa-chart-bar',
    //     status: 'inactive',
    //     path: 'systems/report-system/index.html'
    // }
    // ,{
    //     id: 'log-system',
    //     name: '日志分析平台',
    //     description: '分析系统日志和监控',
    //     icon: 'fas fa-chart-line',
    //     status: 'maintenance',
    //     path: 'systems/log-system/index.html'
    // }
];

// 系统门户配置
const PortalConfig = {
    // 获取所有系统
    getAllSystems: function() {
        return systemList;
    },
    
    // 搜索系统
    searchSystems: function(keyword, filters = {}) {
        let results = this.systems;
        
        // 关键词搜索
        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            results = results.filter(system => 
                system.name.toLowerCase().includes(lowerKeyword) ||
                system.description.toLowerCase().includes(lowerKeyword)
            );
        }
        
        // 状态筛选
        if (filters.activeOnly) {
            results = results.filter(system => system.status === 'active');
        }
        
        return results;
    },
    
    // 获取系统信息
    getSystemInfo: function(systemId) {
        return this.systems.find(system => system.id === systemId);
    },
    
    // 获取所有系统
    // getAllSystems: function() {
    //     return this.systems;
    // },
    
    // 获取状态文本
    getStatusText: function(status) {
        const statusMap = {
            'active': '运行中',
            'maintenance': '维护中',
            'inactive': '已停用'
        };
        return statusMap[status] || '未知状态';
    },
    
    // 获取状态CSS类
    getStatusClass: function(status) {
        const classMap = {
            'active': 'status-active',
            'maintenance': 'status-maintenance',
            'inactive': 'status-inactive'
        };
        return classMap[status] || '';
    }
};

// 使PortalConfig在全局作用域可用
window.PortalConfig = PortalConfig;