import { useState } from 'react';
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
} from 'lucide-react';
import { StatusBadge, PriorityBadge, SourceBadge, TagBadge } from '@/components/Badges';
import { STATUS_LABELS, PRIORITY_LABELS } from '@/types';
import type { RequirementStatus, PriorityLevel, Requirement } from '@/types';
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
  } = useRequirementStore();

  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilterPanel, setShowFilterPanel] = useState(true);

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
          onClick={() => {
            /* TODO: 新建需求弹窗 */
          }}
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
    </div>
  );
}
