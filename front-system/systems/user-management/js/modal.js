
// 添加用户模态框逻辑
$(document).ready(function() {
    // 初始化添加用户模态框
    function initAddUserModal() {
        // 添加用户按钮点击
        $(document).on('click', '#addUserBtn', function() {
            showAddUserModal();
        });
        
        // 关闭添加用户模态框
        $(document).on('click', '#closeAddModal, #cancelAddUser, #closeSuccess', function() {
            hideAddUserModal();
        });
        
        // 表单验证函数
        function validateAddUserForm() {
            let isValid = true;
            
            // 验证用户名
            const username = $('#username').val().trim();
            if (username.length < 3 || username.length > 20) {
                showError('username', '用户名长度应在3-20个字符之间');
                isValid = false;
            } else {
                hideError('username');
            }
            
            // 验证密码
            const password = $('#password').val();
            if (password.length < 8 || password.length > 20) {
                showError('password', '密码长度应在8-20个字符之间');
                isValid = false;
            } else {
                hideError('password');
            }
            
            // 验证确认密码
            const confirmPassword = $('#confirmPassword').val();
            if (confirmPassword !== password) {
                showError('confirmPassword', '两次输入的密码不一致');
                isValid = false;
            } else {
                hideError('confirmPassword');
            }
            
            // 验证昵称
            const nickname = $('#nickname').val().trim();
            if (!nickname) {
                showError('nickname', '昵称不能为空');
                isValid = false;
            } else {
                hideError('nickname');
            }
            
            // 验证真实姓名
            const relname = $('#relname').val().trim();
            if (!relname) {
                showError('relname', '真实姓名不能为空');
                isValid = false;
            } else {
                hideError('relname');
            }
            
            // 验证角色
            const role = $('#role').val();
            if (!role) {
                showError('role', '请选择用户角色');
                isValid = false;
            } else {
                hideError('role');
            }
            
            // 验证邮箱
            const email = $('#email').val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showError('email', '请输入有效的邮箱地址');
                isValid = false;
            } else {
                hideError('email');
            }
            
            // 验证手机号（可选）
            const phone = $('#phone').val().trim();
            if (phone) {
                const phoneRegex = /^1[3-9]\d{9}$/;
                if (!phoneRegex.test(phone)) {
                    showError('phone', '请输入有效的手机号');
                    isValid = false;
                } else {
                    hideError('phone');
                }
            }
            
            return isValid;
        }
        
        // 显示错误信息
        function showError(fieldId, message) {
            $(`#${fieldId}`).addClass('error');
            $(`#${fieldId}Error`).text(message).show();
        }
        
        // 隐藏错误信息
        function hideError(fieldId) {
            $(`#${fieldId}`).removeClass('error');
            $(`#${fieldId}Error`).hide();
        }
        
        // 重置表单
        function resetAddUserForm() {
            $('#username').val('');
            $('#password').val('');
            $('#confirmPassword').val('');
            $('#nickname').val('');
            $('#relname').val('');
            $('#role').val('');
            $('#gender').val('男');
            $('#email').val('');
            $('#phone').val('');
            $('#status').val('active');
            $('#remark').val('');
            
            // 清除所有错误信息
            $('.error-message').hide();
            $('.form-control').removeClass('error');
        }
        
        // 提交添加用户
        $(document).on('click', '#submitAddUser', function() {
            if (validateAddUserForm()) {
                // 显示加载状态
                const $submitBtn = $('#submitAddUser');
                $submitBtn.html('<i class="fas fa-spinner rotating"></i><span>创建中...</span>');
                $submitBtn.prop('disabled', true);
                
                // 收集表单数据
                const formData = {
                    username: $('#username').val().trim(),
                    password: $('#password').val(),
                    nickname: $('#nickname').val().trim(),
                    relname: $('#relname').val().trim(),
                    role: $('#role').val(),
                    gender: $('#gender').val(),
                    email: $('#email').val().trim(),
                    phone: $('#phone').val().trim() || null,
                    status: $('#status').val(),
                    remark: $('#remark').val().trim() || null
                };
                
                // 模拟API调用
                setTimeout(() => {
                    // 调用主逻辑的添加用户函数
                    if (typeof window.addNewUser === 'function') {
                        window.addNewUser(formData);
                    }
                    
                    // 显示成功提示
                    $('#userFormContainer').hide();
                    $('#addUserSuccess').show();
                    
                    // 重置按钮状态
                    $submitBtn.html('<i class="fas fa-user-plus"></i><span>创建用户</span>');
                    $submitBtn.prop('disabled', false);
                }, 1500);
            }
        });
        
        // 继续添加用户
        $(document).on('click', '#addAnotherUser', function() {
            $('#userFormContainer').show();
            $('#addUserSuccess').hide();
            resetAddUserForm();
            $('#username').focus();
        });
        
        // 实时验证
        $('.form-control').on('blur', function() {
            validateField($(this).attr('id'));
        });
        
        // 实时密码验证
        $('#confirmPassword').on('input', function() {
            validateConfirmPassword();
        });
        
        // 验证单个字段
        function validateField(fieldId) {
            switch(fieldId) {
                case 'username':
                    return validateUsername();
                case 'password':
                    return validatePassword();
                case 'confirmPassword':
                    return validateConfirmPassword();
                case 'nickname':
                    return validateNickname();
                case 'relname':
                    return validateRelname();
                case 'role':
                    return validateRole();
                case 'email':
                    return validateEmail();
                case 'phone':
                    return validatePhone();
                default:
                    return true;
            }
        }
        
        // 具体的验证函数
        function validateUsername() {
            const username = $('#username').val().trim();
            if (username.length >= 3 && username.length <= 20) {
                hideError('username');
                return true;
            } else {
                showError('username', '用户名长度应在3-20个字符之间');
                return false;
            }
        }
        
        function validatePassword() {
            const password = $('#password').val();
            if (password.length >= 8 && password.length <= 20) {
                hideError('password');
                return true;
            } else {
                showError('password', '密码长度应在8-20个字符之间');
                return false;
            }
        }
        
        function validateConfirmPassword() {
            const password = $('#password').val();
            const confirmPassword = $('#confirmPassword').val();
            if (confirmPassword === password) {
                hideError('confirmPassword');
                return true;
            } else {
                showError('confirmPassword', '两次输入的密码不一致');
                return false;
            }
        }
        
        function validateNickname() {
            const nickname = $('#nickname').val().trim();
            if (nickname) {
                hideError('nickname');
                return true;
            } else {
                showError('nickname', '昵称不能为空');
                return false;
            }
        }
        
        function validateRelname() {
            const relname = $('#relname').val().trim();
            if (relname) {
                hideError('relname');
                return true;
            } else {
                showError('relname', '真实姓名不能为空');
                return false;
            }
        }
        
        function validateRole() {
            const role = $('#role').val();
            if (role) {
                hideError('role');
                return true;
            } else {
                showError('role', '请选择用户角色');
                return false;
            }
        }
        
        function validateEmail() {
            const email = $('#email').val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && emailRegex.test(email)) {
                hideError('email');
                return true;
            } else {
                showError('email', '请输入有效的邮箱地址');
                return false;
            }
        }
        
        function validatePhone() {
            const phone = $('#phone').val().trim();
            if (phone) {
                const phoneRegex = /^1[3-9]\d{9}$/;
                if (phoneRegex.test(phone)) {
                    hideError('phone');
                    return true;
                } else {
                    showError('phone', '请输入有效的手机号');
                    return false;
                }
            }
            return true;
        }
    }
    
    // 显示添加用户模态框
    window.showAddUserModal = function() {
        // 重置表单
        $('#username').val('');
        $('#password').val('');
        $('#confirmPassword').val('');
        $('#nickname').val('');
        $('#relname').val('');
        $('#role').val('');
        $('#gender').val(1);
        $('#email').val('');
        $('#phone').val('');
        $('#status').val('active');
        $('#remark').val('');
        
        // 清除所有错误信息
        $('.error-message').hide();
        $('.form-control').removeClass('error');
        
        // 显示表单
        $('#userFormContainer').show();
        $('#addUserSuccess').hide();
        
        // 显示模态框
        $('#addUserModal').show();
        
        // 聚焦到用户名输入框
        setTimeout(() => {
            $('#username').focus();
        }, 300);
    };
    
    // 隐藏添加用户模态框
    window.hideAddUserModal = function() {
        $('#addUserModal').hide();
    };
    
    // 初始化
    initAddUserModal();
});
