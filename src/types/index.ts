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
