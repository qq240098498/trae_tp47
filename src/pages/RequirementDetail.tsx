import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequirementStore } from '@/store/useRequirementStore';
import {
  ArrowLeft,
  Edit3,
  CheckCircle2,
  Circle,
  XCircle,
  Plus,
  Trash2,
  User,
  Calendar,
  Tag,
  GitBranch,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  DollarSign,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  StatusBadge,
  PriorityBadge,
  SourceBadge,
  TagBadge,
  DependencyBadge,
} from '@/components/Badges';
import { STATUS_LABELS, PRIORITY_LABELS, SOURCE_LABELS } from '@/types';
import type {
  RequirementStatus,
  AcceptanceCriterion,
  UserStory,
} from '@/types';
import { cn } from '@/lib/utils';

export default function RequirementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getRequirementById,
    getDependenciesForRequirement,
    updateAcceptanceCriterion,
    addAcceptanceCriterion,
    deleteAcceptanceCriterion,
    updateRequirementStatus,
  } = useRequirementStore();

  const requirement = getRequirementById(id || '');
  const dependencies = getDependenciesForRequirement(id || '');
  const [editingUserStory, setEditingUserStory] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [newCriterion, setNewCriterion] = useState('');

  if (!requirement) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">需求不存在</p>
          <button
            onClick={() => navigate('/requirements')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
          >
            返回需求列表
          </button>
        </div>
      </div>
    );
  }

  const statuses: RequirementStatus[] = [
    'draft',
    'analysis',
    'planning',
    'developing',
    'testing',
    'deployed',
    'archived',
  ];

  const handleStatusChange = (status: RequirementStatus) => {
    updateRequirementStatus(requirement.id, status);
    setShowStatusDropdown(false);
  };

  const handleAddCriterion = () => {
    if (!newCriterion.trim()) return;
    addAcceptanceCriterion(requirement.id, {
      description: newCriterion.trim(),
      testable: true,
      status: 'pending',
    });
    setNewCriterion('');
  };

  const toggleCriterionStatus = (criterion: AcceptanceCriterion) => {
    const nextStatus: AcceptanceCriterion['status'] =
      criterion.status === 'pending' ? 'pass' : criterion.status === 'pass' ? 'fail' : 'pending';
    updateAcceptanceCriterion(requirement.id, criterion.id, { status: nextStatus });
  };

  const passedCriteria = requirement.acceptanceCriteria.filter((c) => c.status === 'pass').length;
  const totalCriteria = requirement.acceptanceCriteria.length;
  const progressPercent = totalCriteria > 0 ? (passedCriteria / totalCriteria) * 100 : 0;

  const scoreDimensions = [
    {
      label: '用户价值',
      value: requirement.score.userValue,
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      barColor: 'bg-blue-500',
    },
    {
      label: '实现成本',
      value: requirement.score.implementationCost,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      barColor: 'bg-orange-500',
    },
    {
      label: '战略对齐',
      value: requirement.score.strategicAlignment,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      barColor: 'bg-green-500',
    },
    {
      label: '紧急程度',
      value: requirement.score.urgency,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      barColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/requirements')}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        返回需求列表
      </button>

      <div className="mb-6 flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-mono text-sm text-gray-400">{requirement.id}</span>
            <SourceBadge source={requirement.source} />
            <PriorityBadge priority={requirement.priority} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{requirement.title}</h1>
          <p className="text-sm text-gray-600">{requirement.description}</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <StatusBadge status={requirement.status} />
              {showStatusDropdown ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                      requirement.status === status
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <StatusBadge status={status} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-3 text-white">
            <div className="text-xs opacity-80">综合评分</div>
            <div className="text-2xl font-bold">{requirement.score.finalScore}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <User className="h-5 w-5 text-blue-500" />
                用户故事
              </h2>
              <button
                onClick={() => setEditingUserStory(!editingUserStory)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {editingUserStory ? '完成' : '编辑'}
              </button>
            </div>

            {editingUserStory ? (
              <UserStoryEditor initialStory={requirement.userStory} requirementId={requirement.id} />
            ) : (
              <div className="space-y-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    作
                  </span>
                  <div>
                    <p className="text-xs font-medium text-blue-600">作为一个</p>
                    <p className="text-sm font-medium text-gray-900">
                      {requirement.userStory.asA}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                    我
                  </span>
                  <div>
                    <p className="text-xs font-medium text-indigo-600">我想要</p>
                    <p className="text-sm font-medium text-gray-900">
                      {requirement.userStory.iWant}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                    以
                  </span>
                  <div>
                    <p className="text-xs font-medium text-purple-600">以便于</p>
                    <p className="text-sm font-medium text-gray-900">
                      {requirement.userStory.soThat}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  验收标准
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  所有验收标准必须具备可测试性和无歧义性
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {passedCriteria} / {totalCriteria} 通过
                </div>
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {requirement.acceptanceCriteria.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-sm text-gray-500">暂无验收标准</p>
                  <p className="mt-1 text-xs text-gray-400">添加明确、可测试的验收标准</p>
                </div>
              ) : (
                requirement.acceptanceCriteria.map((criterion, index) => (
                  <div
                    key={criterion.id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                      criterion.status === 'pass'
                        ? 'border-green-200 bg-green-50'
                        : criterion.status === 'fail'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                    )}
                  >
                    <button
                      onClick={() => toggleCriterionStatus(criterion)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {criterion.status === 'pass' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : criterion.status === 'fail' ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400">
                          AC-{index + 1}
                        </span>
                        {criterion.testable && (
                          <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                            可测试
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          'text-sm',
                          criterion.status === 'pass'
                            ? 'text-green-700 line-through'
                            : criterion.status === 'fail'
                              ? 'text-red-700'
                              : 'text-gray-700'
                        )}
                      >
                        {criterion.description}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAcceptanceCriterion(requirement.id, criterion.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="添加新的验收标准（明确、可测试、无歧义）..."
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCriterion()}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  onClick={handleAddCriterion}
                  disabled={!newCriterion.trim()}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  添加
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                提示：好的验收标准应该是具体的、可验证的，避免使用「快速」「友好」「美观」等模糊词汇
              </p>
            </div>
          </div>

          {dependencies.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <GitBranch className="h-5 w-5 text-purple-500" />
                依赖与关联
              </h2>
              <div className="space-y-2">
                {dependencies.map((dep) => {
                  const isFrom = dep.fromRequirementId === requirement.id;
                  const otherId = isFrom ? dep.toRequirementId : dep.fromRequirementId;
                  const otherReq = getRequirementById(otherId);
                  return (
                    <div
                      key={dep.id}
                      onClick={() => navigate(`/requirements/${otherId}`)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                    >
                      <DependencyBadge type={dep.type} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {otherReq?.title || otherId}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isFrom ? '此需求 → 对方需求' : '对方需求 → 此需求'}
                          {dep.description && ` · ${dep.description}`}
                        </p>
                      </div>
                      {otherReq && <StatusBadge status={otherReq.status} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              优先级评分
            </h2>

            <div className="mb-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-center text-white">
              <div className="text-sm opacity-80">综合得分</div>
              <div className="text-3xl font-bold">{requirement.score.finalScore}</div>
            </div>

            <div className="space-y-3">
              {scoreDimensions.map((dim) => (
                <div key={dim.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn('rounded p-1', dim.bgColor)}>
                        <dim.icon className={cn('h-3 w-3', dim.color)} />
                      </div>
                      <span className="text-gray-600">{dim.label}</span>
                    </div>
                    <span className="font-medium text-gray-900">{dim.value} / 10</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn('h-full rounded-full transition-all', dim.barColor)}
                      style={{ width: `${dim.value * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">
                评分公式：(用户价值×0.3 + 战略对齐×0.3 + 紧急度×0.2) / 实现成本×0.2
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">基本信息</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">状态</span>
                <StatusBadge status={requirement.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">优先级</span>
                <PriorityBadge priority={requirement.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">来源</span>
                <span className="text-gray-700">{SOURCE_LABELS[requirement.source]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">负责人</span>
                <div className="flex items-center gap-1 text-gray-700">
                  <User className="h-3.5 w-3.5" />
                  {requirement.assignee || '未分配'}
                </div>
              </div>
              {requirement.estimatedDays && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">预估工期</span>
                  <div className="flex items-center gap-1 text-gray-700">
                    <Clock className="h-3.5 w-3.5" />
                    {requirement.estimatedDays} 天
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">创建时间</span>
                <div className="flex items-center gap-1 text-gray-700">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(requirement.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">更新时间</span>
                <div className="flex items-center gap-1 text-gray-700">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(requirement.updatedAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
          </div>

          {requirement.tags.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Tag className="h-5 w-5 text-blue-500" />
                标签
              </h2>
              <div className="flex flex-wrap gap-2">
                {requirement.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>
          )}

          {requirement.conflicts.length > 0 && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                潜在冲突
              </h2>
              <p className="mb-3 text-sm text-orange-700">
                此需求与 {requirement.conflicts.length} 个需求存在潜在冲突
              </p>
              <div className="space-y-2">
                {requirement.conflicts.map((conflictId) => {
                  const conflictReq = getRequirementById(conflictId);
                  return (
                    <div
                      key={conflictId}
                      onClick={() => navigate(`/requirements/${conflictId}`)}
                      className="cursor-pointer rounded-lg bg-white p-3 text-sm hover:bg-orange-100"
                    >
                      <p className="font-medium text-gray-900">{conflictReq?.title}</p>
                      <p className="text-xs text-gray-500">{conflictId}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserStoryEditor({
  initialStory,
  requirementId,
}: {
  initialStory: UserStory;
  requirementId: string;
}) {
  const { updateUserStory } = useRequirementStore();
  const [story, setStory] = useState<UserStory>(initialStory);

  const handleChange = (field: keyof UserStory, value: string) => {
    const newStory = { ...story, [field]: value };
    setStory(newStory);
    updateUserStory(requirementId, newStory);
  };

  const fields = [
    { key: 'asA' as const, label: '作为一个', placeholder: '例如：普通用户' },
    { key: 'iWant' as const, label: '我想要', placeholder: '例如：能够使用手机号登录' },
    { key: 'soThat' as const, label: '以便于', placeholder: '例如：我不需要记住密码' },
  ];

  return (
    <div className="space-y-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-1 block text-xs font-medium text-gray-600">{field.label}</label>
          <input
            type="text"
            value={story[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      ))}
    </div>
  );
}
