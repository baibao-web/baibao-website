// 百保网第5轮：国家医保局三栏 + 研究/国际/媒体/工具四板块 取消折叠（全部展开）
const fs = require('fs');
const DIR = __dirname;
let html = fs.readFileSync(DIR + '/index.html', 'utf8');

// 1) 国家医保局：新闻资讯/政策法规/信息公开 三栏展开
html = html.replace(
  /<details class="collapse"><summary>📑 (新闻资讯|政策法规|信息公开)（点击展开）<\/summary>\s*(<div class="link-grid">[\s\S]*?<\/div>)\s*<\/details>/g,
  '<div class="subcategory">\n                    <h3>$1</h3>\n                    $2\n                </div>'
);

// 2) 研究机构/国际组织/新闻媒体/实用工具 四 section 展开
html = html.replace(
  /<h2 class="category-title">(🎓 研究机构|🌍 国际组织|📰 新闻媒体|🔧 实用工具)<\/h2>\s*<details class="collapse"><summary>📂 点击展开查看<\/summary>\s*(<div class="link-grid">[\s\S]*?<\/div>)\s*<\/details>/g,
  '<h2 class="category-title">$1</h2>\n            $2'
);

fs.writeFileSync(DIR + '/index.html', html);
console.log('ROUND5_DONE');
