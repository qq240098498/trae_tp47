export type RequirementStatus =
  | 'draft'
  | 'analysis'
  | 'planning'
  | 'developing'
  | 'testing'
  | 'deployed'
  | 'archived';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type RequirementSource =
  | 'user_feedback'
  | 'customer_support'
  | 'sales'
  | 'product_strategy'
  | 'technical_debt'
  | 'competitor'
  | 'internal';

export interface AcceptanceCriterion {
  id: string;
  description: string;
  testable: boolean;
  status: 'pending' | 'pass' | 'fail';
}

export interface UserStory {
  asA: string;
  iWant: string;
  soThat: string;
}

export interface PriorityScore {
  userValue: number;
  implementationCost: number;
  strategicAlignment: number;
  urgency: number;
  finalScore: number;
}

export interface Dependency {
  id: string;
  fromRequirementId: string;
  toRequirementId: string;
  type: 'blocks' | 'depends_on' | 'related' | 'conflicts';
  description?: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  source: RequirementSource;
  status: RequirementStatus;
  userStory: UserStory;
  acceptanceCriteria: AcceptanceCriterion[];
  priority: PriorityLevel;
  score: PriorityScore;
  dependencies: string[];
  dependents: string[];
  conflicts: string[];
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  tags: string[];
  estimatedDays?: number;
}

export interface StatusTransition {
  from: RequirementStatus;
  to: RequirementStatus;
  timestamp: string;
  note?: string;
}

export const STATUS_LABELS: Record<RequirementStatus, string> = {
  draft: '草稿',
  analysis: '待分析',
  planning: '规划中',
  developing: '开发中',
  testing: '测试中',
  deployed: '已上线',
  archived: '已归档',
};

export const STATUS_COLORS: Record<RequirementStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  analysis: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  planning: 'bg-blue-100 text-blue-700 border-blue-300',
  developing: 'bg-purple-100 text-purple-700 border-purple-300',
  testing: 'bg-orange-100 text-orange-700 border-orange-300',
  deployed: 'bg-green-100 text-green-700 border-green-300',
  archived: 'bg-slate-100 text-slate-500 border-slate-300',
};

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  critical: '紧急',
  high: '高',
  medium: '中',
  low: '低',
};

export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-green-500 text-white',
};

export const SOURCE_LABELS: Record<RequirementSource, string> = {
  user_feedback: '用户反馈',
  customer_support: '客服反馈',
  sales: '销售反馈',
  product_strategy: '产品战略',
  technical_debt: '技术债务',
  competitor: '竞品分析',
  internal: '内部需求',
};

export const DEPENDENCY_TYPE_LABELS: Record<Dependency['type'], string> = {
  blocks: '阻塞',
  depends_on: '依赖',
  related: '相关',
  conflicts: '冲突',
};

export const DEPENDENCY_TYPE_COLORS: Record<Dependency['type'], string> = {
  blocks: 'text-red-600 bg-red-50 border-red-200',
  depends_on: 'text-blue-600 bg-blue-50 border-blue-200',
  related: 'text-gray-600 bg-gray-50 border-gray-200',
  conflicts: 'text-orange-600 bg-orange-50 border-orange-200',
};

export interface DuplicateMatch {
  requirement: Requirement;
  similarity: number;
  matchedFields: string[];
  matchedKeywords: string[];
}

export interface DuplicateCheckResult {
  hasDuplicates: boolean;
  matches: DuplicateMatch[];
  threshold: number;
}

export type ImpactComplexity = 'low' | 'medium' | 'high' | 'critical';

export const IMPACT_COMPLEXITY_LABELS: Record<ImpactComplexity, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '极高',
};

export const IMPACT_COMPLEXITY_COLORS: Record<ImpactComplexity, string> = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  critical: 'text-red-600 bg-red-50 border-red-200',
};

export interface AffectedModule {
  id: string;
  name: string;
  description: string;
  changeType: 'modify' | 'add' | 'remove';
  complexity: ImpactComplexity;
  estimatedDays: number;
  relatedKeywords: string[];
}

