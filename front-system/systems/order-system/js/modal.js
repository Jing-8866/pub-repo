// // 模态框管理逻辑
// $(document).ready(function() {
//     // 模态框实例存储
//     const modals = {};
    
//     // 初始化模态框
//     function initModals() {
//         // 通用模态框控制
//         setupModalControls();
        
//         // 加载模态框
//         loadCommonModals();
//     }
    
//     // 设置模态框控制
//     function setupModalControls() {
//         // 关闭按钮点击
//         $(document).on('click', '.close-modal', function() {
//             const modalId = $(this).closest('.modal').attr('id');
//             hideModal(modalId);
//         });
        
//         // ESC键关闭模态框
//         $(document).on('keydown', function(e) {
//             if (e.key === 'Escape') {
//                 hideAllModals();
//             }
//         });
        
//         // 点击模态框背景关闭
//         $(document).on('click', '.modal', function(e) {
//             if (e.target === this && $(this).hasClass('close-on-click-outside')) {
//                 hideModal($(this).attr('id'));
//             }
//         });
//     }
    
//     // 加载通用模态框
//     function loadCommonModals() {
//         // 加载中模态框
//         $('body').append(`
//             <div class="modal loading-modal" id="loadingModal" style="display: none;">
//                 <div class="modal-content">
//                     <div class="loading-spinner"></div>
//                     <div class="loading-text" id="loadingText">处理中...</div>
//                 </div>
//             </div>
//         `);
//     }
    
//     // 显示模态框
//     window.showModal = function(modalId, options = {}) {
//         const $modal = $(`#${modalId}`);
        
//         if (!$modal.length) {
//             console.error(`Modal with id "${modalId}" not found`);
//             return;
//         }
        
//         // 设置选项
//         if (options.title) {
//             $modal.find('.modal-title').text(options.title);
//         }
        
//         if (options.content) {
//             $modal.find('.modal-body').html(options.content);
//         }
        
//         if (options.size) {
//             $modal.find('.modal-content').addClass(options.size);
//         }
        
//         if (options.closeOnClickOutside !== undefined) {
//             if (options.closeOnClickOutside) {
//                 $modal.addClass('close-on-click-outside');
//             } else {
//                 $modal.removeClass('close-on-click-outside');
//             }
//         }
        
//         if (options.onShow) {
//             $modal.off('shown.modal').on('shown.modal', options.onShow);
//         }
        
//         if (options.onHide) {
//             $modal.off('hidden.modal').on('hidden.modal', options.onHide);
//         }
        
//         // 显示模态框
//         $modal.addClass('show').fadeIn(200);
        
//         // 触发显示事件
//         $modal.trigger('shown.modal');
        
//         // 存储模态框实例
//         modals[modalId] = { shown: true, options };
        
//         // 阻止背景滚动
//         $('body').css('overflow', 'hidden');
//     };
    
//     // 隐藏模态框
//     window.hideModal = function(modalId) {
//         const $modal = $(`#${modalId}`);
        
//         if (!$modal.length) {
//             console.error(`Modal with id "${modalId}" not found`);
//             return;
//         }
        
//         $modal.fadeOut(200, function() {
//             $modal.removeClass('show');
//             $modal.trigger('hidden.modal');
            
//             // 清除事件监听器
//             $modal.off('shown.modal hidden.modal');
            
//             // 恢复背景滚动
//             if (Object.values(modals).every(m => !m.shown)) {
//                 $('body').css('overflow', '');
//             }
            
//             // 更新模态框状态
//             if (modals[modalId]) {
//                 modals[modalId].shown = false;
//             }
//         });
//     };
    
//     // 隐藏所有模态框
//     window.hideAllModals = function() {
//         $('.modal.show').each(function() {
//             const modalId = $(this).attr('id');
//             window.hideModal(modalId);
//         });
//     };
    
//     // 显示确认对话框
//     window.showConfirmDialog = function(options) {
//         const {
//             title = '确认操作',
//             message,
//             type = 'warning',
//             confirmText = '确定',
//             cancelText = '取消',
//             onConfirm,
//             onCancel
//         } = options;
        
//         const iconClass = {
//             warning: 'fas fa-exclamation-triangle',
//             danger: 'fas fa-exclamation-circle',
//             info: 'fas fa-info-circle',
//             success: 'fas fa-check-circle'
//         }[type] || 'fas fa-exclamation-triangle';
        
//         const content = `
//             <div class="confirm-dialog ${type}-dialog">
//                 <i class="${iconClass}"></i>
//                 <h4>${title}</h4>
//                 <p>${message}</p>
//             </div>
//         `;
        
//         const $modal = $(`
//             <div class="modal" id="confirmDialogModal">
//                 <div class="modal-content">
//                     <div class="modal-header">
//                         <div class="modal-title">确认操作</div>
//                         <button class="close-modal">&times;</button>
//                     </div>
//                     <div class="modal-body">${content}</div>
//                     <div class="modal-footer">
//                         <button class="btn btn-secondary" id="cancelBtn">${cancelText}</button>
//                         <button class="btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}" id="confirmBtn">${confirmText}</button>
//                     </div>
//                 </div>
//             </div>
//         `);
        
//         $('body').append($modal);
        
//         const modalId = 'confirmDialogModal';
        
//         // 显示模态框
//         window.showModal(modalId, {
//             closeOnClickOutside: false
//         });
        
//         // 绑定按钮事件
//         $(`#${modalId} #confirmBtn`).on('click', function() {
//             if (onConfirm) onConfirm();
//             window.hideModal(modalId);
//         });
        
//         $(`#${modalId} #cancelBtn`).on('click', function() {
//             if (onCancel) onCancel();
//             window.hideModal(modalId);
//         });
//     };
    
//     // 显示提示对话框
//     window.showAlertDialog = function(options) {
//         const {
//             title = '提示',
//             message,
//             type = 'info',
//             buttonText = '确定',
//             onClose
//         } = options;
        
//         const iconClass = {
//             warning: 'fas fa-exclamation-triangle',
//             danger: 'fas fa-exclamation-circle',
//             info: 'fas fa-info-circle',
//             success: 'fas fa-check-circle'
//         }[type] || 'fas fa-info-circle';
        
//         const content = `
//             <div class="confirm-dialog ${type}-dialog">
//                 <i class="${iconClass}"></i>
//                 <h4>${title}</h4>
//                 <p>${message}</p>
//             </div>
//         `;
        
//         const $modal = $(`
//             <div class="modal" id="alertDialogModal">
//                 <div class="modal-content">
//                     <div class="modal-header">
//                         <div class="modal-title">提示</div>
//                         <button class="close-modal">&times;</button>
//                     </div>
//                     <div class="modal-body">${content}</div>
//                     <div class="modal-footer">
//                         <button class="btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}" id="closeBtn">${buttonText}</button>
//                     </div>
//                 </div>
//             </div>
//         `);
        
//         $('body').append($modal);
        
//         const modalId = 'alertDialogModal';
        
//         // 显示模态框
//         window.showModal(modalId, {
//             closeOnClickOutside: false
//         });
        
//         // 绑定按钮事件
//         $(`#${modalId} #closeBtn, #${modalId} .close-modal`).on('click', function() {
//             if (onClose) onClose();
//             window.hideModal(modalId);
//         });
//     };
    
//     // 显示加载中模态框
//     window.showLoading = function(message = '处理中...') {
//         $('#loadingText').text(message);
//         window.showModal('loadingModal');
//     };
    
//     // 隐藏加载中模态框
//     window.hideLoading = function() {
//         window.hideModal('loadingModal');
//     };
    
//     // 初始化模态框
//     initModals();
// });

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
