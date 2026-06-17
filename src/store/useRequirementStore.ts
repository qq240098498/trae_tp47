import { create } from 'zustand';
import type {
  Requirement,
  RequirementStatus,
  AcceptanceCriterion,
  UserStory,
  PriorityScore,
  Dependency,
  PriorityLevel,
  DuplicateCheckResult,
  UserVoiceDemand,
  UserVoiceStatistics,
  FeedbackChannel,
  UserFeedbackItem,
  SentimentType,
} from '@/types';
import { mockRequirements, mockDependencies, mockUserVoiceDemands, mockUserVoiceStatistics, mockUserFeedbacks } from '@/data/mockData';
import { calculateRequirementSimilarity, assessImpact, type ImpactAssessmentResult } from '@/lib/utils';

interface RequirementStore {
  requirements: Requirement[];
  dependencies: Dependency[];
  selectedRequirementId: string | null;
  filterStatus: RequirementStatus | 'all';
  filterPriority: PriorityLevel | 'all';
  searchQuery: string;
  duplicateCheckThreshold: number;

  setSelectedRequirementId: (id: string | null) => void;
  setFilterStatus: (status: RequirementStatus | 'all') => void;
  setFilterPriority: (priority: PriorityLevel | 'all') => void;
  setSearchQuery: (query: string) => void;
  setDuplicateCheckThreshold: (threshold: number) => void;

  getRequirementById: (id: string) => Requirement | undefined;
  getFilteredRequirements: () => Requirement[];
  getRequirementsByStatus: (status: RequirementStatus) => Requirement[];
  getDependenciesForRequirement: (requirementId: string) => Dependency[];
  getConflictsForRequirement: (requirementId: string) => Dependency[];

  checkForDuplicates: (title: string, description: string, excludeId?: string) => DuplicateCheckResult;

