// 用户管理系统配置
const UserManagementConfig = {
    // API基础URL
    apiBaseUrl: '/api/user-management',
    
    // 页面配置
    pageConfig: {
        pageSizeOptions: [5, 10, 20, 50],
        defaultPageSize: 5,
        maxVisiblePages: 5
    },
    
    // 状态选项
    statusOptions: [
        { value: 'active', label: '启用' },
        { value: 'inactive', label: '停用' },
        { value: 'pending', label: '待审核' }
    ],
    
    // 角色选项
    roleOptions: [
        { value: 'system_admin', label: '系统管理员' },
        { value: 'admin', label: '管理员' },
        { value: 'user', label: '普通用户' },
        { value: 'guest', label: '访客' }
    ],
    
    // 性别选项
    genderOptions: [
        { value: '男', label: '男' },
        { value: '女', label: '女' },
        { value: '保密', label: '保密' }
    ],
    
    // 导航菜单配置
    menuItems: [
        {
            id: 'user-management',
            name: '用户管理',
            icon: 'fas fa-user-friends',
            url: 'index.html',
            active: true
        },
        {
            id: 'add-user',
            name: '添加用户',
            icon: 'fas fa-user-plus',
            url: 'add-user.html',
            active: false
        },
        {
            id: 'role-management',
            name: '角色管理',
            icon: 'fas fa-user-shield',
            url: 'role-management.html',
            active: false
        },
        {
            id: 'permission-management',
            name: '权限管理',
            icon: 'fas fa-key',
            url: 'permission.html',
            active: false
        },
        {
            id: 'logs',
            name: '操作日志',
            icon: 'fas fa-history',
            url: 'logs.html',
            active: false
        },
        {
            id: 'settings',
            name: '系统设置',
            icon: 'fas fa-cog',
            url: 'settings.html',
            active: false
        }
    ],
    
    // 用户状态颜色映射
    statusColors: {
        active: '#2ecc71',
        inactive: '#e74c3c',
        pending: '#f39c12'
    },
    
    // 搜索配置
    searchConfig: {
        debounceTime: 300, // 防抖时间（毫秒）
        minSearchLength: 1 // 最小搜索字符长度
    },
    
    // 表单验证规则
    validationRules: {
        username: {
            min: 3,
            max: 20,
            regex: /^[a-zA-Z0-9_]+$/,
            errorMessages: {
                required: '用户名不能为空',
                minLength: '用户名长度不能少于3个字符',
                maxLength: '用户名长度不能超过20个字符',
                invalid: '用户名只能包含字母、数字和下划线'
            }
        },
        password: {
            min: 8,
            max: 20,
            errorMessages: {
                required: '密码不能为空',
                minLength: '密码长度不能少于8个字符',
                maxLength: '密码长度不能超过20个字符'
            }
        },
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessages: {
                required: '邮箱不能为空',
                invalid: '请输入有效的邮箱地址'
            }
        },
        phone: {
            regex: /^1[3-9]\d{9}$/,
            errorMessages: {
                invalid: '请输入有效的手机号'
            }
        },
        nickname: {
            min: 1,
            max: 50,
            errorMessages: {
                required: '昵称不能为空',
                maxLength: '昵称长度不能超过50个字符'
            }
        }
    },
    
    // 导出配置
    exportConfig: {
        formats: ['csv', 'excel', 'pdf'],
        defaultFormat: 'excel',
        maxExportRows: 1000
    },
    
    // 本地存储键名
    storageKeys: {
        userFilters: 'user_management_filters',
        userPreferences: 'user_management_preferences',
        recentSearches: 'user_management_recent_searches'
    },
    
    // 获取角色显示文本
    getRoleLabel: function(roleValue) {
        const role = this.roleOptions.find(r => r.value === roleValue);
        return role ? role.label : '未知角色';
    },
    
    // 获取状态显示文本
    getStatusLabel: function(statusValue) {
        const status = this.statusOptions.find(s => s.value === statusValue);
        return status ? status.label : '未知状态';
    },
    
    // 获取状态颜色
    getStatusColor: function(statusValue) {
        return this.statusColors[statusValue] || '#95a5a6';
    },
    
    // 获取性别显示文本
    getGenderLabel: function(genderValue) {
        const gender = this.genderOptions.find(g => g.value === genderValue);
        return gender ? gender.label : '未知';
    },
    
    // 初始化模拟数据
    getMockUsers: function() {
        return [
            { 
                id: 1, 
                username: 'admin', 
                role: 'system_admin', 
                nickname: '超级管理员', 
                gender: '男', 
                phone: '13800138000', 
                email: 'admin@example.com', 
                status: 'active', 
                lastLogin: '2024-01-15 14:30:00',
                createTime: '2024-01-01 10:00:00',
                avatar: 'A'
            },
            { 
                id: 2, 
                username: 'zhangsan', 
                role: 'user', 
                nickname: '张三', 
                gender: '男', 
                phone: '13800138001', 
                email: 'zhangsan@example.com', 
                status: 'active', 
                lastLogin: '2024-01-14 10:20:00',
                createTime: '2024-01-02 11:30:00',
                avatar: 'Z'
            },
            { 
                id: 3, 
                username: 'lisi', 
                role: 'user', 
                nickname: '李四', 
                gender: '女', 
                phone: '13800138002', 
                email: 'lisi@example.com', 
                status: 'active', 
                lastLogin: '2024-01-13 16:45:00',
                createTime: '2024-01-03 14:20:00',
                avatar: 'L'
            },
            { 
                id: 4, 
                username: 'wangwu', 
                role: 'admin', 
                nickname: '王五', 
                gender: '男', 
                phone: '13800138003', 
                email: 'wangwu@example.com', 
                status: 'inactive', 
                lastLogin: '2024-01-10 09:15:00',
                createTime: '2024-01-04 09:45:00',
                avatar: 'W'
            },
            { 
                id: 5, 
                username: 'zhaoliu', 
                role: 'user', 
                nickname: '赵六', 
                gender: '女', 
                phone: '13800138004', 
                email: 'zhaoliu@example.com', 
                status: 'active', 
                lastLogin: '2024-01-12 11:30:00',
                createTime: '2024-01-05 15:10:00',
                avatar: 'Z'
            },
            { 
                id: 6, 
                username: 'sunqi', 
                role: 'admin', 
                nickname: '孙七', 
                gender: '男', 
                phone: '13800138005', 
                email: 'sunqi@example.com', 
                status: 'active', 
                lastLogin: '2024-01-11 13:20:00',
                createTime: '2024-01-06 13:40:00',
                avatar: 'S'
            },
            { 
                id: 7, 
                username: 'zhouba', 
                role: 'user', 
                nickname: '周八', 
                gender: '男', 
                phone: '13800138006', 
                email: 'zhouba@example.com', 
                status: 'inactive', 
                lastLogin: '2024-01-09 15:40:00',
                createTime: '2024-01-07 10:25:00',
                avatar: 'Z'
            },
            { 
                id: 8, 
                username: 'wujiu', 
                role: 'user', 
                nickname: '吴九', 
                gender: '女', 
                phone: '13800138007', 
                email: 'wujiu@example.com', 
                status: 'active', 
                lastLogin: '2024-01-08 14:10:00',
                createTime: '2024-01-08 16:30:00',
                avatar: 'W'
            },
            { 
                id: 9, 
                username: 'zhengshi', 
                role: 'admin', 
                nickname: '郑十', 
                gender: '男', 
                phone: '13800138008', 
                email: 'zhengshi@example.com', 
                status: 'active', 
                lastLogin: '2024-01-07 16:25:00',
                createTime: '2024-01-09 11:15:00',
                avatar: 'Z'
            },
            { 
                id: 10, 
                username: 'testuser', 
                role: 'user', 
                nickname: '测试用户', 
                gender: '女', 
                phone: '13800138009', 
                email: 'test@example.com', 
                status: 'active', 
                lastLogin: '2024-01-06 10:50:00',
                createTime: '2024-01-10 14:00:00',
                avatar: 'T'
            }
        ];
    },
    
    // 获取页面标题
    getPageTitle: function(pageId) {
        const pageTitles = {
            'user-management': '用户管理 - 系统管理门户',
            'add-user': '添加用户 - 用户管理系统',
            'edit-user': '编辑用户 - 用户管理系统',
            'role-management': '角色管理 - 用户管理系统',
            'permission-management': '权限管理 - 用户管理系统',
            'logs': '操作日志 - 用户管理系统',
            'settings': '系统设置 - 用户管理系统'
        };
        return pageTitles[pageId] || '用户管理系统';
    },
    
    // 获取页面描述
    getPageDescription: function(pageId) {
        const pageDescriptions = {
            'user-management': '管理用户账户、角色和权限设置',
            'add-user': '创建新的用户账户',
            'edit-user': '修改用户账户信息',
            'role-management': '管理系统角色和权限分配',
            'permission-management': '管理系统功能和操作权限',
            'logs': '查看系统操作记录',
            'settings': '配置系统参数和选项'
        };
        return pageDescriptions[pageId] || '用户管理系统';
    }
};