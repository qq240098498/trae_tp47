import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BUSINESS_SYNONYMS: Record<string, string[]> = {
  导出: ['导出', '下载', '输出', '生成', '提取', '保存为', '导出为', '下载为', '产出'],
  导入: ['导入', '上传', '录入', '载入', '批量导入'],
  批量: ['批量', '全部', '所有', '一次性', '多个', '多', '成批'],
  订单: ['订单', '订单数据', '订单记录', '定单', '交易记录', '销售单'],
  用户: ['用户', '客户', '会员', '使用者', '账号', '账户'],
  excel: ['excel', '表格', 'xlsx', 'xls', '电子表格', '表格文件', 'excel文件', 'excel表'],
  pdf: ['pdf', 'pdf文件', 'pdf文档'],
  报表: ['报表', '统计表', '分析表', '数据表', '汇总表', '报告', '统计报表', '分析报告', '数据报表'],
  数据: ['数据', '记录', '信息', '内容', '明细'],
  搜索: ['搜索', '查询', '查找', '检索', '筛选'],
  统计: ['统计', '汇总', '合计', '总计', '计算', '聚合'],
  图表: ['图表', '可视化', '统计图', '趋势图', '饼图', '柱状图', '折线图'],
  通知: ['通知', '提醒', '消息', '推送', '告警', '提示'],
  登录: ['登录', '登陆', '登入', '访问系统', '进入系统'],
  注册: ['注册', '开户', '创建账号', '开通账号', 'signup'],
  支付: ['支付', '付款', '结算', '缴费', '充值', '下单支付'],
  权限: ['权限', '访问控制', '授权', '角色权限', '许可'],
  审核: ['审核', '审批', '复核', '批准', '核查', '校验'],
  删除: ['删除', '移除', '清除', '作废', '注销'],
  编辑: ['编辑', '修改', '更新', '变更', '调整'],
  新增: ['新增', '添加', '创建', '增加', '新建'],
  查看: ['查看', '浏览', '查询详情', '看详情', '查阅'],
  分享: ['分享', '共享', '转发', '推送给', '分发'],
  打印: ['打印', '输出打印', '打出来', 'print'],
  状态: ['状态', '进度', '情况', '情形', 'status'],
  标签: ['标签', '标记', 'tag', '分类标签'],
  分类: ['分类', '归类', '分组', '类别', 'category'],
  模板: ['模板', '模版', '样式模板', '格式模板'],
  日志: ['日志', '操作记录', '行为记录', 'log', '审计记录'],
  备份: ['备份', '数据备份', '保存副本', '存档'],
  恢复: ['恢复', '还原', '回滚', '数据恢复', 'rollback'],
  加密: ['加密', '保密', '安全加密', '加密存储'],
  验证: ['验证', '校验', '认证', '核对', '验证身份'],
  同步: ['同步', '数据同步', '实时同步', 'sync', '同步更新'],
  缓存: ['缓存', '本地缓存', '数据缓存', 'cache'],
  接口: ['接口', 'api', '对接', '连接', 'api接口'],
  文档: ['文档', '文件', '资料', '附件', 'document'],
  图片: ['图片', '图像', '照片', '图', 'image', 'photo'],
  视频: ['视频', '录像', '影片', 'video'],
  评论: ['评论', '评价', '留言', '回复', '点评'],
  收藏: ['收藏', '关注', '喜爱', '加关注', 'favorite'],
  反馈: ['反馈', '意见', '建议', '投诉', '建议意见'],
  客服: ['客服', '服务', '支持', '售后', '客户服务'],
  优惠券: ['优惠券', '券', '折扣券', '代金券', '卡券'],
  积分: ['积分', '点数', '分值', 'point'],
  会员: ['会员', 'vip', '付费会员', '高级用户', '等级会员'],
  促销: ['促销', '活动', '营销', '优惠活动', '推广活动'],
  购物车: ['购物车', '购物篮', 'cart', '加入购物车'],
  发票: ['发票', '开票', '税票', '收据', '电子发票'],
  物流: ['物流', '快递', '配送', '发货', '运输'],
  退款: ['退款', '退钱', '退换', '退货退款', 'refund'],
  手机: ['手机', '移动端', 'app', '客户端', '移动设备', 'h5'],
  系统: ['系统', '平台', '软件', '应用', 'product'],
  性能: ['性能', '速度', '加载速度', '响应速度', '优化性能'],
  安全: ['安全', '防护', '安全防护', '网络安全', '信息安全'],
  设置: ['设置', '配置', '选项', '偏好设置', 'setting'],
  首页: ['首页', '主页', '主页页面', 'dashboard', '控制台'],
  个人中心: ['个人中心', '我的', '个人主页', '用户中心', 'profile'],
  帮助: ['帮助', '帮助中心', '使用指南', '手册', 'help'],
  关于: ['关于', '关于我们', 'about', '简介'],
  表格文件: ['表格文件', 'excel', 'xlsx', 'xls', '电子表格', '表格'],
  生成表格: ['生成表格', '导出表格', '导出excel', '产出表格'],
  全部订单: ['全部订单', '所有订单', '订单全部', '批量订单', '整个订单'],
  支持导出: ['支持导出', '能导出', '可以导出', '可导出', '导出功能'],
  订单数据: ['订单数据', '订单信息', '订单记录', '订单明细', '订单内容'],
}

const STOPWORDS = new Set([
  '的', '了', '和', '是', '在', '有', '我', '他', '她', '它',
  '我们', '你们', '他们', '这', '那', '个', '就', '都', '而',
  '及', '与', '或', '等', '对', '从', '到', '把', '被', '让',
  '给', '向', '往', '由', '为', '以', '于', '因', '所以',
  '可以', '能够', '支持', '需要', '希望', '想要', '应该', '必须',
  '请', '请问', '烦请', '建议', '要求', '请求',
  '一个', '一些', '一下', '一样', '这种', '那个',
  '功能', '作用', '效果', '方式', '方法', '手段',
  '进行', '通过', '使用', '利用', '采用',
  '已经', '正在', '将要', '以后', '之前', '现在',
  '相关', '相应', '对应', '相关的',
  '方便', '便于', '利于', '有助于',
])