  addRequirement: (requirement: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt' | 'dependents' | 'conflicts'>) => void;
  updateRequirement: (id: string, updates: Partial<Requirement>) => void;
  deleteRequirement: (id: string) => void;
  updateRequirementStatus: (id: string, status: RequirementStatus, note?: string) => void;

  addAcceptanceCriterion: (requirementId: string, criterion: Omit<AcceptanceCriterion, 'id'>) => void;
  updateAcceptanceCriterion: (requirementId: string, criterionId: string, updates: Partial<AcceptanceCriterion>) => void;
  deleteAcceptanceCriterion: (requirementId: string, criterionId: string) => void;

  addDependency: (fromId: string, toId: string, type: Dependency['type'], description?: string) => void;
  removeDependency: (dependencyId: string) => void;

  updateUserStory: (requirementId: string, userStory: UserStory) => void;
  calculatePriorityScore: (score: Omit<PriorityScore, 'finalScore'>) => number;
  updatePriorityScore: (requirementId: string, score: Omit<PriorityScore, 'finalScore'>) => void;

  getPrioritizedRequirements: () => Requirement[];
  getStatistics: () => {
    total: number;
    byStatus: Record<RequirementStatus, number>;
    byPriority: Record<PriorityLevel, number>;
    avgScore: number;
    hasConflicts: number;
    hasDependencies: number;
  };

  getImpactAssessment: (requirementId: string) => ImpactAssessmentResult | null;
  getImpactAssessmentFromText: (title: string, description: string) => ImpactAssessmentResult;

  userVoiceDemands: UserVoiceDemand[];
  userVoiceStatistics: UserVoiceStatistics;
  userVoiceSearchQuery: string;
  userVoiceFilterChannels: FeedbackChannel[];
  userVoiceSortBy: 'heat' | 'mentions' | 'negative' | 'trend';

  setUserVoiceSearchQuery: (query: string) => void;
  toggleUserVoiceChannelFilter: (channel: FeedbackChannel) => void;
  setUserVoiceSortBy: (sortBy: 'heat' | 'mentions' | 'negative' | 'trend') => void;
  getUserVoiceDemands: () => UserVoiceDemand[];
  getUserVoiceDemandById: (id: string) => UserVoiceDemand | undefined;
  getUserVoiceStatistics: () => UserVoiceStatistics;

  userFeedbacks: UserFeedbackItem[];
  addUserFeedback: (feedback: Omit<UserFeedbackItem, 'id' | 'timestamp'>) => void;
  getUserFeedbacks: () => UserFeedbackItem[];
}

const generateId = () => {
  return 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const generateCriterionId = () => {
  return 'AC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const generateFeedbackId = () => {
  return 'FB-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const SENTIMENT_KEYWORDS: Record<SentimentType, string[]> = {
  positive: ['好', '棒', '赞', '喜欢', '不错', '方便', '满意', '快', '优秀', '感谢', '期待', '终于', '舒服', 'great', 'good', 'love', 'nice', 'awesome'],
  negative: ['慢', '卡', '差', '烂', '难用', '不方便', '麻烦', '崩溃', '闪退', '无法', '缺失', '缺失', '太慢', '着急', '不够', '看不清', 'bug', 'bad', 'terrible', 'hate', '问题', '错误', '失败', '不专业'],
  neutral: [],
};

function analyzeSentiment(content: string): { sentiment: SentimentType; score: number } {
  let posScore = 0;
  let negScore = 0;
  const lower = content.toLowerCase();
  for (const kw of SENTIMENT_KEYWORDS.positive) {
    if (lower.includes(kw)) posScore++;
  }
  for (const kw of SENTIMENT_KEYWORDS.negative) {
    if (lower.includes(kw)) negScore++;
  }
  if (posScore > negScore) return { sentiment: 'positive', score: Math.min(posScore / (posScore + negScore + 1), 1) };
  if (negScore > posScore) return { sentiment: 'negative', score: -Math.min(negScore / (posScore + negScore + 1), 1) };
  return { sentiment: 'neutral', score: 0 };
}

function extractKeywords(content: string): string[] {
  const stopwords = new Set(['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '他', '她', '它', '吗', '吧', '啊', '呢', '把', '被', '让', '给', '对', '能', '还', '多', '什么', '那', '里', '来', '下', '用', '过', '时候', '可以', '希望', '需要', '目前', '现在', '功能', '系统', '这个', '那个', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'and', 'but', 'or', 'not', 'no', 'if', 'it', 'its']);
  return content
    .replace(/[，。！？、；：""''（）【】《》\[\]{},.!?;:'"()]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !stopwords.has(w.toLowerCase()))
    .slice(0, 5);
}

export const useRequirementStore = create<RequirementStore>((set, get) => ({
  requirements: mockRequirements,
  dependencies: mockDependencies,
  selectedRequirementId: null,
  filterStatus: 'all',
  filterPriority: 'all',
  searchQuery: '',
  duplicateCheckThreshold: 0.6,

  userVoiceDemands: mockUserVoiceDemands,
  userVoiceStatistics: mockUserVoiceStatistics,
  userVoiceSearchQuery: '',
  userVoiceFilterChannels: [],
  userVoiceSortBy: 'heat',

  userFeedbacks: mockUserFeedbacks,

  setSelectedRequirementId: (id) => set({ selectedRequirementId: id }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDuplicateCheckThreshold: (threshold) => set({ duplicateCheckThreshold: threshold }),

  checkForDuplicates: (title, description, excludeId) => {
    const { requirements, duplicateCheckThreshold } = get();
    const matches = [];

    for (const req of requirements) {
      if (excludeId && req.id === excludeId) continue;
      if (req.status === 'archived') continue;

      const { similarity, matchedFields, matchedKeywords } = calculateRequirementSimilarity(
        title,
        description,
        req.title,
        req.description
      );

      if (similarity >= duplicateCheckThreshold && (matchedFields.length > 0 || matchedKeywords.length >= 2)) {
        matches.push({
          requirement: req,
          similarity,
          matchedFields,
          matchedKeywords,
        });
      }
    }

    matches.sort((a, b) => b.similarity - a.similarity);

    return {
      hasDuplicates: matches.length > 0,
      matches,
      threshold: duplicateCheckThreshold,
    };
  },

  getRequirementById: (id) => {
    return get().requirements.find((r) => r.id === id);
  },

  getFilteredRequirements: () => {
    const { requirements, filterStatus, filterPriority, searchQuery } = get();
    return requirements.filter((r) => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((t) => t.toLowerCase().includes(query))
        );
      }
      return true;
    });
  },

  getRequirementsByStatus: (status) => {
    return get().requirements.filter((r) => r.status === status);
  },

  getDependenciesForRequirement: (requirementId) => {
    return get().dependencies.filter(
      (d) => d.fromRequirementId === requirementId || d.toRequirementId === requirementId
    );
  },

  getConflictsForRequirement: (requirementId) => {
    return get().dependencies.filter(
      (d) =>
        d.type === 'conflicts' &&
        (d.fromRequirementId === requirementId || d.toRequirementId === requirementId)
    );
  },

  addRequirement: (requirement) => {
    const { userValue, implementationCost, strategicAlignment, urgency } = requirement.score;
    const newReq: Requirement = {
      ...requirement,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      acceptanceCriteria: requirement.acceptanceCriteria.map((ac) => ({
        ...ac,
        id: generateCriterionId(),
      })),
      score: {
        userValue,
        implementationCost,
        strategicAlignment,
        urgency,
        finalScore: get().calculatePriorityScore({
          userValue,
          implementationCost,
          strategicAlignment,
          urgency,
        }),
      },
      dependents: [],
      conflicts: [],
    };
    set((state) => ({ requirements: [...state.requirements, newReq] }));
  },

  updateRequirement: (id, updates) => {
    set((state) => ({
      requirements: state.requirements.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      ),
    }));
  },

  deleteRequirement: (id) => {
    set((state) => ({
      requirements: state.requirements.filter((r) => r.id !== id),
      dependencies: state.dependencies.filter(
        (d) => d.fromRequirementId !== id && d.toRequirementId !== id
      ),
    }));
  },

  updateRequirementStatus: (id, status) => {
    set((state) => ({
      requirements: state.requirements.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    }));
  },

  addAcceptanceCriterion: (requirementId, criterion) => {
    const newCriterion: AcceptanceCriterion = {
      ...criterion,
      id: generateCriterionId(),
    };
    set((state) => ({
      requirements: state.requirements.map((r) =>
        r.id === requirementId
          ? {
              ...r,
              acceptanceCriteria: [...r.acceptanceCriteria, newCriterion],
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  },

  updateAcceptanceCriterion: (requirementId, criterionId, updates) => {
    set((state) => ({
      requirements: state.requirements.map((r) =>
        r.id === requirementId
          ? {
              ...r,
              acceptanceCriteria: r.acceptanceCriteria.map((ac) =>
                ac.id === criterionId ? { ...ac, ...updates } : ac
              ),
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  },

  deleteAcceptanceCriterion: (requirementId, criterionId) => {
    set((state) => ({
      requirements: state.requirements.map((r) =>
        r.id === requirementId
          ? {
              ...r,
              acceptanceCriteria: r.acceptanceCriteria.filter((ac) => ac.id !== criterionId),
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  },

  addDependency: (fromId, toId, type, description) => {
    const newDep: Dependency = {
      id: 'DEP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      fromRequirementId: fromId,
      toRequirementId: toId,
      type,
      description,
    };

    set((state) => {
      const updatedReqs = state.requirements.map((r) => {
        if (r.id === fromId && type === 'depends_on') {
          return { ...r, dependencies: [...r.dependencies, toId] };
        }
        if (r.id === toId && type === 'depends_on') {
          return { ...r, dependents: [...r.dependents, fromId] };
        }
        if (r.id === fromId && type === 'blocks') {
          return { ...r, dependents: [...r.dependents, toId] };
        }
        if (r.id === toId && type === 'blocks') {
          return { ...r, dependencies: [...r.dependencies, fromId] };
        }
        if (type === 'conflicts' && (r.id === fromId || r.id === toId)) {
          const otherId = r.id === fromId ? toId : fromId;
          if (!r.conflicts.includes(otherId)) {
            return { ...r, conflicts: [...r.conflicts, otherId] };
          }
        }
        return r;
      });

      return {
        dependencies: [...state.dependencies, newDep],
        requirements: updatedReqs,
      };
    });
  },

  removeDependency: (dependencyId) => {
    set((state) => {
      const dep = state.dependencies.find((d) => d.id === dependencyId);
      if (!dep) return state;

      const updatedReqs = state.requirements.map((r) => {
        if (r.id === dep.fromRequirementId && dep.type === 'depends_on') {
          return { ...r, dependencies: r.dependencies.filter((id) => id !== dep.toRequirementId) };
        }
        if (r.id === dep.toRequirementId && dep.type === 'depends_on') {
          return {
            ...r,
            dependents: r.dependents.filter((id) => id !== dep.fromRequirementId),
          };
        }
        if (r.id === dep.fromRequirementId && dep.type === 'blocks') {
          return {
            ...r,
            dependents: r.dependents.filter((id) => id !== dep.toRequirementId),
          };
        }
        if (r.id === dep.toRequirementId && dep.type === 'blocks') {
          return { ...r, dependencies: r.dependencies.filter((id) => id !== dep.fromRequirementId) };
        }
        if (dep.type === 'conflicts') {
          const otherId = r.id === dep.fromRequirementId ? dep.toRequirementId : dep.fromRequirementId;
          if (r.id === dep.fromRequirementId || r.id === dep.toRequirementId) {
            return { ...r, conflicts: r.conflicts.filter((id) => id !== otherId) };
          }
        }
        return r;
      });

      return {
        dependencies: state.dependencies.filter((d) => d.id !== dependencyId),
        requirements: updatedReqs,
      };
    });
  },

  updateUserStory: (requirementId, userStory) => {
    set((state) => ({
      requirements: state.requirements.map((r) =>
        r.id === requirementId ? { ...r, userStory, updatedAt: new Date().toISOString() } : r
      ),
    }));
  },

  calculatePriorityScore: (score) => {
    const { userValue, implementationCost, strategicAlignment, urgency } = score;
    const valueScore = (userValue + strategicAlignment + urgency) / 3;
    const costEfficiency = implementationCost > 0 ? valueScore / implementationCost : 0;
    return Math.round((valueScore * 0.6 + costEfficiency * 10 * 0.4) * 10);
  },

  updatePriorityScore: (requirementId, score) => {
    const finalScore = get().calculatePriorityScore(score);
    set((state) => ({
      requirements: state.requirements.map((r) =>
        r.id === requirementId
          ? { ...r, score: { ...score, finalScore }, updatedAt: new Date().toISOString() }
          : r
      ),
    }));
  },

  getPrioritizedRequirements: () => {
    return [...get().requirements].sort((a, b) => b.score.finalScore - a.score.finalScore);
  },

  getStatistics: () => {
    const { requirements } = get();
    const total = requirements.length;

    const byStatus: Record<RequirementStatus, number> = {
      draft: 0,
      analysis: 0,
      planning: 0,
      developing: 0,
      testing: 0,
      deployed: 0,
      archived: 0,
    };

    const byPriority: Record<PriorityLevel, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    let totalScore = 0;
    let hasConflicts = 0;
    let hasDependencies = 0;

    requirements.forEach((r) => {
      byStatus[r.status]++;
      byPriority[r.priority]++;
      totalScore += r.score.finalScore;
      if (r.conflicts.length > 0) hasConflicts++;
      if (r.dependencies.length > 0 || r.dependents.length > 0) hasDependencies++;
    });

    return {
      total,
      byStatus,
      byPriority,
      avgScore: total > 0 ? Math.round((totalScore / total) * 10) / 10 : 0,
      hasConflicts,
      hasDependencies,
    };
  },

  getImpactAssessment: (requirementId) => {
    const req = get().getRequirementById(requirementId);
    if (!req) return null;
    return assessImpact(req.title, req.description);
  },

  getImpactAssessmentFromText: (title, description) => {
    return assessImpact(title, description);
  },

  setUserVoiceSearchQuery: (query) => set({ userVoiceSearchQuery: query }),
  toggleUserVoiceChannelFilter: (channel) =>
    set((state) => ({
      userVoiceFilterChannels: state.userVoiceFilterChannels.includes(channel)
        ? state.userVoiceFilterChannels.filter((c) => c !== channel)
        : [...state.userVoiceFilterChannels, channel],
    })),
  setUserVoiceSortBy: (sortBy) => set({ userVoiceSortBy: sortBy }),
  getUserVoiceDemands: () => {
    const { userVoiceDemands, userVoiceSearchQuery, userVoiceFilterChannels, userVoiceSortBy } = get();
    let result = [...userVoiceDemands];

    if (userVoiceSearchQuery) {
      const q = userVoiceSearchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.featureName.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (userVoiceFilterChannels.length > 0) {
      result = result.filter((d) =>
        userVoiceFilterChannels.some((c) => d.channelBreakdown[c] > 0)
      );
    }

    switch (userVoiceSortBy) {
      case 'heat':
        result.sort((a, b) => b.heatScore - a.heatScore);
        break;
      case 'mentions':
        result.sort((a, b) => b.totalMentions - a.totalMentions);
        break;
      case 'negative':
        result.sort((a, b) => b.sentimentBreakdown.negative - a.sentimentBreakdown.negative);
        break;
      case 'trend':
        result.sort((a, b) => b.trendChange - a.trendChange);
        break;
    }

    return result;
  },
  getUserVoiceDemandById: (id) => get().userVoiceDemands.find((d) => d.id === id),
  getUserVoiceStatistics: () => get().userVoiceStatistics,

  addUserFeedback: (feedback) => {
    const newFeedback: UserFeedbackItem = {
      ...feedback,
      id: generateFeedbackId(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ userFeedbacks: [newFeedback, ...state.userFeedbacks] }));
  },
  getUserFeedbacks: () => {
    return [...get().userFeedbacks].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
}));
