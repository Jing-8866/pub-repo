// 初始化用户列表
function getAllUserList(){
    // // 获取用户列表
    // $.getJSON('http://localhost:8080/api/users', function(data) {
    //     console.log('用户数据:', data);
    //     populateUserTable(data);
    // }).fail(function(jqXHR, textStatus, error) {
    //     console.error('获取数据失败:', textStatus, error);
    // });
    
    const mockUsers = [
        { id: 1, username: 'admin', role: '系统管理员', nickname: '超管', relname: '超级管理员', gender: '男', phone: '13800138000', email: 'admin@example.com', status: 'Enable', lastLogin: '2024-01-15 14:30' },
        { id: 2, username: 'zhangsan', role: '普通用户', nickname: '张三', relname: '张三', gender: '男', phone: '13800138001', email: 'zhangsan@example.com', status: 'Enable', lastLogin: '2024-01-14 10:20' },
        { id: 3, username: 'lisi', role: '普通用户', nickname: '李四', relname: '李四', gender: '女', phone: '13800138002', email: 'lisi@example.com', status: 'Pending', lastLogin: '2024-01-13 16:45' },
        { id: 4, username: 'wangwu', role: '管理员', nickname: '王五', relname: '王五', gender: '男', phone: '13800138003', email: 'wangwu@example.com', status: 'Unable', lastLogin: '2024-01-10 09:15' },
        { id: 5, username: 'zhaoliu', role: '普通用户', nickname: '赵六', relname: '赵六', gender: '女', phone: '13800138004', email: 'zhaoliu@example.com', status: 'Enable', lastLogin: '2024-01-12 11:30' },
        { id: 6, username: 'sunqi', role: '管理员', nickname: '孙七', relname: '孙七', gender: '男', phone: '13800138005', email: 'sunqi@example.com', status: 'Enable', lastLogin: '2024-01-11 13:20' },
        { id: 7, username: 'zhouba', role: '普通用户', nickname: '周八', relname: '周八', gender: '男', phone: '13800138006', email: 'zhouba@example.com', status: 'Enable', lastLogin: '2024-01-09 15:40' },
        { id: 8, username: 'wujiu', role: '普通用户', nickname: '吴九', relname: '吴九', gender: '女', phone: '13800138007', email: 'wujiu@example.com', status: 'Enable', lastLogin: '2024-01-08 14:10' },
        { id: 9, username: 'zhengshi', role: '管理员', nickname: '郑十', relname: '郑十', gender: '男', phone: '13800138008', email: 'zhengshi@example.com', status: 'Enable', lastLogin: '2024-01-07 16:25' },
        { id: 10, username: 'testuser', role: '普通用户', nickname: '测试用户', relname: '测试用户', gender: '女', phone: '13800138009', email: 'test@example.com', status: 'Enable', lastLogin: '2024-01-06 10:50' }
    ];
    return mockUsers;
}