const HIGH_WEIGHT_KEYWORDS = new Set([
  '导出', '导入', 'excel', 'pdf', '订单', '用户', '支付', '登录', '注册',
  '审核', '权限', '批量', '搜索', '统计', '图表', '报表', '通知',
  '退款', '发票', '物流', '优惠券', '积分', '会员', '促销', '购物车',
  '接口', '缓存', '同步', '加密', '备份', '恢复', '日志', '模板',
  '手机', '性能', '安全', '删除', '编辑', '新增', '查看', '分享',
])

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5]/g, '')
}

function expandWithSynonyms(keyword: string): Set<string> {
  const expanded = new Set<string>([keyword])
  const normKeyword = normalizeText(keyword)
  
  for (const [canonical, synonyms] of Object.entries(BUSINESS_SYNONYMS)) {
    const normCanonical = normalizeText(canonical)
    if (normCanonical.includes(normKeyword) || normKeyword.includes(normCanonical)) {
      expanded.add(canonical)
      synonyms.forEach(s => expanded.add(normalizeText(s)))
    }
    for (const synonym of synonyms) {
      const normSynonym = normalizeText(synonym)
      if (normSynonym.includes(normKeyword) || normKeyword.includes(normSynonym)) {
        expanded.add(normalizeText(canonical))
        synonyms.forEach(s => expanded.add(normalizeText(s)))
      }
    }
  }
  
  return expanded
}

function extractSemanticKeywords(text: string): string[] {
  const cleanText = text.toLowerCase().trim()
  if (!cleanText) return []
  
  const keywords: string[] = []
  const foundKeywords = new Set<string>()
  const normText = normalizeText(cleanText)
  
  const synonymEntries = Object.entries(BUSINESS_SYNONYMS)
    .sort((a, b) => {
      const maxLenA = Math.max(
        normalizeText(a[0]).length,
        ...a[1].map(s => normalizeText(s).length)
      )
      const maxLenB = Math.max(
        normalizeText(b[0]).length,
        ...b[1].map(s => normalizeText(s).length)
      )
      return maxLenB - maxLenA
    })
  
  for (const [canonical, synonyms] of synonymEntries) {
    const allForms = [canonical, ...synonyms]
    for (const form of allForms) {
      const normForm = normalizeText(form)
      if (normForm.length < 2) continue
      if (normText.includes(normForm) && !foundKeywords.has(normalizeText(canonical))) {
        keywords.push(normalizeText(canonical))
        foundKeywords.add(normalizeText(canonical))
        break
      }
    }
  }
  
  return keywords
}

function getKeywordWeight(keyword: string): number {
  const normKeyword = normalizeText(keyword)
  if (HIGH_WEIGHT_KEYWORDS.has(normKeyword)) return 3.0
  
  for (const hw of HIGH_WEIGHT_KEYWORDS) {
    if (normKeyword.includes(hw) || hw.includes(normKeyword)) return 2.5
  }
  
  for (const [canonical, synonyms] of Object.entries(BUSINESS_SYNONYMS)) {
    const normCanonical = normalizeText(canonical)
    if (normCanonical === normKeyword || 
        synonyms.some(s => normalizeText(s) === normKeyword)) {
      return 2.0
    }
    if (normCanonical.includes(normKeyword) || normKeyword.includes(normCanonical)) {
      return 1.8
    }
  }
  
  return 1.0
}

function calculateSemanticSimilarity(text1: string, text2: string): number {
  const keywords1 = extractSemanticKeywords(text1)
  const keywords2 = extractSemanticKeywords(text2)
  
  if (keywords1.length === 0 && keywords2.length === 0) return 0
  if (keywords1.length === 0 || keywords2.length === 0) return 0
  
  const expandedKeywords1 = new Map<string, number>()
  const expandedKeywords2 = new Map<string, number>()
  
  for (const kw of keywords1) {
    const weight = getKeywordWeight(kw)
    const expanded = expandWithSynonyms(kw)
    for (const expandedKw of expanded) {
      const current = expandedKeywords1.get(expandedKw) || 0
      expandedKeywords1.set(expandedKw, Math.max(current, weight))
    }
  }
  
  for (const kw of keywords2) {
    const weight = getKeywordWeight(kw)
    const expanded = expandWithSynonyms(kw)
    for (const expandedKw of expanded) {
      const current = expandedKeywords2.get(expandedKw) || 0
      expandedKeywords2.set(expandedKw, Math.max(current, weight))
    }
  }
  
  for (const kw of keywords1) {
    const weight = getKeywordWeight(kw)
    const current = expandedKeywords1.get(kw) || 0
    expandedKeywords1.set(kw, Math.max(current, weight * 1.5))
  }
  for (const kw of keywords2) {
    const weight = getKeywordWeight(kw)
    const current = expandedKeywords2.get(kw) || 0
    expandedKeywords2.set(kw, Math.max(current, weight * 1.5))
  }
  
  let intersectionWeight = 0
  let totalWeight1 = 0
  let totalWeight2 = 0
  
  const allKeys = new Set([
    ...expandedKeywords1.keys(),
    ...expandedKeywords2.keys(),
    ...keywords1,
    ...keywords2,
  ])
  
  for (const key of allKeys) {
    const w1 = expandedKeywords1.get(key) || (keywords1.includes(key) ? getKeywordWeight(key) : 0)
    const w2 = expandedKeywords2.get(key) || (keywords2.includes(key) ? getKeywordWeight(key) : 0)
    
    if (w1 > 0 && w2 > 0) {
      intersectionWeight += Math.min(w1, w2) * 2
    }
    totalWeight1 += w1
    totalWeight2 += w2
  }
  
  const directMatchScore = calculateDirectKeywordMatch(keywords1, keywords2)
  
  const semanticScore = totalWeight1 + totalWeight2 > 0
    ? (intersectionWeight / (totalWeight1 + totalWeight2))
    : 0
  
  return Math.min(1, semanticScore * 0.7 + directMatchScore * 0.3)
}

