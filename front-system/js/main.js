// 系统门户主页功能
$(document).ready(function() {
    // 更新时间显示
    function updateTime() {
        const now = new Date();
        const formattedTime = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        $('#current-time').text(formattedTime);
    }
    
    // 初始更新时间
    updateTime();
    
    // 每秒更新时间
    setInterval(updateTime, 1000);
    
    // 搜索功能
    function performSearch() {
        const searchTerm = $('#system-search').val().toLowerCase().trim();
        const showActiveOnly = $('#filter-active').is(':checked');
        const showAllSystems = $('#filter-all').is(':checked');
        
        let visibleCards = 0;
        let totalCards = 0;
        
        $('.system-card:not(.add-system)').each(function() {
            const $card = $(this);
            const cardName = $card.data('name').toLowerCase();
            const cardDesc = $card.data('description').toLowerCase();
            const cardStatus = $card.data('status');
            const isAddCard = $card.hasClass('add-system');
            
            if (isAddCard) {
                $card.show();
                return;
            }
            
            totalCards++;
            
            // 检查是否匹配搜索词
            const matchesSearch = !searchTerm || 
                cardName.includes(searchTerm) || 
                cardDesc.includes(searchTerm);
            
            // 检查状态筛选
            const matchesStatus = !showActiveOnly || cardStatus === 'active';
            
            // 检查是否显示所有系统
            const matchesFilter = showAllSystems || matchesStatus;
            
            // 判断是否显示卡片
            if (matchesSearch && matchesFilter) {
                $card.removeClass('hidden').show();
                visibleCards++;
                
                // 添加动画效果
                $card.css({
                    'opacity': '0',
                    'transform': 'translateY(20px)'
                });
                
                setTimeout(() => {
                    $card.css({
                        'opacity': '1',
                        'transform': 'translateY(0)',
                        'transition': 'opacity 0.3s, transform 0.3s'
                    });
                }, 10);
            } else {
                $card.addClass('hidden').hide();
            }
        });
        
        // 更新搜索结果信息
        updateSearchResultsInfo(visibleCards, totalCards, searchTerm);
        
        // 显示/隐藏无结果提示
        if (visibleCards === 0 && !showAllSystems) {
            $('#no-results').show();
            $('#systems-grid').hide();
        } else {
            $('#no-results').hide();
            $('#systems-grid').show();
        }
        
        // 显示/隐藏清空搜索按钮
        if (searchTerm) {
            $('#clear-search').show();
        } else {
            $('#clear-search').hide();
        }
    }
    
    // 更新搜索结果信息
    function updateSearchResultsInfo(visible, total, searchTerm) {
        let infoText = '';
        
        if (searchTerm) {
            if (visible === 0) {
                infoText = `未找到包含 "${searchTerm}" 的系统`;
            } else {
                infoText = `找到 ${visible} 个匹配 "${searchTerm}" 的系统（共 ${total} 个）`;
            }
        } else {
            const showActiveOnly = $('#filter-active').is(':checked');
            
            if (showActiveOnly) {
                infoText = `显示 ${visible} 个运行中的系统（共 ${total} 个）`;
            } else {
                infoText = `显示全部 ${visible} 个系统`;
            }
        }
        
        $('#search-results-info').text(infoText);
    }
    
    // 清空搜索
    function clearSearch() {
        $('#system-search').val('');
        $('#clear-search').hide();
        performSearch();
        $('#system-search').focus();
    }
    
    // 重置搜索和筛选
    function resetSearch() {
        $('#system-search').val('');
        $('#filter-active').prop('checked', true);
        $('#filter-all').prop('checked', true);
        performSearch();
        $('#system-search').focus();
    }
    
    // 系统卡片点击事件
    $('.system-card:not(.add-system)').on('click', function() {
        const systemName = $(this).data('system');
        
        // 添加点击动画效果
        $(this).css({
            'transform': 'scale(0.98)',
            'box-shadow': '0 3px 8px rgba(0, 0, 0, 0.1)'
        });
        
        setTimeout(() => {
            $(this).css({
                'transform': '',
                'box-shadow': ''
            });
        }, 150);
        
        // 跳转到对应系统
        window.location.href = `systems/${systemName}/index.html`;
    });
    
    // 添加系统卡片点击事件
    $('.add-system').on('click', function() {
        alert('添加新系统功能待开发');
    });
    
    // 用户信息点击事件
    $('.user-info').on('click', function() {
        alert('用户信息功能待开发');
    });
    
    // 搜索框输入事件
    $('#system-search').on('input', function() {
        performSearch();
    });
    
    // 清空搜索按钮事件
    $('#clear-search').on('click', function() {
        clearSearch();
    });
    
    // 筛选器变化事件
    $('#filter-active, #filter-all').on('change', function() {
        performSearch();
    });
    
    // 重置搜索按钮事件
    $('#reset-search').on('click', function() {
        resetSearch();
    });
    
    // 搜索框键盘事件
    $('#system-search').on('keydown', function(e) {
        // ESC键清空搜索
        if (e.keyCode === 27) {
            clearSearch();
        }
        
        // Enter键执行搜索
        if (e.keyCode === 13) {
            performSearch();
        }
    });
    
    // 初始执行搜索以显示所有卡片
    performSearch();
});