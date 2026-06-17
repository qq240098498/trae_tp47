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
  }
}