function calculateDirectKeywordMatch(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 && keywords2.length === 0) return 0
  if (keywords1.length === 0 || keywords2.length === 0) return 0
  
  const matchedKeywords: string[] = []
  
  for (const kw1 of keywords1) {
    for (const kw2 of keywords2) {
      if (kw1 === kw2) {
        matchedKeywords.push(kw1)
        break
      }
      
      const expanded1 = expandWithSynonyms(kw1)
      const expanded2 = expandWithSynonyms(kw2)
      for (const e1 of expanded1) {
        if (expanded2.has(e1)) {
          matchedKeywords.push(kw1)
          break
        }
      }
    }
  }
  
  const uniqueMatched = new Set(matchedKeywords)
  const totalUnique = new Set([...keywords1, ...keywords2])
  
  return totalUnique.size > 0 ? uniqueMatched.size / totalUnique.size : 0
}

function tokenize(text: string, n: number = 2): string[] {
  const cleanText = normalizeText(text)
  const tokens: string[] = []
  
  if (cleanText.length === 0) return tokens
  
  if (cleanText.length <= n) {
    tokens.push(cleanText)
    return tokens
  }
  
  for (let i = 0; i <= cleanText.length - n; i++) {
    tokens.push(cleanText.substring(i, i + n))
  }
  
  return tokens
}

function getWordFrequency(tokens: string[]): Record<string, number> {
  const freq: Record<string, number> = {}
  for (const token of tokens) {
    freq[token] = (freq[token] || 0) + 1
  }
  return freq
}

function cosineSimilarity(vec1: Record<string, number>, vec2: Record<string, number>): number {
  const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)])
  
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0
  
  for (const key of allKeys) {
    const val1 = vec1[key] || 0
    const val2 = vec2[key] || 0
    
    dotProduct += val1 * val2
    norm1 += val1 * val1
    norm2 += val2 * val2
  }
  
  const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2)
  return magnitude === 0 ? 0 : dotProduct / magnitude
}

function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 && set2.size === 0) return 1
  if (set1.size === 0 || set2.size === 0) return 0
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

export function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0
  
  const clean1 = text1.toLowerCase().trim()
  const clean2 = text2.toLowerCase().trim()
  
  if (clean1 === clean2) return 1
  
  const keywords1 = extractSemanticKeywords(clean1)
  const keywords2 = extractSemanticKeywords(clean2)
  const semanticSimilarity = calculateSemanticSimilarity(clean1, clean2)
  
  const highWeightCount1 = keywords1.filter(kw => getKeywordWeight(kw) >= 2.5).length
  const highWeightCount2 = keywords2.filter(kw => getKeywordWeight(kw) >= 2.5).length
  const minHighWeight = Math.min(highWeightCount1, highWeightCount2)
  
  const tokens1 = tokenize(clean1, 2)
  const tokens2 = tokenize(clean2, 2)
  
  const set1 = new Set(tokens1)
  const set2 = new Set(tokens2)
  
  const freq1 = getWordFrequency(tokens1)
  const freq2 = getWordFrequency(tokens2)
  
  const cosine = cosineSimilarity(freq1, freq2)
  const jaccard = jaccardSimilarity(set1, set2)
  
  const normClean1 = normalizeText(clean1)
  const normClean2 = normalizeText(clean2)
  const maxLen = Math.max(normClean1.length, normClean2.length)
  const editDistance = levenshteinDistance(normClean1, normClean2)
  const editSimilarity = maxLen === 0 ? 1 : 1 - editDistance / maxLen
  
  const lexicalSimilarity = cosine * 0.5 + jaccard * 0.3 + editSimilarity * 0.2
  
  let similarity: number
  
  const keywordMatchRatio = calculateDirectKeywordMatch(keywords1, keywords2)
  const multipleHighWeightBoost = minHighWeight >= 3 ? 0.15 : minHighWeight >= 2 ? 0.10 : minHighWeight >= 1 ? 0.05 : 0
  
  if (semanticSimilarity > 0.2 || keywords1.length > 0 || keywords2.length > 0) {
    similarity = semanticSimilarity * 0.7 + lexicalSimilarity * 0.3
    similarity += keywordMatchRatio * 0.1
    similarity += multipleHighWeightBoost
  } else if (semanticSimilarity > 0.1) {
    const boostFactor = 1 + semanticSimilarity * 0.5
    similarity = Math.min(1, (semanticSimilarity * 0.5 + lexicalSimilarity * 0.5) * boostFactor)
  } else {
    similarity = lexicalSimilarity
  }
  
  return Math.max(0, Math.min(1, similarity))
}

