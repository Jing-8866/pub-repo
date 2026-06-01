// 表格操作逻辑
$(document).ready(function() {
    // 表格操作初始化
    function initTableOperations() {
        setupTableActions();
        setupExport();
    }
    
    // 设置表格操作
    function setupTableActions() {
        // 批量操作
        setupBatchOperations();
        
        // 行选择
        setupRowSelection();
        
        // 排序功能
        setupTableSorting();
    }
    
    // 批量操作设置
    function setupBatchOperations() {
        // 批量启用
        $(document).on('click', '#batchEnable', function() {
            const selectedIds = getSelectedUserIds();
            if (selectedIds.length === 0) {
                alert('请先选择要操作的用户');
                return;
            }
            
            if (confirm(`确定要启用选中的 ${selectedIds.length} 个用户吗？`)) {
                batchUpdateStatus(selectedIds, 'active');
            }
        });
        
        // 批量停用
        $(document).on('click', '#batchDisable', function() {
            const selectedIds = getSelectedUserIds();
            if (selectedIds.length === 0) {
                alert('请先选择要操作的用户');
                return;
            }
            
            if (confirm(`确定要停用选中的 ${selectedIds.length} 个用户吗？`)) {
                batchUpdateStatus(selectedIds, 'inactive');
            }
        });
        
        // 批量删除
        $(document).on('click', '#batchDelete', function() {
            const selectedIds = getSelectedUserIds();
            if (selectedIds.length === 0) {
                alert('请先选择要操作的用户');
                return;
            }
            
            if (confirm(`确定要删除选中的 ${selectedIds.length} 个用户吗？此操作不可恢复。`)) {
                batchDeleteUsers(selectedIds);
            }
        });
    }
    
    // 行选择设置
    function setupRowSelection() {
        // 全选/取消全选
        $(document).on('change', '#selectAllCheckbox', function() {
            const isChecked = $(this).prop('checked');
            $('.row-checkbox').prop('checked', isChecked);
            updateSelectionCount();
        });
        
        // 单个行选择
        $(document).on('change', '.row-checkbox', function() {
            updateSelectionCount();
        });
    }
    
    // 获取选中的用户ID
    function getSelectedUserIds() {
        const selectedIds = [];
        $('.row-checkbox:checked').each(function() {
            const userId = $(this).closest('tr').data('user-id');
            if (userId) {
                selectedIds.push(userId);
            }
        });
        return selectedIds;
    }
    
    // 更新选择计数
    function updateSelectionCount() {
        const selectedCount = $('.row-checkbox:checked').length;
        const $counter = $('#selectedCount');
        
        if (selectedCount > 0) {
            $counter.text(`已选择 ${selectedCount} 个用户`).show();
        } else {
            $counter.hide();
        }
        
        // 更新批量操作按钮状态
        $('.batch-operation').prop('disabled', selectedCount === 0);
    }
    
    // 批量更新状态
    function batchUpdateStatus(userIds, status) {
        // 显示加载状态
        const originalText = $('#batchStatusBtn').html();
        $('#batchStatusBtn').html('<i class="fas fa-spinner rotating"></i>处理中...');
        
        // 模拟API调用
        setTimeout(() => {
            if (typeof window.updateUsersStatus === 'function') {
                window.updateUsersStatus(userIds, status);
            }
            
            // 恢复按钮状态
            $('#batchStatusBtn').html(originalText);
            clearSelection();
        }, 1000);
    }
    
    // 批量删除用户
    function batchDeleteUsers(userIds) {
        // 显示加载状态
        const originalText = $('#batchDeleteBtn').html();
        $('#batchDeleteBtn').html('<i class="fas fa-spinner rotating"></i>删除中...');
        
        // 模拟API调用
        setTimeout(() => {
            if (typeof window.deleteUsers === 'function') {
                window.deleteUsers(userIds);
            }
            
            // 恢复按钮状态
            $('#batchDeleteBtn').html(originalText);
            clearSelection();
        }, 1000);
    }
    
    // 清除选择
    function clearSelection() {
        $('.row-checkbox, #selectAllCheckbox').prop('checked', false);
        updateSelectionCount();
    }
    
    // 表格排序
    function setupTableSorting() {
        $('.sortable').on('click', function() {
            const $this = $(this);
            const sortBy = $this.data('sort');
            const sortOrder = $this.hasClass('asc') ? 'desc' : 'asc';
            
            // 清除其他列的排序状态
            $('.sortable').removeClass('asc desc');
            
            // 设置当前列的排序状态
            $this.addClass(sortOrder);
            
            // 调用排序函数
            if (typeof window.sortTable === 'function') {
                window.sortTable(sortBy, sortOrder);
            }
        });
    }
    
    // 导出功能
    function setupExport() {
        $('#exportExcel').on('click', function() {
            exportToExcel();
        });
        
        $('#exportCsv').on('click', function() {
            exportToCsv();
        });
        
        $('#exportPdf').on('click', function() {
            exportToPdf();
        });
    }
    
    // 导出到Excel
    function exportToExcel() {
        if (typeof window.generateExcel === 'function') {
            window.generateExcel();
        } else {
            alert('Excel导出功能待实现');
        }
    }
    
    // 导出到CSV
    function exportToCsv() {
        if (typeof window.generateCsv === 'function') {
            window.generateCsv();
        } else {
            alert('CSV导出功能待实现');
        }
    }
    
    // 导出到PDF
    function exportToPdf() {
        if (typeof window.generatePdf === 'function') {
            window.generatePdf();
        } else {
            alert('PDF导出功能待实现');
        }
    }
    
    // 初始化表格操作
    if ($('#userTable').length) {
        initTableOperations();
    }
});