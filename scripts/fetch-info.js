// 生成 info.json：国家医保政策 / 省级医保政策 / 媒体医保新闻
// 由 GitHub Actions 每日 00:00（北京时间）运行；本地也可 node scripts/fetch-info.js 生成
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'info.json');

// ===== 精选兜底数据（官网接口有加密签名，自动抓取失败时使用，保证栏目始终有内容）=====
const fallback = {
  national: [
    { title: '关于做好2025年城乡居民基本医疗保障工作的通知', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2025-08' },
    { title: '国家基本医疗保险、工伤保险和生育保险药品目录（2024年）', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2024-11' },
    { title: '关于规范医保药品外配处方管理的通知', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2024-10' },
    { title: '长期护理保险护理服务机构定点管理办法（试行）', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2024-09' },
    { title: '按病组（DRG）和病种分值（DIP）付费2.0版分组方案', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2024-07' },
    { title: '关于推进村卫生室纳入医保定点管理的通知', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2024-07' },
    { title: '关于在医疗保障服务领域推动“高效办成一件事”的通知', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2024-05' },
    { title: '关于全面实施医保药品追溯码信息采集的公告', url: 'https://www.nhsa.gov.cn/col/col109/', date: '2024-04' },
    { title: '国家组织药品集中带量采购（第九批）中选结果', url: 'https://www.nhsa.gov.cn/col/col109/', date: '2023-11' },
    { title: '口腔种植医疗服务价格专项治理落地', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2023-09' },
    { title: '医疗保障基金监管“两库”管理办法', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2023-07' },
    { title: '关于完善新型冠状病毒感染治疗药品价格形成机制的通知', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2023-03' },
    { title: '跨省异地就医直接结算经办规程（2023年版）', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2023-01' },
    { title: '职工基本医疗保险门诊共济保障机制指导意见', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2021-04' },
    { title: '全国药品集中采购（国家组织）年度工作安排', url: 'https://www.nhsa.gov.cn/col/col109/', date: '2024' },
    { title: '国家组织高值医用耗材集采（脊柱类）中选结果', url: 'https://www.nhsa.gov.cn/col/col109/', date: '2023-03' },
    { title: '国家组织高值医用耗材集采（运动医学类）中选结果', url: 'https://www.nhsa.gov.cn/col/col109/', date: '2024-05' },
    { title: '关于进一步加强医疗保障基金使用常态化监管的实施意见', url: 'https://www.nhsa.gov.cn/col/col104/', date: '2023-05' },
    { title: '医保电子凭证（医保码）推广应用', url: 'https://www.nhsa.gov.cn/col/col114/', date: '2024' },
    { title: '医保数据“两结合三赋能”工作部署', url: 'https://www.nhsa.gov.cn/col/col257/', date: '2024' }
  ],
  provincial: [
    { title: '北京市医疗保障局 · 政策法规', url: 'https://ybj.beijing.gov.cn', date: '' },
    { title: '上海市医疗保障局 · 政策法规', url: 'https://ybj.shanghai.gov.cn', date: '' },
    { title: '广东省医疗保障局 · 政策法规', url: 'https://hsa.gd.gov.cn', date: '' },
    { title: '江苏省医疗保障局 · 政策法规', url: 'https://ybj.jiangsu.gov.cn', date: '' },
    { title: '浙江省医疗保障局 · 政策法规', url: 'https://ybj.zj.gov.cn', date: '' },
    { title: '山东省医疗保障局 · 政策法规', url: 'https://ybj.shandong.gov.cn', date: '' },
    { title: '四川省医疗保障局 · 政策法规', url: 'https://ylbzj.sc.gov.cn', date: '' },
    { title: '河南省医疗保障局 · 政策法规', url: 'https://ylbz.henan.gov.cn', date: '' },
    { title: '湖北省医疗保障局 · 政策法规', url: 'https://ybj.hubei.gov.cn', date: '' },
    { title: '福建省医疗保障局 · 政策法规', url: 'https://ybj.fj.gov.cn', date: '' },
    { title: '全国31省医保部门政策发布（地方机构导航）', url: 'https://www.nhsa.gov.cn/col/col28/index.html', date: '' }
  ],
  media: [
    { title: '医药经济报 · 官网', url: 'https://www.yyjjb.com.cn', date: '' },
    { title: '人民网 · 健康', url: 'http://health.people.com.cn', date: '' },
    { title: '新华网 · 健康', url: 'http://www.xinhuanet.com/health', date: '' },
    { title: '央视网 · 新闻（医保）', url: 'https://news.cctv.com', date: '' },
    { title: '新浪 · 健康', url: 'https://health.sina.com.cn', date: '' },
    { title: '中国医疗保险（杂志）', url: 'http://www.zgyb.com.cn', date: '' },
    { title: '第一财经 · 医保', url: 'https://www.yicai.com', date: '' },
    { title: '财新 · 健康', url: 'https://www.caixin.com', date: '' }
  ]
};

async function fetchText(url, timeout = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) return null;
    return await r.text();
  } catch (e) {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function extractLinks(html, base) {
  if (!html) return [];
  const out = [];
  const re = /<a\s+[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    let href = m[1], text = m[2].trim();
    if (!text || text.length < 4) continue;
    if (href.startsWith('/')) href = base + href;
    if (!/^https?:/.test(href)) continue;
    out.push({ title: text, url: href, date: '' });
  }
  return out;
}

// best-effort：尝试真实抓取国家医保局最新政策列表，失败回退兜底
async function tryFetchNational() {
  for (const col of ['https://www.nhsa.gov.cn/col/col104/', 'https://www.nhsa.gov.cn/col/col109/']) {
    const html = await fetchText(col);
    const links = extractLinks(html, 'https://www.nhsa.gov.cn').slice(0, 20);
    if (links.length >= 5) return links;
  }
  return null;
}

(async () => {
  const data = { updated: new Date().toISOString() };
  const nat = await tryFetchNational();
  data.national = (nat && nat.length) ? nat : fallback.national;
  data.provincial = fallback.provincial;
  data.media = fallback.media;
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log('info.json generated: national=' + data.national.length + ' provincial=' + data.provincial.length + ' media=' + data.media.length);
})();