export function calculateRequirementSimilarity(
  newTitle: string,
  newDescription: string,
  existingTitle: string,
  existingDescription: string
): { similarity: number; matchedFields: string[]; matchedKeywords: string[] } {
  const matchedFields: string[] = []
  const matchedKeywords: string[] = []
  
  const titleSimilarity = calculateTextSimilarity(newTitle, existingTitle)
  const descSimilarity = calculateTextSimilarity(newDescription, existingDescription)
  
  const combinedTextNew = `${newTitle} ${newDescription}`.trim()
  const combinedTextExisting = `${existingTitle} ${existingDescription}`.trim()
  const overallSimilarity = calculateTextSimilarity(combinedTextNew, combinedTextExisting)
  
  const keywordsNew = extractSemanticKeywords(combinedTextNew)
  const keywordsExisting = extractSemanticKeywords(combinedTextExisting)
  
  for (const kwNew of keywordsNew) {
    const expandedNew = expandWithSynonyms(kwNew)
    for (const kwExisting of keywordsExisting) {
      const expandedExisting = expandWithSynonyms(kwExisting)
      for (const eNew of expandedNew) {
        if (expandedExisting.has(eNew) || kwNew === kwExisting) {
          if (!matchedKeywords.includes(kwNew)) {
            matchedKeywords.push(kwNew)
          }
          break
        }
      }
    }
  }
  
  const totalKeywords = new Set([...keywordsNew, ...keywordsExisting]).size
  const keywordCoverageRatio = totalKeywords > 0 ? matchedKeywords.length / totalKeywords : 0
  
  const highWeightMatched = matchedKeywords.filter(kw => getKeywordWeight(kw) >= 2.5).length
  const titleMatched = titleSimilarity > 0.35
  const descMatched = descSimilarity > 0.30
  const keywordBoost = matchedKeywords.length >= 4 ? 0.12 : 
                       matchedKeywords.length >= 3 ? 0.08 : 
                       matchedKeywords.length >= 2 ? 0.05 : 
                       matchedKeywords.length >= 1 ? 0.02 : 0
  const highWeightKeywordBoost = highWeightMatched >= 3 ? 0.06 : highWeightMatched >= 2 ? 0.04 : highWeightMatched >= 1 ? 0.02 : 0
  const coverageBoost = keywordCoverageRatio >= 0.75 ? 0.05 : keywordCoverageRatio >= 0.5 ? 0.03 : 0
  
  let adjustedSimilarity = Math.min(0.95, overallSimilarity + keywordBoost + highWeightKeywordBoost + coverageBoost)
  
  if (titleMatched) {
    adjustedSimilarity = Math.min(0.95, adjustedSimilarity + 0.03)
    matchedFields.push('title')
  }
  if (descMatched) {
    adjustedSimilarity = Math.min(0.95, adjustedSimilarity + 0.02)
    matchedFields.push('description')
  }
  if (matchedKeywords.length > 0 && !titleMatched && !descMatched) {
    matchedFields.push('keywords')
  }
  
  return {
    similarity: adjustedSimilarity,
    matchedFields,
    matchedKeywords,
  };
}

interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  defaultComplexity: 'low' | 'medium' | 'high' | 'critical';
  baseDays: number;
}

const SYSTEM_MODULES: ModuleDefinition[] = [
  {
    id: 'auth',
    name: '用户认证模块',
    description: '用户登录、注册、权限验证等认证相关功能',
    keywords: ['登录', '注册', '认证', '权限', '验证码', '第三方登录', '微信', 'QQ', '账号', '密码', '安全', '加密', '验证', 'token', 'session'],
    defaultComplexity: 'high',
    baseDays: 3,
  },
  {
    id: 'user',
    name: '用户管理模块',
    description: '用户信息管理、个人中心、用户资料等',
    keywords: ['用户', '个人中心', '资料', '会员', '客户', '账号', '头像', '昵称', '用户信息'],
    defaultComplexity: 'medium',
    baseDays: 2,
  },
  {
    id: 'order',
    name: '订单管理模块',
    description: '订单创建、查询、修改、取消等订单相关功能',
    keywords: ['订单', '下单', '支付', '退款', '购物车', '结算', '交易', '销售单'],
    defaultComplexity: 'high',
    baseDays: 4,
  },
  {
    id: 'payment',
    name: '支付模块',
    description: '支付处理、退款、对账等支付相关功能',
    keywords: ['支付', '付款', '退款', '结算', '缴费', '充值', '下单支付', '微信支付', '支付宝'],
    defaultComplexity: 'critical',
    baseDays: 5,
  },
  {
    id: 'report',
    name: '报表统计模块',
    description: '数据报表、统计分析、数据可视化等',
    keywords: ['报表', '统计', '图表', '数据', '可视化', '分析', '汇总', '趋势', '饼图', '柱状图', '折线图'],
    defaultComplexity: 'medium',
    baseDays: 3,
  },
  {
    id: 'export',
    name: '数据导出模块',
    description: '数据导出、文件下载、格式转换等',
    keywords: ['导出', '下载', 'Excel', 'PDF', '表格', '生成', '提取', '保存', 'xlsx', 'xls', 'csv'],
    defaultComplexity: 'medium',
    baseDays: 2,
  },
  {
    id: 'import',
    name: '数据导入模块',
    description: '数据导入、批量录入、文件上传等',
    keywords: ['导入', '上传', '录入', '批量导入', 'Excel导入', '文件上传'],
    defaultComplexity: 'medium',
    baseDays: 2,
  },
  {
    id: 'notification',
    name: '通知消息模块',
    description: '站内信、消息推送、通知提醒等',
    keywords: ['通知', '提醒', '消息', '推送', '告警', '提示', '站内信', '邮件', '短信'],
    defaultComplexity: 'low',
    baseDays: 1,
  },
  {
    id: 'search',
    name: '搜索模块',
    description: '全文搜索、筛选、查询等功能',
    keywords: ['搜索', '查询', '查找', '检索', '筛选', '过滤'],
    defaultComplexity: 'medium',
    baseDays: 2,
  },
  {
    id: 'collaboration',
    name: '协作编辑模块',
    description: '多人实时协作、文档协同编辑等',
    keywords: ['协作', '实时', '编辑', '多人', '同步', '协同'],
    defaultComplexity: 'critical',
    baseDays: 8,
  },
  {
    id: 'ui_theme',
    name: 'UI主题模块',
    description: '主题切换、深色模式、样式系统等',
    keywords: ['主题', '深色模式', '浅色模式', 'UI', '样式', '皮肤', '高对比度', '无障碍', '可访问性'],
    defaultComplexity: 'high',
    baseDays: 5,
  },
  {
    id: 'api_gateway',
    name: 'API网关模块',
    description: 'API接口管理、限流、鉴权等',
    keywords: ['API', '接口', '限流', '网关', '鉴权', '接口文档', 'REST', 'GraphQL'],
    defaultComplexity: 'high',
    baseDays: 4,
  },
  {
    id: 'log_audit',
    name: '日志审计模块',
    description: '操作日志、审计记录、行为追踪等',
    keywords: ['日志', '操作记录', '行为记录', '审计', 'log', '审计记录'],
    defaultComplexity: 'low',
    baseDays: 1,
  },
  {
    id: 'cache',
    name: '缓存模块',
    description: '数据缓存、本地存储、性能优化等',
    keywords: ['缓存', '本地缓存', '数据缓存', 'cache', '性能', '速度', '优化'],
    defaultComplexity: 'medium',
    baseDays: 2,
  },
  {
    id: 'backup',
    name: '备份恢复模块',
    description: '数据备份、恢复、容灾等',
    keywords: ['备份', '数据备份', '恢复', '回滚', 'rollback', '存档'],
    defaultComplexity: 'high',
    baseDays: 4,
  },
  {
    id: 'file',
    name: '文件管理模块',
    description: '文件上传、下载、管理、预览等',
    keywords: ['文件', '附件', '文档', '图片', '视频', '上传', '下载', '预览'],
    defaultComplexity: 'medium',
    baseDays: 2,
  },
  {
    id: 'review',
    name: '审核审批模块',
    description: '内容审核、审批流程、复核等',
    keywords: ['审核', '审批', '复核', '批准', '核查', '校验', '工作流'],
    defaultComplexity: 'high',
    baseDays: 4,
  },
  {
    id: 'marketing',
    name: '营销活动模块',
    description: '优惠券、积分、促销、活动管理等',
    keywords: ['优惠券', '积分', '促销', '活动', '营销', '折扣', '卡券', '会员'],
    defaultComplexity: 'medium',
    baseDays: 3,
  },
  {
    id: 'logistics',
    name: '物流配送模块',
    description: '物流跟踪、快递配送、发货管理等',
    keywords: ['物流', '快递', '配送', '发货', '运输', '收货'],
    defaultComplexity: 'high',
    baseDays: 4,
  },
  {
    id: 'invoice',
    name: '发票模块',
    description: '发票开具、管理、查询等',
    keywords: ['发票', '开票', '税票', '收据', '电子发票'],
    defaultComplexity: 'medium',
    baseDays: 3,
  },
];

