// 搜索功能
function searchLinks() {
    const input = document.getElementById('searchInput');
    const searchTerm = input.value.trim().toLowerCase();
    const linkCards = document.querySelectorAll('.link-card');

    // 空搜索时重置全部显示
    if (searchTerm === '') {
        linkCards.forEach(card => {
            card.style.display = 'flex';
            card.style.animation = '';
        });
        return;
    }

    linkCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s';
            // 若匹配项在折叠栏目内，自动展开
            const detail = card.closest('details');
            if (detail) detail.open = true;
        } else {
            card.style.display = 'none';
        }
    });
}

// 回车搜索
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchLinks();
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 页面加载动画
window.addEventListener('load', function() {
    document.querySelectorAll('.category').forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        setTimeout(() => {
            category.style.transition = 'all 0.5s ease';
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 医保信息：每日自动加载 info.json
(function loadMedInfo() {
    const map = { national: 'info-national', provincial: 'info-provincial', media: 'info-media' };
    fetch('info.json?t=' + Date.now())
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            if (data.updated) {
                const u = document.getElementById('info-updated');
                if (u) u.textContent = '更新时间：' + new Date(data.updated).toLocaleString('zh-CN');
            }
            for (const k in map) {
                const ul = document.getElementById(map[k]);
                if (!ul || !Array.isArray(data[k])) continue;
                ul.innerHTML = '';
                data[k].forEach(it => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = it.url; a.target = '_blank'; a.rel = 'noopener';
                    a.textContent = it.title + (it.date ? '（' + it.date + '）' : '');
                    li.appendChild(a);
                    ul.appendChild(li);
                });
            }
        })
        .catch(() => {
            for (const k in map) {
                const ul = document.getElementById(map[k]);
                if (ul) ul.innerHTML = '<li class="info-loading">信息加载失败，请稍后刷新</li>';
            }
        });
})();