export interface AffectedInterface {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  changeType: 'modify' | 'add' | 'remove';
  description: string;
  complexity: ImpactComplexity;
  breakingChange: boolean;
}

export interface DownstreamSystem {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'third_party';
  impactDescription: string;
  impactLevel: ImpactComplexity;
  contactTeam?: string;
}

export interface RegressionScope {
  id: string;
  name: string;
  description: string;
  testType: 'unit' | 'integration' | 'e2e' | 'manual';
  priority: PriorityLevel;
  estimatedHours: number;
}

export interface ImpactAssessment {
  requirementId: string;
  overallComplexity: ImpactComplexity;
  totalEstimatedDays: number;
  totalRegressionHours: number;
  riskLevel: ImpactComplexity;
  affectedModules: AffectedModule[];
  affectedInterfaces: AffectedInterface[];
  downstreamSystems: DownstreamSystem[];
  regressionScopes: RegressionScope[];
  summary: string;
  recommendations: string[];
}

export const DOWNSTREAM_SYSTEM_TYPE_LABELS: Record<DownstreamSystem['type'], string> = {
  internal: '内部系统',
  external: '外部系统',
  third_party: '第三方服务',
};

export const CHANGE_TYPE_LABELS: Record<AffectedModule['changeType'], string> = {
  modify: '修改',
  add: '新增',
  remove: '移除',
};

export const CHANGE_TYPE_COLORS: Record<AffectedModule['changeType'], string> = {
  modify: 'text-blue-600 bg-blue-50',
  add: 'text-green-600 bg-green-50',
  remove: 'text-red-600 bg-red-50',
};

export const TEST_TYPE_LABELS: Record<RegressionScope['testType'], string> = {
  unit: '单元测试',
  integration: '集成测试',
  e2e: '端到端测试',
  manual: '手动测试',
};

export type FeedbackChannel = 'customer_service' | 'app_store' | 'social_media' | 'user_interview';

export const FEEDBACK_CHANNEL_LABELS: Record<FeedbackChannel, string> = {
  customer_service: '客服工单',
  app_store: '应用商店评论',
  social_media: '社媒反馈',
  user_interview: '用户访谈记录',
};

export const FEEDBACK_CHANNEL_COLORS: Record<FeedbackChannel, string> = {
  customer_service: 'text-blue-600 bg-blue-50 border-blue-200',
  app_store: 'text-purple-600 bg-purple-50 border-purple-200',
  social_media: 'text-pink-600 bg-pink-50 border-pink-200',
  user_interview: 'text-teal-600 bg-teal-50 border-teal-200',
};

export type SentimentType = 'positive' | 'neutral' | 'negative';

export const SENTIMENT_LABELS: Record<SentimentType, string> = {
  positive: '正面',
  neutral: '中性',
  negative: '负面',
};

export const SENTIMENT_COLORS: Record<SentimentType, string> = {
  positive: 'text-green-600 bg-green-50',
  neutral: 'text-gray-600 bg-gray-50',
  negative: 'text-red-600 bg-red-50',
};

export interface UserFeedbackItem {
  id: string;
  channel: FeedbackChannel;
  content: string;
  sentiment: SentimentType;
  sentimentScore: number;
  keywords: string[];
  timestamp: string;
  userId?: string;
}

export interface UserVoiceDemand {
  id: string;
  featureName: string;
  description: string;
  totalMentions: number;
  uniqueUsers: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  channelBreakdown: Record<FeedbackChannel, number>;
  keywords: string[];
  trend: 'up' | 'stable' | 'down';
  trendChange: number;
  heatScore: number;
  relatedRequirementId?: string;
  sampleFeedbacks: string[];
}

export interface UserVoiceStatistics {
  totalFeedbacks: number;
  totalDemands: number;
  avgSentimentScore: number;
  channelsDistribution: Record<FeedbackChannel, number>;
  topDemands: UserVoiceDemand[];
  trendingDemands: UserVoiceDemand[];
  negativeHotspots: UserVoiceDemand[];
}