const INTERFACE_PATTERNS: Array<{
  moduleId: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  keywords: string[];
  complexity: 'low' | 'medium' | 'high' | 'critical';
  breaking: boolean;
}> = [
  { moduleId: 'auth', name: '用户登录接口', method: 'POST', path: '/api/auth/login', keywords: ['登录', '认证', '验证码'], complexity: 'high', breaking: true },
  { moduleId: 'auth', name: '用户注册接口', method: 'POST', path: '/api/auth/register', keywords: ['注册', '账号'], complexity: 'high', breaking: true },
  { moduleId: 'auth', name: '发送验证码接口', method: 'POST', path: '/api/auth/sms/send', keywords: ['验证码', '短信', '手机'], complexity: 'medium', breaking: false },
  { moduleId: 'auth', name: '第三方登录接口', method: 'POST', path: '/api/auth/oauth', keywords: ['第三方登录', '微信', 'QQ'], complexity: 'high', breaking: false },
  { moduleId: 'user', name: '获取用户信息', method: 'GET', path: '/api/user/profile', keywords: ['用户', '个人中心', '资料'], complexity: 'low', breaking: false },
  { moduleId: 'user', name: '更新用户信息', method: 'PUT', path: '/api/user/profile', keywords: ['用户', '修改', '资料'], complexity: 'medium', breaking: true },
  { moduleId: 'order', name: '创建订单', method: 'POST', path: '/api/orders', keywords: ['订单', '下单', '创建'], complexity: 'high', breaking: true },
  { moduleId: 'order', name: '查询订单列表', method: 'GET', path: '/api/orders', keywords: ['订单', '查询', '列表'], complexity: 'medium', breaking: false },
  { moduleId: 'order', name: '订单详情', method: 'GET', path: '/api/orders/:id', keywords: ['订单', '详情'], complexity: 'low', breaking: false },
  { moduleId: 'payment', name: '发起支付', method: 'POST', path: '/api/payments', keywords: ['支付', '付款'], complexity: 'critical', breaking: true },
  { moduleId: 'payment', name: '支付回调', method: 'POST', path: '/api/payments/callback', keywords: ['支付', '回调'], complexity: 'critical', breaking: true },
  { moduleId: 'payment', name: '申请退款', method: 'POST', path: '/api/payments/refund', keywords: ['退款', '退钱'], complexity: 'high', breaking: true },
  { moduleId: 'report', name: '获取报表数据', method: 'GET', path: '/api/reports', keywords: ['报表', '统计', '数据'], complexity: 'medium', breaking: false },
  { moduleId: 'export', name: '导出数据', method: 'GET', path: '/api/export', keywords: ['导出', '下载', 'Excel'], complexity: 'medium', breaking: false },
  { moduleId: 'import', name: '导入数据', method: 'POST', path: '/api/import', keywords: ['导入', '上传', '批量'], complexity: 'medium', breaking: false },
  { moduleId: 'notification', name: '获取消息列表', method: 'GET', path: '/api/notifications', keywords: ['通知', '消息'], complexity: 'low', breaking: false },
  { moduleId: 'notification', name: '标记已读', method: 'PUT', path: '/api/notifications/:id/read', keywords: ['通知', '消息'], complexity: 'low', breaking: false },
  { moduleId: 'search', name: '全局搜索', method: 'GET', path: '/api/search', keywords: ['搜索', '查询', '查找'], complexity: 'medium', breaking: false },
  { moduleId: 'api_gateway', name: 'API限流配置', method: 'PUT', path: '/api/admin/rate-limit', keywords: ['限流', 'API', '安全'], complexity: 'high', breaking: false },
  { moduleId: 'file', name: '文件上传', method: 'POST', path: '/api/files/upload', keywords: ['上传', '文件', '图片'], complexity: 'medium', breaking: false },
  { moduleId: 'review', name: '提交审核', method: 'POST', path: '/api/reviews/submit', keywords: ['审核', '审批'], complexity: 'medium', breaking: false },
  { moduleId: 'marketing', name: '优惠券列表', method: 'GET', path: '/api/coupons', keywords: ['优惠券', '促销', '活动'], complexity: 'low', breaking: false },
  { moduleId: 'logistics', name: '物流查询', method: 'GET', path: '/api/logistics/:id', keywords: ['物流', '快递', '配送'], complexity: 'medium', breaking: false },
  { moduleId: 'invoice', name: '申请开票', method: 'POST', path: '/api/invoices', keywords: ['发票', '开票'], complexity: 'medium', breaking: false },
];

