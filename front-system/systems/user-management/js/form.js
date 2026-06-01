// 添加用户表单验证逻辑
$(document).ready(function() {
    // 初始化表单
    function initForm() {
        // 提交按钮点击
        $('#submitBtn').on('click', function() {
            if (validateForm()) {
                submitForm();
            }
        });
        
        // 重置按钮
        $('#resetBtn').on('click', function() {
            resetForm();
        });
        
        // 继续添加按钮
        $('#addAnotherBtn').on('click', function() {
            resetForm();
            $('#successMessage').hide();
            $('#userForm').show();
        });
        
        // 实时验证
        $('.form-control').on('blur', function() {
            validateField($(this).attr('id'));
        });
        
        // 实时密码验证
        $('#confirmPassword').on('input', function() {
            validateConfirmPassword();
        });
    }
    
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
            case 'status':
                return validateStatus();
            default:
                return true;
        }
    }
    
    // 验证用户名
    function validateUsername() {
        const username = $('#username').val().trim();
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
        
        if (!username) {
            showError('username', '用户名不能为空');
            return false;
        }
        
        if (!usernameRegex.test(username)) {
            showError('username', '用户名长度应为3-20位，只能包含字母和数字');
            return false;
        }
        
        hideError('username');
        return true;
    }
    
    // 验证密码
    function validatePassword() {
        const password = $('#password').val();
        
        if (!password) {
            showError('password', '密码不能为空');
            return false;
        }
        
        if (password.length < 8 || password.length > 20) {
            showError('password', '密码长度应为8-20位');
            return false;
        }
        
        hideError('password');
        return true;
    }
    
    // 验证确认密码
    function validateConfirmPassword() {
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        
        if (!confirmPassword) {
            showError('confirmPassword', '请确认密码');
            return false;
        }
        
        if (password !== confirmPassword) {
            showError('confirmPassword', '两次输入的密码不一致');
            return false;
        }
        
        hideError('confirmPassword');
        return true;
    }
    
    // 验证昵称
    function validateNickname() {
        const nickname = $('#nickname').val().trim();
        
        if (!nickname) {
            showError('nickname', '昵称不能为空');
            return false;
        }
        
        if (nickname.length > 50) {
            showError('nickname', '昵称长度不能超过50个字符');
            return false;
        }
        
        hideError('nickname');
        return true;
    }
    
    // 验证真实姓名
    function validateRelname() {
        const relname = $('#relname').val().trim();
        
        if (!relname) {
            showError('relname', '真实姓名不能为空');
            return false;
        }
        
        if (relname.length > 50) {
            showError('relname', '真实姓名长度不能超过50个字符');
            return false;
        }
        
        hideError('relname');
        return true;
    }
    
    // 验证角色
    function validateRole() {
        const role = $('#role').val();
        
        if (!role) {
            showError('role', '请选择用户角色');
            return false;
        }
        
        hideError('role');
        return true;
    }
    
    // 验证邮箱
    function validateEmail() {
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError('email', '邮箱不能为空');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showError('email', '请输入有效的邮箱地址');
            return false;
        }
        
        hideError('email');
        return true;
    }
    
    // 验证手机号
    function validatePhone() {
        const phone = $('#phone').val().trim();
        
        if (phone) {
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                showError('phone', '请输入有效的手机号');
                return false;
            }
        }
        
        hideError('phone');
        return true;
    }
    
    // 验证状态
    function validateStatus() {
        const status = $('#status').val();
        
        if (!status) {
            showError('status', '请选择账户状态');
            return false;
        }
        
        hideError('status');
        return true;
    }
    
    // 显示错误信息
    function showError(fieldId, message) {
        $(`#${fieldId}`).addClass('error');
        $(`#${fieldId}Error`).text(message).addClass('show');
    }
    
    // 隐藏错误信息
    function hideError(fieldId) {
        $(`#${fieldId}`).removeClass('error');
        $(`#${fieldId}Error`).removeClass('show');
    }
    
    // 验证整个表单
    function validateForm() {
        let isValid = true;
        
        const fields = ['username', 'password', 'confirmPassword', 'nickname', 'relname', 'role', 'email', 'status'];
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // 手机号是可选字段，只有当有输入时才验证
        if ($('#phone').val().trim()) {
            if (!validatePhone()) {
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // 重置表单
    function resetForm() {
        $('#userForm')[0].reset();
        $('.error-message').removeClass('show');
        $('.form-control').removeClass('error');
    }
    
    // 提交表单
    function submitForm() {
        // 显示加载状态
        const $submitBtn = $('#submitBtn');
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
            // 这里应该调用后端API
            console.log('提交用户数据:', formData);
            
            // 显示成功消息
            $('#userForm').hide();
            $('#successMessage').show();
            
            // 重置按钮状态
            $submitBtn.html('<i class="fas fa-user-plus"></i><span>创建用户</span>');
            $submitBtn.prop('disabled', false);
        }, 1500);
    }
    
    // 初始化表单
    if ($('#userForm').length) {
        initForm();
    }
});