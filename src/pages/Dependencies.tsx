import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequirementStore } from '@/store/useRequirementStore';
import {
  GitBranch,
  AlertTriangle,
  Link2,
  XCircle,
  ArrowRight,
  Filter,
  Info,
  Zap,
} from 'lucide-react';
import { StatusBadge, PriorityBadge, DependencyBadge } from '@/components/Badges';
import { cn } from '@/lib/utils';
import type { Dependency, Requirement } from '@/types';

type FilterType = 'all' | 'depends_on' | 'blocks' | 'conflicts' | 'related';

export default function Dependencies() {
  const navigate = useNavigate();
  const { requirements, dependencies, getRequirementById } = useRequirementStore();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);

  const filteredDependencies = dependencies.filter((dep) => {
    if (filterType === 'all') return true;
    return dep.type === filterType;
  });

  const conflictDeps = dependencies.filter((d) => d.type === 'conflicts');
  const dependsOnDeps = dependencies.filter((d) => d.type === 'depends_on');
  const blocksDeps = dependencies.filter((d) => d.type === 'blocks');

  const hasDependencies = requirements.filter(
    (r) => r.dependencies.length > 0 || r.dependents.length > 0
  );
  const hasConflicts = requirements.filter((r) => r.conflicts.length > 0);

  const selectedReq = selectedRequirementId ? getRequirementById(selectedRequirementId) : null;
  const relatedDeps = selectedRequirementId
    ? dependencies.filter(
        (d) =>
          d.fromRequirementId === selectedRequirementId ||
          d.toRequirementId === selectedRequirementId
      )
    : [];

  const filterTabs = [
    { key: 'all' as const, label: '全部', count: dependencies.length },
    { key: 'depends_on' as const, label: '依赖', count: dependsOnDeps.length },
    { key: 'blocks' as const, label: '阻塞', count: blocksDeps.length },
    { key: 'conflicts' as const, label: '冲突', count: conflictDeps.length },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">依赖与冲突</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理需求间的依赖关系，识别潜在冲突，确保需求规划的合理性
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">依赖关系总数</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{dependencies.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Link2 className="h-5 w-5 text-indigo-500" />
            <span className="text-sm text-gray-600">有依赖的需求</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{hasDependencies.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span className="text-sm text-gray-600">存在冲突</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{hasConflicts.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">独立需求</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {requirements.length - hasDependencies.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">依赖关系列表</h2>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                    {filterTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setFilterType(tab.key)}
                        className={cn(
                          'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                          filterType === tab.key
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredDependencies.length === 0 ? (
                <div className="p-12 text-center">
                  <GitBranch className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">暂无依赖关系</p>
                  <p className="mt-1 text-xs text-gray-400">
                    为需求添加依赖关系以更好地管理项目进度
                  </p>
                </div>
              ) : (
                filteredDependencies.map((dep) => (
                  <DependencyItem
                    key={dep.id}
                    dep={dep}
                    getRequirementById={getRequirementById}
                    onNavigate={(id) => navigate(`/requirements/${id}`)}
                    onSelect={(id) => setSelectedRequirementId(id)}
                    isSelected={
                      selectedRequirementId === dep.fromRequirementId ||
                      selectedRequirementId === dep.toRequirementId
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {selectedReq ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
                <Info className="h-4 w-4" />
                选中需求详情
              </h3>
              <div
                onClick={() => navigate(`/requirements/${selectedReq.id}`)}
                className="mb-3 cursor-pointer rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50"
              >
                <p className="text-sm font-semibold text-gray-900">{selectedReq.title}</p>
                <p className="mt-1 text-xs text-gray-500">{selectedReq.id}</p>
                <div className="mt-2 flex gap-2">
                  <StatusBadge status={selectedReq.status} />
                  <PriorityBadge priority={selectedReq.priority} />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">依赖项</span>
                  <span className="font-medium text-blue-900">
                    {selectedReq.dependencies.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">被依赖</span>
                  <span className="font-medium text-blue-900">
                    {selectedReq.dependents.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">冲突项</span>
                  <span className="font-medium text-blue-900">
                    {selectedReq.conflicts.length}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequirementId(null)}
                className="mt-3 w-full text-xs text-blue-600 hover:text-blue-800"
              >
                清除选择
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <GitBranch className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">点击依赖关系中的需求</p>
              <p className="text-xs text-gray-400">查看该需求的所有关联关系</p>
            </div>
          )}

          {conflictDeps.length > 0 && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-orange-800">
                <AlertTriangle className="h-4 w-4" />
                潜在冲突警告
              </h3>
              <p className="mb-3 text-xs text-orange-700">
                以下需求之间存在潜在冲突，需要仔细评估
              </p>
              <div className="space-y-2">
                {conflictDeps.map((dep) => {
                  const fromReq = getRequirementById(dep.fromRequirementId);
                  const toReq = getRequirementById(dep.toRequirementId);
                  return (
                    <div
                      key={dep.id}
                      className="rounded-lg bg-white p-3 text-xs shadow-sm"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span className="font-medium text-gray-900">需求冲突</span>
                      </div>
                      <p className="mb-2 text-gray-600">{dep.description}</p>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() =>
                            navigate(`/requirements/${dep.fromRequirementId}`)
                          }
                          className="cursor-pointer truncate text-blue-600 hover:underline"
                        >
                          {fromReq?.title}
                        </span>
                        <ArrowRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
                        <span
                          onClick={() => navigate(`/requirements/${dep.toRequirementId}`)}
                          className="cursor-pointer truncate text-blue-600 hover:underline"
                        >
                          {toReq?.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">依赖关系类型</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <DependencyBadge type="depends_on" />
                <p className="text-xs text-gray-600">
                  一个需求的完成依赖于另一个需求的交付
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DependencyBadge type="blocks" />
                <p className="text-xs text-gray-600">
                  一个需求的进行会阻塞另一个需求的开发
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DependencyBadge type="conflicts" />
                <p className="text-xs text-gray-600">
                  两个需求在技术或设计上存在冲突
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DependencyBadge type="related" />
                <p className="text-xs text-gray-600">
                  需求间有相关性，但没有严格的依赖关系
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DependencyItemProps {
  dep: Dependency;
  getRequirementById: (id: string) => Requirement | undefined;
  onNavigate: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

function DependencyItem({
  dep,
  getRequirementById,
  onNavigate,
  onSelect,
  isSelected,
}: DependencyItemProps) {
  const fromReq = getRequirementById(dep.fromRequirementId);
  const toReq = getRequirementById(dep.toRequirementId);

  return (
    <div
      className={cn(
        'p-4 transition-colors',
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          onClick={() => onSelect(dep.fromRequirementId)}
          className="flex-1 cursor-pointer min-w-0"
        >
          <p className="truncate text-sm font-medium text-gray-900">{fromReq?.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-400">{fromReq?.id}</span>
            <StatusBadge status={fromReq?.status || 'draft'} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 px-2">
          <DependencyBadge type={dep.type} />
          <ArrowRight className="h-4 w-4 text-gray-300" />
        </div>

        <div
          onClick={() => onSelect(dep.toRequirementId)}
          className="flex-1 cursor-pointer min-w-0"
        >
          <p className="truncate text-sm font-medium text-gray-900">{toReq?.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-400">{toReq?.id}</span>
            <StatusBadge status={toReq?.status || 'draft'} />
          </div>
        </div>

        <button
          onClick={() => onNavigate(dep.fromRequirementId)}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          查看详情
        </button>
      </div>
      {dep.description && (
        <p className="mt-2 text-xs text-gray-500">说明：{dep.description}</p>
      )}
    </div>
  );
}