const DOWNSTREAM_SYSTEMS: Array<{
  id: string;
  name: string;
  type: 'internal' | 'external' | 'third_party';
  keywords: string[];
  contactTeam?: string;
  baseImpact: 'low' | 'medium' | 'high' | 'critical';
}> = [
  { id: 'sms_service', name: '短信服务', type: 'third_party', keywords: ['短信', '验证码', '手机', '通知'], contactTeam: '基础设施团队', baseImpact: 'low' },
  { id: 'wechat_api', name: '微信开放平台', type: 'third_party', keywords: ['微信', '第三方登录', '支付'], contactTeam: '商务合作组', baseImpact: 'medium' },
  { id: 'qq_api', name: 'QQ开放平台', type: 'third_party', keywords: ['QQ', '第三方登录'], contactTeam: '商务合作组', baseImpact: 'low' },
  { id: 'payment_gateway', name: '支付网关', type: 'third_party', keywords: ['支付', '退款', '结算'], contactTeam: '财务系统组', baseImpact: 'critical' },
  { id: 'user_center', name: '用户中心', type: 'internal', keywords: ['用户', '账号', '登录', '注册'], contactTeam: '用户中心团队', baseImpact: 'high' },
  { id: 'order_system', name: '订单系统', type: 'internal', keywords: ['订单', '下单', '购物车'], contactTeam: '交易平台团队', baseImpact: 'high' },
  { id: 'crm_system', name: 'CRM系统', type: 'internal', keywords: ['客户', '用户', '会员'], contactTeam: 'CRM团队', baseImpact: 'medium' },
  { id: 'data_warehouse', name: '数据仓库', type: 'internal', keywords: ['报表', '统计', '数据', '分析'], contactTeam: '数据平台团队', baseImpact: 'medium' },
  { id: 'logistics_system', name: '物流系统', type: 'external', keywords: ['物流', '快递', '配送', '发货'], contactTeam: '供应链团队', baseImpact: 'high' },
  { id: 'invoice_system', name: '发票系统', type: 'external', keywords: ['发票', '开票', '税票'], contactTeam: '财务系统组', baseImpact: 'medium' },
  { id: 'message_queue', name: '消息队列', type: 'internal', keywords: ['通知', '消息', '异步', '队列'], contactTeam: '基础设施团队', baseImpact: 'medium' },
  { id: 'elasticsearch', name: '搜索引擎', type: 'internal', keywords: ['搜索', '查询', '检索'], contactTeam: '搜索团队', baseImpact: 'medium' },
  { id: 'file_storage', name: '对象存储', type: 'third_party', keywords: ['文件', '上传', '图片', '视频'], contactTeam: '基础设施团队', baseImpact: 'low' },
  { id: 'monitoring', name: '监控告警系统', type: 'internal', keywords: ['告警', '监控', '日志'], contactTeam: '运维团队', baseImpact: 'low' },
];

function setHasSome<T>(set: Set<T>, predicate: (value: T) => boolean): boolean {
  for (const value of set) {
    if (predicate(value)) return true;
  }
  return false;
}

function calculateModuleRelevance(module: ModuleDefinition, keywords: string[], text: string): number {
  let score = 0;
  const normText = normalizeText(text);
  
  for (const keyword of module.keywords) {
    const normKeyword = normalizeText(keyword);
    if (normKeyword.length < 2) continue;
    
    const expanded = expandWithSynonyms(keyword);
    for (const expandedKw of expanded) {
      const normExpanded = normalizeText(expandedKw);
      if (normText.includes(normExpanded)) {
        score += getKeywordWeight(keyword) * 2;
        break;
      }
    }
  }
  
  for (const kw of keywords) {
    const normKw = normalizeText(kw);
    for (const moduleKw of module.keywords) {
      const normModuleKw = normalizeText(moduleKw);
      if (normKw === normModuleKw || normKw.includes(normModuleKw) || normModuleKw.includes(normKw)) {
        score += getKeywordWeight(kw) * 3;
        break;
      }
    }
  }
  
  return score;
}