// 用户管理系统主逻辑
$(document).ready(function() {

    // 获取用户列表
    const mockUsers = getAllUserList();


    // 分页配置
    const config = {
        pageSize: 5,
        currentPage: 1,
        totalPages: 1
    };

    let currentData = [...mockUsers];
    let filteredData = [...mockUsers];
    let editingUserId = null;
    let deletingUserId = null;
    let lastUserId = Math.max(...mockUsers.map(u => u.id), 0);

    // 初始化
    function init() {
        if ($('#userTable').length) {
            updateAllStats();
            renderTable();
            setupTableEvents();
            setupAddUserModal();
        }
    }

    // 更新所有统计信息
    function updateAllStats() {
        updateUserStats();
        updateTableInfo();
    }

    // 更新用户统计信息
    function updateUserStats() {
        const total = currentData.length;
        const active = currentData.filter(user => user.status === 'Enable').length; // 启用
        const inactive = currentData.filter(user => user.status === 'Unable').length; // 停用
        const pending = currentData.filter(user => user.status === 'Pending').length; // 待审核
        
        // 获取今天的日期
        const today = new Date().toISOString().split('T')[0];
        const todayNew = currentData.filter(user => user.createdDate === today).length;
        
        // 计算百分比
        const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0;
        const inactivePercentage = total > 0 ? Math.round((inactive / total) * 100) : 0;
        const pendingPercentage = total > 0 ? Math.round((pending / total) * 100) : 0;
        
        // 更新总用户数
        $('#totalUsers').text(total);
        
        // 更新启用用户
        $('#activeUsers').text(active);
        $('#activePercentage').text(activePercentage + '%');
        
        // 更新停用用户
        $('#inactiveUsers').text(inactive);
        $('#inactivePercentage').text(inactivePercentage + '%');
        
        // 待审核用户
        $('#pendingUsers').text(pending);
        $('#pendingPercentage').text(pendingPercentage + '%');
        
        // 更新今日新增
        $('#todayNewUsers').text(todayNew);
        
        // 更新趋势文本
        updateTrendText(activePercentage, inactivePercentage,pendingPercentage);
    }

    // 更新趋势文本
    function updateTrendText(activePercentage, inactivePercentage, pendingPercentage) {
        const $activeText = $('#activePercentage');
        const $inactiveText = $('#inactivePercentage');
        const $pendingText = $('#pendingPercentage');
        
        // 移除现有样式
        $activeText.removeClass('high medium low');
        $inactiveText.removeClass('high medium low');
        $pendingText.removeClass('high medium low');
        
        // 为启用百分比添加样式
        if (activePercentage >= 80) {
            $activeText.addClass('high');
        } else if (activePercentage >= 60) {
            $activeText.addClass('medium');
        } else {
            $activeText.addClass('low');
        }
        
        // 为停用百分比添加样式
        if (inactivePercentage <= 10) {
            $inactiveText.addClass('low');
        } else if (inactivePercentage <= 20) {
            $inactiveText.addClass('medium');
        } else {
            $inactiveText.addClass('high');
        }
        
        // 为待审核添加样式
        if (pendingPercentage <= 10) {
            $pendingText.addClass('low');
        } else if (pendingPercentage <= 20) {
            $pendingText.addClass('medium');
        } else {
            $pendingText.addClass('high');
        }
    }

    // 渲染表格
    function renderTable() {
        const start = (config.currentPage - 1) * config.pageSize;
        const end = start + config.pageSize;
        const pageData = filteredData.slice(start, end);
        
        const $tbody = $('#userTableBody');
        $tbody.empty();

        pageData.forEach((user, index) => {
            const rowNum = start + index + 1;
            // const statusText = user.status === 'active' ? '启用' : '停用';
            // const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';

            const userStatus = user.status 
            let statusText = ''
            let statusClass = ''


            if (userStatus == 'Enable') {
                statusText = '启用'
                statusClass = 'status-active'
            } else if (userStatus == 'Pending') {
                statusText = '待审核'
                statusClass = 'status-pending'
            } else {
                statusText = '停用'
                statusClass = 'status-inactive'
            }
            
            const row = `
                <tr data-user-id="${user.id}">
                    <td>${rowNum}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>${user.nickname}</td>
                    <td>${user.relname}</td>
                    <td>${user.gender}</td>
                    <td>${user.phone || '未设置'}</td>
                    <td>${user.email || '未设置'}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${user.lastLogin || '从未登录'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit-btn" data-user-id="${user.id}" title="编辑">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" data-user-id="${user.id}" title="删除">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="action-btn role-btn" data-user-id="${user.id}" title="角色管理">
                                <i class="fas fa-user-shield"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            
            $tbody.append(row);
        });

        // 如果没有数据
        if (filteredData.length === 0) {
            $tbody.append(`
                <tr>
                    <td colspan="10" style="text-align: center; padding: 40px; color: #6c757d;">
                        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        没有找到匹配的用户
                    </td>
                </tr>
            `);
        }

        updatePagination();
        updateTableInfo();
    }

    // 更新分页
    function updatePagination() {
        config.totalPages = Math.ceil(filteredData.length / config.pageSize);
        if (config.totalPages === 0) config.totalPages = 1;
        
        if (config.currentPage > config.totalPages) {
            config.currentPage = config.totalPages;
        }

        const $pageNumbers = $('#pageNumbers');
        $pageNumbers.empty();

        // 显示最多5个页码
        let startPage = Math.max(1, config.currentPage - 2);
        let endPage = Math.min(config.totalPages, config.currentPage + 2);
        
        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(config.totalPages, 5);
            } else {
                startPage = Math.max(1, config.totalPages - 4);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = $(`<div class="page-number">${i}</div>`);
            
            if (i === config.currentPage) {
                pageBtn.addClass('active');
            }
            
            pageBtn.on('click', () => {
                config.currentPage = i;
                renderTable();
            });
            
            $pageNumbers.append(pageBtn);
        }

        // 更新按钮状态
        $('#firstPage').prop('disabled', config.currentPage === 1);
        $('#prevPage').prop('disabled', config.currentPage === 1);
        $('#nextPage').prop('disabled', config.currentPage === config.totalPages);
        $('#lastPage').prop('disabled', config.currentPage === config.totalPages);

        // 更新分页信息
        const start = (config.currentPage - 1) * config.pageSize + 1;
        const end = Math.min(config.currentPage * config.pageSize, filteredData.length);
        const total = filteredData.length;
        
        $('#paginationInfo').text(`显示 ${start}-${end} 条，共 ${total} 条`);
    }

    // 更新表格信息
    function updateTableInfo() {
        const total = filteredData.length;
        const active = filteredData.filter(user => user.status === 'active').length;
        const inactive = filteredData.filter(user => user.status === 'inactive').length;
        
        $('#tableInfo').html(`
            共 <strong>${total}</strong> 个用户
            <span class="table-stat-separator">|</span>
            <span class="table-stat-item">启用: <strong>${active}</strong></span>
            <span class="table-stat-separator">|</span>
            <span class="table-stat-item">停用: <strong>${inactive}</strong></span>
        `);
    }

    // 搜索功能
    function performSearch() {
        const keyword = $('#searchInput').val().toLowerCase().trim();
        
        if (!keyword) {
            filteredData = [...currentData];
        } else {
            filteredData = currentData.filter(user => 
                user.username.toLowerCase().includes(keyword) ||
                user.nickname.toLowerCase().includes(keyword) ||
                user.relname.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword) ||
                (user.phone && user.phone.includes(keyword)) ||
                user.role.toLowerCase().includes(keyword)
            );
        }
        
        config.currentPage = 1;
        renderTable();
        updateAllStats();
    }

    // 应用筛选
    window.applyUserFilters = function(filters) {
        const { showActive, showInactive, showAdmin, showManager, showUser } = filters;
        
        filteredData = currentData.filter(user => {
            // 状态筛选
            if (user.status === 'active' && !showActive) return false;
            if (user.status === 'inactive' && !showInactive) return false;
            
            // 角色筛选
            if (user.role === '系统管理员' && !showAdmin) return false;
            if (user.role === '管理员' && !showManager) return false;
            if (user.role === '普通用户' && !showUser) return false;
            
            return true;
        });

        config.currentPage = 1;
        renderTable();
        updateAllStats();
    }

    // 添加新用户
    window.addNewUser = function(formData) {
        // 检查用户名是否已存在
        if (currentData.some(u => u.username === formData.username)) {
            alert('用户名已存在，请使用其他用户名');
            return false;
        }
        
        // 生成新用户ID
        lastUserId++;
        
        // 获取当前日期
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const newUser = {
            id: lastUserId,
            username: formData.username,
            role: formData.role,
            nickname: formData.nickname,
            relname: formData.relname,
            gender: formData.gender,
            phone: formData.phone || null,
            email: formData.email,
            status: formData.status,
            lastLogin: null,
            createdDate: today
        };
        
        // 添加到数据
        currentData.unshift(newUser);
        
        // 更新表格
        performSearch();
        
        return true;
    };

    // 设置表格事件
    function setupTableEvents() {
        // 搜索框输入
        $('#searchInput').on('input', debounce(performSearch, 300));
        
        // 导出按钮
        $('#exportBtn').on('click', function() {
            alert('导出功能待开发');
        });
        
        // 分页按钮
        $('#firstPage').on('click', function() {
            if (config.currentPage > 1) {
                config.currentPage = 1;
                renderTable();
            }
        });

        $('#prevPage').on('click', function() {
            if (config.currentPage > 1) {
                config.currentPage--;
                renderTable();
            }
        });

        $('#nextPage').on('click', function() {
            if (config.currentPage < config.totalPages) {
                config.currentPage++;
                renderTable();
            }
        });

        $('#lastPage').on('click', function() {
            if (config.currentPage < config.totalPages) {
                config.currentPage = config.totalPages;
                renderTable();
            }
        });

        // 编辑用户
        $(document).on('click', '.edit-btn', function() {
            const userId = parseInt($(this).data('user-id'));
            alert('编辑功能待开发，用户ID: ' + userId);
        });

        // 删除用户
        $(document).on('click', '.delete-btn', function() {
            const userId = parseInt($(this).data('user-id'));
            openDeleteModal(userId);
        });

        // 角色管理
        $(document).on('click', '.role-btn', function() {
            const userId = parseInt($(this).data('user-id'));
            alert('角色管理功能待开发，用户ID: ' + userId);
        });
    }

    // 设置添加用户模态框
    function setupAddUserModal() {
        // 添加用户按钮点击
        $('#addUserBtn').on('click', function() {
            showAddUserModal();
        });
        
        // 关闭添加用户模态框
        $('#closeAddModal, #cancelAdd').on('click', function() {
            hideAddUserModal();
        });
        
        // 提交表单
        $('#addUserForm').on('submit', function(e) {
            e.preventDefault();
            submitAddUserForm();
        });
        
        // 点击模态框外部关闭
        $('#addUserModal').on('click', function(e) {
            if (e.target === this) {
                hideAddUserModal();
            }
        });
        
        // 表单验证
        setupFormValidation();
    }

    // 显示添加用户模态框
    function showAddUserModal() {
        // 重置表单
        resetAddUserForm();
        $('#addUserModal').show();
        
        // 居中显示模态框
        centerModal('addUserModal');
    }

    // 隐藏添加用户模态框
    function hideAddUserModal() {
        $('#addUserModal').hide();
    }

    // 重置添加用户表单
    function resetAddUserForm() {
        $('#addUserForm')[0].reset();
        clearFormErrors();
    }

    // 清除表单错误
    function clearFormErrors() {
        $('.error-message').removeClass('show');
        $('.form-control').removeClass('error');
    }

    // 表单验证设置
    function setupFormValidation() {
        // 实时验证
        $('.form-control').on('blur', function() {
            validateField($(this).attr('id'));
        });
        
        // 实时密码验证
        $('#addConfirmPassword').on('input', function() {
            validateConfirmPassword();
        });
    }

    // 验证字段
    function validateField(fieldId) {
        const value = $(`#${fieldId}`).val().trim();
        let isValid = true;
        let errorMessage = '';
        
        switch(fieldId) {
            case 'addUsername':
                if (!value) {
                    errorMessage = '用户名不能为空';
                    isValid = false;
                } else if (value.length < 3 || value.length > 20) {
                    errorMessage = '用户名长度应为3-20位';
                    isValid = false;
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    errorMessage = '用户名只能包含字母、数字和下划线';
                    isValid = false;
                }
                break;
                
            case 'addPassword':
                if (!value) {
                    errorMessage = '密码不能为空';
                    isValid = false;
                } else if (value.length < 8 || value.length > 20) {
                    errorMessage = '密码长度应为8-20位';
                    isValid = false;
                }
                break;
                
            case 'addConfirmPassword':
                isValid = validateConfirmPassword();
                break;
                
            case 'addNickname':
                if (!value) {
                    errorMessage = '昵称不能为空';
                    isValid = false;
                } else if (value.length > 50) {
                    errorMessage = '昵称长度不能超过50个字符';
                    isValid = false;
                }
                break;
                
            case 'addRelname':
                if (!value) {
                    errorMessage = '真实姓名不能为空';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = '真实姓名长度不能少于2个字符';
                    isValid = false;
                } else if (value.length > 50) {
                    errorMessage = '真实姓名长度不能超过50个字符';
                    isValid = false;
                }
                break;
                
            case 'addRole':
                if (!value) {
                    errorMessage = '请选择用户角色';
                    isValid = false;
                }
                break;
                
            case 'addEmail':
                if (!value) {
                    errorMessage = '邮箱不能为空';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = '请输入有效的邮箱地址';
                    isValid = false;
                }
                break;
                
            case 'addPhone':
                if (value && !/^1[3-9]\d{9}$/.test(value)) {
                    errorMessage = '请输入有效的手机号';
                    isValid = false;
                }
                break;
                
            case 'addStatus':
                if (!value) {
                    errorMessage = '请选择账户状态';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid && errorMessage) {
            showError(fieldId, errorMessage);
        } else {
            hideError(fieldId);
        }
        
        return isValid;
    }

    // 验证确认密码
    function validateConfirmPassword() {
        const password = $('#addPassword').val();
        const confirmPassword = $('#addConfirmPassword').val();
        const fieldId = 'addConfirmPassword';
        
        if (!confirmPassword) {
            showError(fieldId, '请确认密码');
            return false;
        }
        
        if (password !== confirmPassword) {
            showError(fieldId, '两次输入的密码不一致');
            return false;
        }
        
        hideError(fieldId);
        return true;
    }

    // 显示错误
    function showError(fieldId, message) {
        $(`#${fieldId}`).addClass('error');
        $(`#${fieldId}Error`).text(message).addClass('show');
    }

    // 隐藏错误
    function hideError(fieldId) {
        $(`#${fieldId}`).removeClass('error');
        $(`#${fieldId}Error`).removeClass('show');
    }

    // 验证整个表单
    function validateForm() {
        let isValid = true;
        
        const requiredFields = [
            'addUsername',
            'addPassword',
            'addConfirmPassword',
            'addNickname',
            'addRelname',
            'addRole',
            'addEmail',
            'addStatus'
        ];
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // 手机号是可选字段，只有当有输入时才验证
        if ($('#addPhone').val().trim()) {
            if (!validateField('addPhone')) {
                isValid = false;
            }
        }
        
        return isValid;
    }

    // 提交添加用户表单
    function submitAddUserForm() {
        if (!validateForm()) {
            alert('请检查表单中的错误信息');
            return;
        }
        
        // 显示加载状态
        const $submitBtn = $('#addUserForm button[type="submit"]');
        const originalText = $submitBtn.html();
        $submitBtn.html('<i class="fas fa-spinner rotating"></i>添加中...');
        $submitBtn.prop('disabled', true);
        
        // 收集表单数据
        const formData = {
            username: $('#addUsername').val().trim(),
            role: $('#addRole').val(),
            nickname: $('#addNickname').val().trim(),
            relname: $('#addRelname').val().trim(),
            gender: $('#addGender').val(),
            phone: $('#addPhone').val().trim() || null,
            email: $('#addEmail').val().trim(),
            status: $('#addStatus').val()
        };
        
        // 模拟API调用延迟
        setTimeout(() => {
            // 调用添加用户函数
            const success = window.addNewUser(formData);
            
            if (success) {
                // 显示成功消息
                alert('用户添加成功！');
                
                // 重置表单并关闭模态框
                resetAddUserForm();
                hideAddUserModal();
            }
            
            // 恢复按钮状态
            $submitBtn.html(originalText);
            $submitBtn.prop('disabled', false);
        }, 1500);
    }

    // 居中显示模态框
    function centerModal(modalId) {
        const $modal = $(`#${modalId}`);
        const $content = $modal.find('.modal-content');
        
        $content.css({
            'margin': 'auto',
            'position': 'relative',
            'top': '50%',
            'transform': 'translateY(-50%)'
        });
    }

    // 打开删除确认模态框
    function openDeleteModal(userId) {
        const user = currentData.find(u => u.id === userId);
        if (!user) return;

        deletingUserId = userId;
        // $('#deleteUserName').text(user.nickname + ' (' + user.username + ')');
        $('#deleteUserName').text(user.username + ' 【' + user.relname + ' (昵称：' + user.nickname + ')】');
        $('#deleteModal').show();
    }

    // 删除用户
    function deleteUser() {
        const index = currentData.findIndex(u => u.id === deletingUserId);
        if (index !== -1) {
            currentData.splice(index, 1);
            alert('用户删除成功');
            $('#deleteModal').hide();
            performSearch();
        }
    }

    // 设置删除模态框事件
    function setupDeleteModal() {
        $('#confirmDelete').on('click', deleteUser);
        $('#cancelDelete, #closeDeleteModal').on('click', function() {
            $('#deleteModal').hide();
        });
        
        // 点击模态框外部关闭
        $('#deleteModal').on('click', function(e) {
            if (e.target === this) {
                $(this).hide();
            }
        });
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 初始化
    if ($('#userTable').length) {
        init();
        setupDeleteModal();
    }
});
