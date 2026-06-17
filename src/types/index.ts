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