function assessComplexity(baseComplexity: string, keywordCount: number, hasBreaking: boolean): 'low' | 'medium' | 'high' | 'critical' {
  const complexityOrder = ['low', 'medium', 'high', 'critical'];
  let idx = complexityOrder.indexOf(baseComplexity);
  
  if (keywordCount >= 5) idx = Math.min(3, idx + 2);
  else if (keywordCount >= 3) idx = Math.min(3, idx + 1);
  
  if (hasBreaking) idx = Math.min(3, idx + 1);
  
  return complexityOrder[idx] as 'low' | 'medium' | 'high' | 'critical';
}

function calculateEstimatedDays(baseDays: number, complexity: string, keywordCount: number): number {
  const complexityMultiplier: Record<string, number> = {
    low: 0.8,
    medium: 1.0,
    high: 1.5,
    critical: 2.5,
  };
  
  const multiplier = complexityMultiplier[complexity] || 1;
  const keywordBoost = Math.min(2, 1 + keywordCount * 0.15);
  
  return Math.round(baseDays * multiplier * keywordBoost * 10) / 10;
}

export interface ImpactAssessmentResult {
  overallComplexity: 'low' | 'medium' | 'high' | 'critical';
  totalEstimatedDays: number;
  totalRegressionHours: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedModules: Array<{
    id: string;
    name: string;
    description: string;
    changeType: 'modify' | 'add' | 'remove';
    complexity: 'low' | 'medium' | 'high' | 'critical';
    estimatedDays: number;
    relatedKeywords: string[];
  }>;
  affectedInterfaces: Array<{
    id: string;
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    changeType: 'modify' | 'add' | 'remove';
    description: string;
    complexity: 'low' | 'medium' | 'high' | 'critical';
    breakingChange: boolean;
  }>;
  downstreamSystems: Array<{
    id: string;
    name: string;
    type: 'internal' | 'external' | 'third_party';
    impactDescription: string;
    impactLevel: 'low' | 'medium' | 'high' | 'critical';
    contactTeam?: string;
  }>;
  regressionScopes: Array<{
    id: string;
    name: string;
    description: string;
    testType: 'unit' | 'integration' | 'e2e' | 'manual';
    priority: 'critical' | 'high' | 'medium' | 'low';
    estimatedHours: number;
  }>;
  summary: string;
  recommendations: string[];
}

