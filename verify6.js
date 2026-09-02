const fs = require('fs');
const DIR = __dirname;
const html = fs.readFileSync(DIR + '/index.html', 'utf8');
const c = (re) => (html.match(re) || []).length;

console.log('国家医保三栏展开(subcategory h3):', html.includes('<h3>新闻资讯</h3>') && html.includes('<h3>政策法规</h3>') && html.includes('<h3>信息公开</h3>'));
console.log('国家医保无折叠 summary:', !html.includes('📑 新闻资讯'));
console.log('四板块无折叠 summary:', !html.includes('📂 点击展开查看'));
console.log('details 剩余数(应=2:部委+政府):', c(/<details class="collapse">/g));
console.log('卡片无描述 <p>:', c(/<div class="link-info">[\s\S]*?<p>/g) === 0);
console.log('上海归位+今日头条:', html.indexOf('上海医保局') > html.indexOf('黑龙江医保局') && html.includes('toutiao.com') && !html.includes('zhihu.com'));
console.log('省级医保注释保留:', html.includes('<!-- 省级医保部门 -->'));

const tags = ['section','details','summary','ul','li','h3','h4','h2'];
let bal = true;
for (const t of tags) {
  const o = c(new RegExp('<' + t + '[ >]', 'g'));
  const cl = c(new RegExp('</' + t + '>', 'g'));
  if (o !== cl) { bal = false; console.log('MISMATCH', t, o, cl); }
}
const dO = c(/<div[ >]/g), dC = c(/<\/div>/g);
console.log('div 平衡:', dO === dC ? 'OK' : ('MISMATCH ' + dO + '/' + dC));
console.log('标签平衡:', bal && dO === dC ? 'OK' : 'FAIL');
console.log('VERIFY6_DONE');
