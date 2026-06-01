// 用户管理系统导航栏组件
$(document).ready(function() {
    // 加载侧边栏
    function loadSidebar(currentPage = 'index') {
        const sidebarHTML = `
            <div class="sidebar-header">
                <a class="sidebar-logo">
                    <div class="logo-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="logo-text">
                        <h1>用户管理系统</h1>
                    </div>
                </a>
            </div>
            
            <div class="nav-menu">
                <div class="nav-item">
                    <a href="index.html" class="nav-link ${currentPage === 'index' ? 'active' : ''}">
                        <i class="fas fa-user-friends"></i>
                        <span>用户管理</span>
                    </a>
                </div>
                <!-- <div class="nav-item">
                    <a href="add-user.html" class="nav-link ${currentPage === 'add-user' ? 'active' : ''}">
                        <i class="fas fa-user-plus"></i>
                        <span>添加用户</span>
                    </a>
                </div> -->
                <div class="nav-item">
                    <a href="role-management.html" class="nav-link ${currentPage === 'role-management' ? 'active' : ''}">
                        <i class="fas fa-user-shield"></i>
                        <span>角色管理</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="permission.html" class="nav-link ${currentPage === 'permission' ? 'active' : ''}">
                        <i class="fas fa-key"></i>
                        <span>权限管理</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="#" class="nav-link ${currentPage === 'settings' ? 'active' : ''}">
                        <i class="fas fa-cog"></i>
                        <span>系统设置</span>
                    </a>
                </div>
            </div>
            
            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-avatar">A</div>
                    <div class="user-details">
                        <div class="user-name">管理员</div>
                        <div class="user-role">系统管理员</div>
                    </div>
                </div>
            </div>
        `;
        
        $('#sidebar').html(sidebarHTML);
        
        // 添加移动端菜单按钮
        if ($(window).width() <= 992) {
            $('.main-header .header-left').prepend(`
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <i class="fas fa-bars"></i>
                </button>
            `);
            
            // 移动端菜单按钮事件
            $(document).on('click', '#mobileMenuBtn', function() {
                $('#sidebar').toggleClass('show');
            });
            
            // 点击页面其他地方关闭侧边栏
            $(document).on('click', function(e) {
                if (!$(e.target).closest('#sidebar').length && 
                    !$(e.target).closest('#mobileMenuBtn').length) {
                    $('#sidebar').removeClass('show');
                }
            });
        }
    }
    
    // 加载顶部导航栏
    function loadHeader(pageTitle = '用户管理', pageDesc = '管理用户账户、角色和权限设置') {
        const headerHTML = `
            <div class="header-content">
                <div class="header-left">
                    <div class="page-title">
                        <h2>${pageTitle}</h2>
                        <p>${pageDesc}</p>
                    </div>
                </div>
                
                <!--
                <div class="header-actions">
                    <button class="action-btn" id="refreshBtn" title="刷新">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="action-btn" id="notificationBtn" title="通知">
                        <i class="fas fa-bell"></i>
                    </button>
                    <button class="action-btn" id="helpBtn" title="帮助">
                        <i class="fas fa-question-circle"></i>
                    </button>
                </div>
                -->
                
                <div class="header-right">
                    <button class="btn btn-primary" onclick="location.href='../../index.html'">
                        <i class="fas fa-th-large"></i>
                        <span>返回门户</span>
                    </button>
                </div>
            </div>
        `;
        
        $('#mainHeader').html(headerHTML);
        
        // 添加顶部按钮事件
        $(document).on('click', '#refreshBtn', function() {
            $(this).addClass('rotating');
            setTimeout(() => {
                $(this).removeClass('rotating');
                location.reload();
            }, 1000);
        });
        
        $(document).on('click', '#notificationBtn', function() {
            alert('通知功能待开发');
        });
        
        $(document).on('click', '#helpBtn', function() {
            alert('帮助文档待开发');
        });
    }
    
    // 根据当前页面确定哪个导航项高亮
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename.includes('add-user')) return 'add-user';
        if (filename.includes('edit-user')) return 'edit-user';
        if (filename.includes('role-management')) return 'role-management';
        if (filename.includes('permission')) return 'permission';
        if (filename.includes('index')) return 'index';
        
        return 'index';
    }
    
    // 初始化导航栏
    function initNavigation() {
        const currentPage = getCurrentPage();
        loadSidebar(currentPage);
        
        // 根据页面设置不同的标题
        let pageTitle = '用户管理';
        let pageDesc = '管理用户账户、角色和权限设置';
        
        switch(currentPage) {
            case 'add-user':
                pageTitle = '添加用户';
                pageDesc = '创建新的用户账户';
                break;
            case 'edit-user':
                pageTitle = '编辑用户';
                pageDesc = '修改用户账户信息';
                break;
            case 'role-management':
                pageTitle = '角色管理';
                pageDesc = '管理系统角色';
                break;
            // case 'permission':
            //     pageTitle = '权限管理';
            //     pageDesc = '管理系统功能和操作权限';
            //     break;
        }
        
        loadHeader(pageTitle, pageDesc);
    }
    
    // 执行初始化
    initNavigation();
});