export function assessImpact(title: string, description: string): ImpactAssessmentResult {
  const combinedText = `${title} ${description}`;
  const keywords = extractSemanticKeywords(combinedText);
  
  const moduleScores: Array<{ module: ModuleDefinition; score: number; matchedKeywords: string[] }> = [];
  
  for (const module of SYSTEM_MODULES) {
    const score = calculateModuleRelevance(module, keywords, combinedText);
    if (score > 0) {
      const matchedKeywords = module.keywords.filter(kw => {
        const normKw = normalizeText(kw);
        const expanded = expandWithSynonyms(kw);
        return setHasSome(expanded, e => normalizeText(combinedText).includes(normalizeText(e)));
      });
      moduleScores.push({ module, score, matchedKeywords });
    }
  }
  
  moduleScores.sort((a, b) => b.score - a.score);
  
  const hasBreakingChange = keywords.some(kw => 
    ['支付', '退款', '登录', '注册', '订单', '接口', 'API'].some(k => normalizeText(kw).includes(normalizeText(k)))
  );
  
  const affectedModules = moduleScores.slice(0, 8).map(({ module, matchedKeywords }) => {
    const complexity = assessComplexity(module.defaultComplexity, matchedKeywords.length, hasBreakingChange);
    const estimatedDays = calculateEstimatedDays(module.baseDays, complexity, matchedKeywords.length);
    
    return {
      id: module.id,
      name: module.name,
      description: module.description,
      changeType: 'modify' as const,
      complexity,
      estimatedDays,
      relatedKeywords: matchedKeywords.slice(0, 5),
    };
  });
  
  const moduleIds = new Set(affectedModules.map(m => m.id));
  
  const affectedInterfaces = INTERFACE_PATTERNS
    .filter(iface => {
      if (!moduleIds.has(iface.moduleId)) return false;
      return iface.keywords.some(kw => {
        const expanded = expandWithSynonyms(kw);
        return setHasSome(expanded, e => normalizeText(combinedText).includes(normalizeText(e)));
      });
    })
    .map(iface => ({
      id: `IF-${iface.moduleId.toUpperCase()}-${iface.method}`,
      name: iface.name,
      method: iface.method,
      path: iface.path,
      changeType: 'modify' as const,
      description: `${iface.method} ${iface.path}`,
      complexity: iface.complexity,
      breakingChange: iface.breaking,
    }));
  
  const downstreamSystems = DOWNSTREAM_SYSTEMS
    .filter(system => {
      return system.keywords.some(kw => {
        const expanded = expandWithSynonyms(kw);
        return setHasSome(expanded, e => normalizeText(combinedText).includes(normalizeText(e)));
      });
    })
    .map(system => {
      const impactLevel = assessComplexity(system.baseImpact, 0, hasBreakingChange);
      return {
        id: system.id,
        name: system.name,
        type: system.type,
        impactDescription: `需求涉及${system.keywords.join('、')}相关功能，可能影响${system.name}的${system.type === 'third_party' ? '第三方' : system.type === 'internal' ? '内部' : '外部'}对接`,
        impactLevel,
        contactTeam: system.contactTeam,
      };
    });
  
  const regressionScopes: Array<{
    id: string;
    name: string;
    description: string;
    testType: 'unit' | 'integration' | 'e2e' | 'manual';
    priority: 'critical' | 'high' | 'medium' | 'low';
    estimatedHours: number;
  }> = [];
  
  let regressionHours = 0;
  
  for (const module of affectedModules) {
    const moduleName = module.name;
    
    regressionScopes.push({
      id: `REG-UNIT-${module.id}`,
      name: `${moduleName} - 单元测试`,
      description: `对${moduleName}的核心逻辑进行单元测试覆盖`,
      testType: 'unit',
      priority: module.complexity === 'critical' ? 'critical' : module.complexity === 'high' ? 'high' : 'medium',
      estimatedHours: Math.round(module.estimatedDays * 2 * 10) / 10,
    });
    regressionHours += module.estimatedDays * 2;
    
    regressionScopes.push({
      id: `REG-INT-${module.id}`,
      name: `${moduleName} - 集成测试`,
      description: `验证${moduleName}与其他模块的集成交互`,
      testType: 'integration',
      priority: module.complexity === 'critical' || module.complexity === 'high' ? 'high' : 'medium',
      estimatedHours: Math.round(module.estimatedDays * 1.5 * 10) / 10,
    });
    regressionHours += module.estimatedDays * 1.5;
  }
  
  if (affectedInterfaces.length > 0) {
    regressionScopes.push({
      id: 'REG-API-ALL',
      name: 'API接口回归测试',
      description: `验证${affectedInterfaces.length}个受影响接口的功能正确性和兼容性`,
      testType: 'integration',
      priority: affectedInterfaces.some(i => i.breakingChange) ? 'critical' : 'high',
      estimatedHours: affectedInterfaces.length * 2,
    });
    regressionHours += affectedInterfaces.length * 2;
  }
  
  if (downstreamSystems.length > 0) {
    regressionScopes.push({
      id: 'REG-E2E-DOWNSTREAM',
      name: '下游系统联调测试',
      description: `与${downstreamSystems.length}个下游系统进行联调验证`,
      testType: 'e2e',
      priority: downstreamSystems.some(s => s.impactLevel === 'critical') ? 'critical' : 'high',
      estimatedHours: downstreamSystems.length * 4,
    });
    regressionHours += downstreamSystems.length * 4;
  }
  
  regressionScopes.push({
    id: 'REG-MANUAL-ALL',
    name: '整体功能手工测试',
    description: '对核心业务流程进行手工验证，确保端到端体验',
    testType: 'manual',
    priority: affectedModules.length > 5 ? 'high' : 'medium',
    estimatedHours: Math.round(affectedModules.length * 1.5 * 10) / 10,
  });
  regressionHours += affectedModules.length * 1.5;
  
  const totalEstimatedDays = affectedModules.reduce((sum, m) => sum + m.estimatedDays, 0);
  const avgComplexity = affectedModules.length > 0
    ? affectedModules.reduce((sum, m) => {
        const weights: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
        return sum + (weights[m.complexity] || 2);
      }, 0) / affectedModules.length
    : 1;
  
  let overallComplexity: 'low' | 'medium' | 'high' | 'critical';
  if (avgComplexity >= 3.5) overallComplexity = 'critical';
  else if (avgComplexity >= 2.5) overallComplexity = 'high';
  else if (avgComplexity >= 1.5) overallComplexity = 'medium';
  else overallComplexity = 'low';
  
  const riskFactors = [
    hasBreakingChange,
    affectedInterfaces.some(i => i.breakingChange),
    downstreamSystems.some(s => s.impactLevel === 'critical'),
    overallComplexity === 'critical',
    affectedModules.length >= 5,
  ];
  
  const riskCount = riskFactors.filter(Boolean).length;
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskCount >= 4) riskLevel = 'critical';
  else if (riskCount >= 2) riskLevel = 'high';
  else if (riskCount >= 1) riskLevel = 'medium';
  else riskLevel = 'low';
  
  const recommendations: string[] = [];
  
  if (hasBreakingChange) {
    recommendations.push('存在破坏性变更，建议制定详细的版本升级计划，提供过渡期和迁移方案');
  }
  
  if (downstreamSystems.some(s => s.impactLevel === 'critical')) {
    recommendations.push('涉及关键下游系统，建议提前与对接团队沟通，安排联调时间');
  }
  
  if (overallComplexity === 'critical' || overallComplexity === 'high') {
    recommendations.push('整体复杂度较高，建议拆分为多个迭代逐步交付，降低单次发布风险');
  }
  
  if (affectedModules.length >= 4) {
    recommendations.push('涉及模块较多，建议安排架构评审，确保整体设计方案合理');
  }
  
  if (keywords.some(kw => normalizeText(kw).includes('支付') || normalizeText(kw).includes('退款'))) {
    recommendations.push('涉及资金相关功能，建议增加安全审计和灰度发布流程');
  }
  
  if (keywords.some(kw => normalizeText(kw).includes('登录') || normalizeText(kw).includes('认证'))) {
    recommendations.push('涉及认证流程，建议进行安全测试，防范OWASP Top 10风险');
  }
  
  if (riskLevel === 'high' || riskLevel === 'critical') {
    recommendations.push('整体风险较高，建议预留额外的缓冲时间（建议增加20%工期）');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('整体影响可控，按常规开发流程推进即可');
  }
  
  const summary = `本需求预估涉及 ${affectedModules.length} 个功能模块、${affectedInterfaces.length} 个接口、${downstreamSystems.length} 个下游系统。整体复杂度为${overallComplexity === 'low' ? '低' : overallComplexity === 'medium' ? '中' : overallComplexity === 'high' ? '高' : '极高'}，预估开发周期约 ${Math.round(totalEstimatedDays)} 天，回归测试约 ${Math.round(regressionHours)} 小时。风险等级为${riskLevel === 'low' ? '低' : riskLevel === 'medium' ? '中' : riskLevel === 'high' ? '高' : '极高'}。`;
  
  return {
    overallComplexity,
    totalEstimatedDays: Math.round(totalEstimatedDays * 10) / 10,
    totalRegressionHours: Math.round(regressionHours * 10) / 10,
    riskLevel,
    affectedModules,
    affectedInterfaces,
    downstreamSystems,
    regressionScopes,
    summary,
    recommendations,
  };
}
