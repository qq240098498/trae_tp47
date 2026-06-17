import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequirementStore } from '@/store/useRequirementStore';
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Calendar,
  User,
  X,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge, PriorityBadge, SourceBadge, TagBadge } from '@/components/Badges';
import { STATUS_LABELS, PRIORITY_LABELS } from '@/types';
import type { RequirementStatus, PriorityLevel, Requirement, RequirementSource, AcceptanceCriterion, UserStory, PriorityScore, DuplicateMatch } from '@/types';
import { cn } from '@/lib/utils';

type SortField = 'createdAt' | 'updatedAt' | 'priority' | 'score';
type SortOrder = 'asc' | 'desc';

export default function Requirements() {
  const navigate = useNavigate();
  const {
    requirements,
    searchQuery,
    filterStatus,
    filterPriority,
    setSearchQuery,
    setFilterStatus,
    setFilterPriority,
    getFilteredRequirements,
    addRequirement,
    checkForDuplicates,
  } = useRequirementStore();

  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const filteredRequirements = getFilteredRequirements();

  const sortedRequirements = [...filteredRequirements].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'priority':
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'score':
        comparison = a.score.finalScore - b.score.finalScore;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={cn(
        'flex items-center gap-1 text-xs font-medium',
        sortField === field ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
      )}
    >
      {label}
      {sortField === field ? (
        sortOrder === 'asc' ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">需求列表</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {filteredRequirements.length} 条需求 / 总计 {requirements.length} 条
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          新建需求
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索需求标题、描述、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
            showFilterPanel
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          )}
        >
          <Filter className="h-4 w-4" />
          筛选
        </button>
      </div>

      {showFilterPanel && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as RequirementStatus | 'all')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">全部状态</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">优先级</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as PriorityLevel | 'all')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">全部优先级</option>
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setFilterPriority('all');
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                重置筛选
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          显示 {sortedRequirements.length} 条结果
        </div>
        <div className="flex items-center gap-4">
          <SortButton field="updatedAt" label="更新时间" />
          <SortButton field="createdAt" label="创建时间" />
          <SortButton field="priority" label="优先级" />
          <SortButton field="score" label="评分" />
        </div>
      </div>

      <div className="space-y-3">
        {sortedRequirements.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">没有找到匹配的需求</p>
            <p className="mt-1 text-xs text-gray-500">尝试调整筛选条件或搜索关键词</p>
          </div>
        ) : (
          sortedRequirements.map((req: Requirement) => (
            <div
              key={req.id}
              onClick={() => navigate(`/requirements/${req.id}`)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">{req.id}</span>
                    <StatusBadge status={req.status} />
                    <PriorityBadge priority={req.priority} />
                    <SourceBadge source={req.source} />
                    {req.conflicts.length > 0 && (
                      <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                        ⚠️ 有冲突
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 truncate text-base font-semibold text-gray-900">
                    {req.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                    {req.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {req.tags.slice(0, 4).map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                    {req.tags.length > 4 && (
                      <span className="text-xs text-gray-400">+{req.tags.length - 4}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  <div className="rounded-lg bg-blue-50 px-3 py-2">
                    <div className="text-xs text-blue-600">优先级评分</div>
                    <div className="text-xl font-bold text-blue-700">
                      {req.score.finalScore}
                    </div>
                  </div>
                  {req.estimatedDays && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      预估 {req.estimatedDays} 天
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {req.assignee && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {req.assignee}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    创建于 {new Date(req.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{req.acceptanceCriteria.length} 条验收标准</span>
                  {req.dependencies.length > 0 && (
                    <span>依赖 {req.dependencies.length} 项</span>
                  )}
                  {req.dependents.length > 0 && (
                    <span>被 {req.dependents.length} 项依赖</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <CreateRequirementModal
          onClose={() => setShowModal(false)}
          onSubmit={(req) => {
            addRequirement(req);
            setShowModal(false);
          }}
          checkForDuplicates={checkForDuplicates}
          navigate={navigate}
        />
      )}
    </div>
  );
}

interface CreateRequirementModalProps {
  onClose: () => void;
  onSubmit: (req: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt' | 'dependents' | 'conflicts'>) => void;
  checkForDuplicates: (title: string, description: string) => { hasDuplicates: boolean; matches: DuplicateMatch[]; threshold: number };
  navigate: (path: string) => void;
}

function CreateRequirementModal({ onClose, onSubmit, checkForDuplicates, navigate }: CreateRequirementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: 'user_feedback' as RequirementSource,
    priority: 'medium' as PriorityLevel,
    status: 'draft' as RequirementStatus,
    asA: '',
    iWant: '',
    soThat: '',
    userValue: 5,
    implementationCost: 5,
    strategicAlignment: 5,
    urgency: 5,
    assignee: '',
    estimatedDays: '',
    tags: '',
  });
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<{ description: string; testable: boolean; status: 'pending' }[]>([
    { description: '', testable: true, status: 'pending' },
  ]);
  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'criteria' | 'score'>('basic');
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  const duplicateCheckResult = useMemo(() => {
    if (!formData.title.trim() && !formData.description.trim()) {
      return { hasDuplicates: false, matches: [], threshold: 0.6 };
    }
    return checkForDuplicates(formData.title, formData.description);
  }, [formData.title, formData.description, checkForDuplicates]);

  useEffect(() => {
    if (duplicateCheckResult.hasDuplicates) {
      setShowDuplicateWarning(true);
    }
  }, [duplicateCheckResult.hasDuplicates]);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addCriterion = () => {
    setAcceptanceCriteria((prev) => [...prev, { description: '', testable: true, status: 'pending' }]);
  };

  const updateCriterion = (index: number, value: string) => {
    setAcceptanceCriteria((prev) => prev.map((ac, i) => (i === index ? { ...ac, description: value } : ac)));
  };

  const removeCriterion = (index: number) => {
    if (acceptanceCriteria.length > 1) {
      setAcceptanceCriteria((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('请输入需求标题');
      return;
    }
    if (!formData.asA.trim() || !formData.iWant.trim() || !formData.soThat.trim()) {
      alert('请完整填写用户故事');
      return;
    }

    const validCriteria = acceptanceCriteria.filter((ac) => ac.description.trim());
    if (validCriteria.length === 0) {
      alert('请至少添加一条验收标准');
      return;
    }

    const score: PriorityScore = {
      userValue: formData.userValue,
      implementationCost: formData.implementationCost,
      strategicAlignment: formData.strategicAlignment,
      urgency: formData.urgency,
      finalScore: 0,
    };

    const userStory: UserStory = {
      asA: formData.asA,
      iWant: formData.iWant,
      soThat: formData.soThat,
    };

    const criteria: AcceptanceCriterion[] = validCriteria.map((ac) => ({
      id: '',
      description: ac.description,
      testable: ac.testable,
      status: ac.status,
    }));

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      source: formData.source,
      status: formData.status,
      priority: formData.priority,
      userStory,
      acceptanceCriteria: criteria,
      score,
      dependencies: [],
      tags,
      assignee: formData.assignee.trim() || undefined,
      estimatedDays: formData.estimatedDays ? parseInt(formData.estimatedDays) : undefined,
    });
  };

  const tabs = [
    { key: 'basic' as const, label: '基本信息' },
    { key: 'story' as const, label: '用户故事' },
    { key: 'criteria' as const, label: '验收标准' },
    { key: 'score' as const, label: '优先级评分' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">新建需求</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  需求标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="简明扼要地描述需求"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">需求描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="详细描述需求的背景和问题..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">来源</label>
                  <select
                    value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {Object.entries({
                      user_feedback: '用户反馈',
                      customer_support: '客服反馈',
                      sales: '销售反馈',
                      product_strategy: '产品战略',
                      technical_debt: '技术债务',
                      competitor: '竞品分析',
                      internal: '内部需求',
                    }).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">优先级</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">负责人</label>
                  <input
                    type="text"
                    value={formData.assignee}
                    onChange={(e) => handleChange('assignee', e.target.value)}
                    placeholder="输入负责人姓名"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">预估工期（天）</label>
                  <input
                    type="number"
                    value={formData.estimatedDays}
                    onChange={(e) => handleChange('estimatedDays', e.target.value)}
                    placeholder="例如：5"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">标签（逗号分隔）</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="例如：登录, 用户体验, 安全"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {(formData.title.trim() || formData.description.trim()) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {duplicateCheckResult.hasDuplicates ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-amber-800">
                              检测到 {duplicateCheckResult.matches.length} 条疑似重复的需求
                            </h4>
                            <button
                              onClick={() => setShowDuplicateWarning(!showDuplicateWarning)}
                              className="text-xs text-amber-600 hover:text-amber-800"
                            >
                              {showDuplicateWarning ? '收起详情' : '查看详情'}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-amber-700">
                            相似度阈值：{(duplicateCheckResult.threshold * 100).toFixed(0)}%，建议先核对是否为同一诉求
                          </p>
                        </div>
                      </div>

                      {showDuplicateWarning && (
                        <div className="mt-4 space-y-4">
                          {duplicateCheckResult.matches.map((match, index) => (
                            <div
                              key={match.requirement.id}
                              className="rounded-lg border border-amber-200 bg-white overflow-hidden"
                            >
                              <div className="bg-amber-100 px-4 py-2 flex items-center justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-semibold text-amber-800">
                                    疑似重复 #{index + 1}
                                  </span>
                                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
                                    相似度 {(match.similarity * 100).toFixed(1)}%
                                  </span>
                                  {match.matchedFields.includes('title') && (
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                                      标题匹配
                                    </span>
                                  )}
                                  {match.matchedFields.includes('description') && (
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                      描述匹配
                                    </span>
                                  )}
                                  {match.matchedFields.includes('keywords') && (
                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                                      语义匹配
                                    </span>
                                  )}
                                  {match.matchedKeywords.length > 0 && (
                                    <span className="inline-flex flex-wrap items-center gap-1">
                                      {match.matchedKeywords.map(kw => (
                                        <span
                                          key={kw}
                                          className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-700"
                                        >
                                          {kw}
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    navigate(`/requirements/${match.requirement.id}`);
                                    onClose();
                                  }}
                                  className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  查看详情
                                </button>
                              </div>

                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
                                    <div className="mb-2 flex items-center gap-2">
                                      <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                                        新需求
                                      </span>
                                    </div>
                                    <h5 className="text-sm font-medium text-gray-900 mb-1">
                                      {formData.title || '(未填写标题)'}
                                    </h5>
                                    <p className="text-xs text-gray-600 line-clamp-3">
                                      {formData.description || '(未填写描述)'}
                                    </p>
                                  </div>

                                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                    <div className="mb-2 flex items-center gap-2">
                                      <span className="text-xs font-medium text-amber-700 bg-amber-200 px-2 py-0.5 rounded">
                                        已有需求
                                      </span>
                                      <span className="font-mono text-xs text-gray-400">
                                        {match.requirement.id}
                                      </span>
                                    </div>
                                    <h5 className="text-sm font-medium text-gray-900 mb-1">
                                      {match.requirement.title}
                                    </h5>
                                    <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                                      {match.requirement.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                      <StatusBadge status={match.requirement.status} />
                                      <div className="flex items-center gap-1 text-gray-500">
                                        <User className="h-3 w-3" />
                                        {match.requirement.assignee || '未分配'}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      创建于 {new Date(match.requirement.createdAt).toLocaleDateString('zh-CN')}
                                    </div>
                                    {match.requirement.estimatedDays && (
                                      <div>预估工期 {match.requirement.estimatedDays} 天</div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        title: match.requirement.title,
                                        description: match.requirement.description,
                                      }));
                                    }}
                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    <Copy className="h-3 w-3" />
                                    复制内容
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700">
                        未检测到相似需求，可以放心创建
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="mb-2 text-sm font-medium text-blue-800">用户故事格式</p>
                <p className="text-xs text-blue-600">
                  作为一个「用户角色」，我想要「功能/目标」，以便于「业务价值」
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  作为一个 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.asA}
                  onChange={(e) => handleChange('asA', e.target.value)}
                  placeholder="例如：普通用户"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  我想要 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.iWant}
                  onChange={(e) => handleChange('iWant', e.target.value)}
                  placeholder="例如：使用手机号和验证码登录系统"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  以便于 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.soThat}
                  onChange={(e) => handleChange('soThat', e.target.value)}
                  placeholder="例如：我不需要记住密码，能够快速登录使用产品"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {formData.asA && formData.iWant && formData.soThat && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">预览</p>
                  <p className="mt-1 text-sm text-green-700">
                    作为一个 <span className="font-semibold">{formData.asA}</span>，我想要{' '}
                    <span className="font-semibold">{formData.iWant}</span>，以便于{' '}
                    <span className="font-semibold">{formData.soThat}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'criteria' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="mb-1 text-sm font-medium text-amber-800">验收标准编写规范</p>
                <p className="text-xs text-amber-600">
                  验收标准必须具备可测试性，避免使用「快速」「友好」「美观」等模糊词汇。应该描述明确的输入输出和预期结果。
                </p>
              </div>

              <div className="space-y-3">
                {acceptanceCriteria.map((ac, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-start pt-2 text-sm font-medium text-gray-400">
                      AC-{index + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ac.description}
                        onChange={(e) => updateCriterion(index, e.target.value)}
                        placeholder="例如：点击「获取验证码」后，按钮显示60秒倒计时"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <button
                      onClick={() => removeCriterion(index)}
                      className="mt-2 text-gray-400 hover:text-red-500"
                      disabled={acceptanceCriteria.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addCriterion}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                添加验收标准
              </button>
            </div>
          )}

          {activeTab === 'score' && (
            <div className="space-y-6">
              <div className="rounded-lg bg-indigo-50 p-4">
                <p className="mb-1 text-sm font-medium text-indigo-800">优先级评分说明</p>
                <p className="text-xs text-indigo-600">
                  每项 1-10 分，分数越高表示该维度越显著（成本除外，成本越高分数越高）
                </p>
              </div>

              {[
                { key: 'userValue' as const, label: '用户价值', desc: '需求对用户的价值大小' },
                { key: 'implementationCost' as const, label: '实现成本', desc: '开发所需的时间和资源' },
                { key: 'strategicAlignment' as const, label: '战略对齐', desc: '与产品战略目标的契合度' },
                { key: 'urgency' as const, label: '紧急程度', desc: '需求的时间敏感性' },
              ].map((item) => (
                <div key={item.key}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">{item.label}</label>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{formData[item.key]}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData[item.key]}
                    onChange={(e) => handleChange(item.key, parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-6 py-4">
          <div className="flex text-xs text-gray-500">
            <span className={cn('w-2 h-2 rounded-full mr-1.5 mt-0.5', activeTab === 'basic' ? 'bg-blue-600' : 'bg-gray-300')} />
            <span className={cn('w-2 h-2 rounded-full mr-1.5 mt-0.5', activeTab === 'story' ? 'bg-blue-600' : 'bg-gray-300')} />
            <span className={cn('w-2 h-2 rounded-full mr-1.5 mt-0.5', activeTab === 'criteria' ? 'bg-blue-600' : 'bg-gray-300')} />
            <span className={cn('w-2 h-2 rounded-full mt-0.5', activeTab === 'score' ? 'bg-blue-600' : 'bg-gray-300')} />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              创建需求
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
