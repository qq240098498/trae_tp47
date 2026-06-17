import { calculateTextSimilarity, calculateRequirementSimilarity } from './src/lib/utils';

const testCases = [
  {
    name: '订单批量导出Excel vs 导出全部订单生成表格',
    text1: '订单支持批量导出 Excel',
    text2: '导出全部订单数据生成表格文件',
    desc1: '',
    desc2: '',
  },
  {
    name: '用户登录 vs 用户注册',
    text1: '用户登录功能',
    text2: '用户注册功能',
    desc1: '',
    desc2: '',
  },
  {
    name: '相同文本',
    text1: '订单导出',
    text2: '订单导出',
    desc1: '',
    desc2: '',
  },
  {
    name: '搜索订单 vs 查询订单记录',
    text1: '搜索订单',
    text2: '查询订单记录',
    desc1: '',
    desc2: '',
  },
  {
    name: '完全不相关',
    text1: '用户权限管理系统',
    text2: '订单支付接口对接',
    desc1: '',
    desc2: '',
  },
  {
    name: '下载PDF报表 vs 导出PDF分析报告',
    text1: '下载PDF报表',
    text2: '导出PDF分析报告',
    desc1: '',
    desc2: '',
  },
];

console.log('========== 相似度算法测试 ==========\n');

for (const testCase of testCases) {
  const textSimilarity = calculateTextSimilarity(testCase.text1, testCase.text2);
  const reqSimilarity = calculateRequirementSimilarity(
    testCase.text1, testCase.desc1,
    testCase.text2, testCase.desc2
  );
  
  console.log(`【${testCase.name}】`);
  console.log(`  文本1: "${testCase.text1}"`);
  console.log(`  文本2: "${testCase.text2}"`);
  console.log(`  文本相似度: ${(textSimilarity * 100).toFixed(2)}%`);
  console.log(`  需求相似度: ${(reqSimilarity.similarity * 100).toFixed(2)}%`);
  console.log(`  匹配字段: ${reqSimilarity.matchedFields.join(', ') || '无'}`);
  console.log(`  匹配关键词: ${reqSimilarity.matchedKeywords.join(', ') || '无'}`);
  console.log(`  阈值判断(60%): ${reqSimilarity.similarity >= 0.6 ? '✅ 超过阈值' : '❌ 低于阈值'}`);
  console.log('');
}
