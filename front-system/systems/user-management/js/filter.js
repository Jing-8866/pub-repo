// 用户管理系统筛选功能
$(document).ready(function() {
    // 筛选模态框控制
    function initFilterModal() {
        // 筛选按钮点击
        $(document).on('click', '#filterBtn', function() {
            $('#filterModal').show();
        });
        
        // 关闭筛选模态框
        $(document).on('click', '.close-modal, .modal .btn-secondary', function() {
            $(this).closest('.modal').hide();
        });
        
        // 重置筛选
        $(document).on('click', '#resetFilters', function() {
            $('#filterActive, #filterInactive').prop('checked', true);
            $('#filterRoleAdmin, #filterRoleManager, #filterRoleUser').prop('checked', true);
        });
        
        // 应用筛选
        $(document).on('click', '#applyFilters', function() {
            applyFilters();
        });
        
        // 点击模态框外部关闭
        $(document).on('click', '.modal', function(e) {
            if (e.target === this) {
                $(this).hide();
            }
        });
    }
    
    // 应用筛选条件
    function applyFilters() {
        const showActive = $('#filterActive').is(':checked');
        const showInactive = $('#filterInactive').is(':checked');
        const showAdmin = $('#filterRoleAdmin').is(':checked');
        const showManager = $('#filterRoleManager').is(':checked');
        const showUser = $('#filterRoleUser').is(':checked');
        
        // 这里应该调用主逻辑的筛选函数
        if (typeof window.applyUserFilters === 'function') {
            window.applyUserFilters({
                showActive,
                showInactive,
                showAdmin,
                showManager,
                showUser
            });
        }
        
        $('#filterModal').hide();
    }
    
    // 初始化筛选功能
    initFilterModal();
});