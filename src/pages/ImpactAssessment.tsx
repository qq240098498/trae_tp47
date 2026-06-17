import { useState, useMemo } from 'react';
import { useRequirementStore } from '@/store/useRequirementStore';
import {
  AlertTriangle,
  Box,
  GitBranch,
  Server,
  CheckSquare,
  Lightbulb,
  Clock,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldAlert,
  FileText,
  Activity,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  ArrowRight,
} from 'lucide-react';
import {
  IMPACT_COMPLEXITY_LABELS,
  IMPACT_COMPLEXITY_COLORS,
  CHANGE_TYPE_LABELS,
  CHANGE_TYPE_COLORS,
  DOWNSTREAM_SYSTEM_TYPE_LABELS,
  TEST_TYPE_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/types';
import { cn } from '@/lib/utils';
import type { ImpactAssessmentResult } from '@/lib/utils';
import type { PriorityLevel, ImpactComplexity, RequirementStatus } from '@/types';

const COMPLEXITY_BG_COLORS: Record<string, string> = {
  low: 'from-green-500 to-emerald-500',
  medium: 'from-yellow-500 to-amber-500',
  high: 'from-orange-500 to-red-500',
  critical: 'from-red-600 to-rose-700',
};

const COMPLEXITY_DOT_COLORS: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-600',
};

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
  PATCH: 'bg-purple-100 text-purple-700',
};

type ViewMode = 'overview' | 'detail';
type DetailMode = 'select' | 'manual';

export default function ImpactAssessment() {
  const { requirements, getImpactAssessment, getImpactAssessmentFromText } = useRequirementStore();

  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [detailMode, setDetailMode] = useState<DetailMode>('select');
  const [selectedReqId, setSelectedReqId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [filterComplexity, setFilterComplexity] = useState<ImpactComplexity[]>([]);
  const [filterRisk, setFilterRisk] = useState<ImpactComplexity[]>([]);
  const [filterStatus, setFilterStatus] = useState<RequirementStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [showAllModules, setShowAllModules] = useState(false);
  const [showAllInterfaces, setShowAllInterfaces] = useState(false);
  const [showAllSystems, setShowAllSystems] = useState(false);
  const [showAllScopes, setShowAllScopes] = useState(false);

  const allAssessments = useMemo(() => {
    return requirements
      .filter((r) => r.status !== 'archived')
      .map((req) => {
        const assessment = getImpactAssessment(req.id);
        return { requirement: req, assessment };
      })
      .filter((item) => item.assessment !== null) as Array<{
      requirement: (typeof requirements)[number];
      assessment: ImpactAssessmentResult;
    }>;
  }, [requirements, getImpactAssessment]);

  const statistics = useMemo(() => {
    const counts: Record<ImpactComplexity, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    const riskCounts: Record<ImpactComplexity, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    let totalDays = 0;
    let totalHours = 0;

    for (const item of allAssessments) {
      counts[item.assessment.overallComplexity]++;
      riskCounts[item.assessment.riskLevel]++;
      totalDays += item.assessment.totalEstimatedDays;
      totalHours += item.assessment.totalRegressionHours;
    }

    return { counts, riskCounts, totalDays, totalHours, total: allAssessments.length };
  }, [allAssessments]);

  const filteredAssessments = useMemo(() => {
    return allAssessments.filter(({ requirement, assessment }) => {
      if (filterComplexity.length > 0 && !filterComplexity.includes(assessment.overallComplexity)) return false;
      if (filterRisk.length > 0 && !filterRisk.includes(assessment.riskLevel)) return false;
      if (filterStatus.length > 0 && !filterStatus.includes(requirement.status)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !requirement.title.toLowerCase().includes(q) &&
          !requirement.description.toLowerCase().includes(q) &&
          !requirement.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [allAssessments, filterComplexity, filterRisk, filterStatus, searchQuery]);

  const sortedAssessments = useMemo(() => {
    const complexityOrder: Record<ImpactComplexity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...filteredAssessments].sort((a, b) => {
      const ca = complexityOrder[a.assessment.overallComplexity];
      const cb = complexityOrder[b.assessment.overallComplexity];
      if (ca !== cb) return ca - cb;
      return b.assessment.totalEstimatedDays - a.assessment.totalEstimatedDays;
    });
  }, [filteredAssessments]);

  const assessment = useMemo((): ImpactAssessmentResult | null => {
    if (viewMode !== 'detail') return null;
    if (detailMode === 'select' && selectedReqId) {
      return getImpactAssessment(selectedReqId);
    }
    if (detailMode === 'manual' && title.trim() && description.trim()) {
      return getImpactAssessmentFromText(title, description);
    }
    return null;
  }, [viewMode, detailMode, selectedReqId, title, description, getImpactAssessment, getImpactAssessmentFromText]);

  const displayedModules = showAllModules
    ? assessment?.affectedModules || []
    : (assessment?.affectedModules || []).slice(0, 5);

  const displayedInterfaces = showAllInterfaces
    ? assessment?.affectedInterfaces || []
    : (assessment?.affectedInterfaces || []).slice(0, 5);

  const displayedSystems = showAllSystems
    ? assessment?.downstreamSystems || []
    : (assessment?.downstreamSystems || []).slice(0, 5);

  const displayedScopes = showAllScopes
    ? assessment?.regressionScopes || []
    : (assessment?.regressionScopes || []).slice(0, 5);

  const selectedReq = requirements.find((r) => r.id === selectedReqId);

  const complexityOptions: Array<{ value: ImpactComplexity; label: string }> = [
    { value: 'critical', label: '极高' },
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' },
  ];

  const statusOptions: Array<{ value: RequirementStatus; label: string }> = [
    { value: 'draft', label: STATUS_LABELS.draft },
    { value: 'analysis', label: STATUS_LABELS.analysis },
    { value: 'planning', label: STATUS_LABELS.planning },
    { value: 'developing', label: STATUS_LABELS.developing },
    { value: 'testing', label: STATUS_LABELS.testing },
    { value: 'deployed', label: STATUS_LABELS.deployed },
  ];

  const openDetail = (reqId: string) => {
    setSelectedReqId(reqId);
    setDetailMode('select');
    setViewMode('detail');
  };

  const clearFilters = () => {
    setFilterComplexity([]);
    setFilterRisk([]);
    setFilterStatus([]);
    setSearchQuery('');
  };

  const hasActiveFilters =
    filterComplexity.length > 0 ||
    filterRisk.length > 0 ||
    filterStatus.length > 0 ||
    searchQuery !== '';

  const toggleArrayFilter = <T,>(arr: T[], item: T): T[] => {
    return arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];
  };

  const getDropdownLabel = (selected: string[], allOptions: Array<{ value: string; label: string }>, placeholder: string) => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) {
      const opt = allOptions.find((o) => o.value === selected[0]);
      return opt ? opt.label : placeholder;
    }
    return `已选 ${selected.length} 项`;
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">影响面评估</h1>
          <p className="text-sm text-gray-600">
            系统分析需求对现有功能模块的波及范围，帮助技术负责人评估真实开发成本
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('overview')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            概览
          </button>
          <button
            onClick={() => setViewMode('detail')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'detail' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Activity className="h-4 w-4" />
            详细分析
          </button>
        </div>
      </div>

      {viewMode === 'overview' && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">需求总数</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">{statistics.total}</div>
            </div>
            {(['critical', 'high', 'medium', 'low'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilterComplexity(toggleArrayFilter(filterComplexity, level))}
                className={cn(
                  'rounded-xl border p-4 text-left shadow-sm transition-all',
                  filterComplexity.includes(level)
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', COMPLEXITY_DOT_COLORS[level])} />
                  <span className="text-xs text-gray-500">{IMPACT_COMPLEXITY_LABELS[level]}复杂度</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900">{statistics.counts[level]}</div>
              </button>
            ))}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
              <div className="text-xs text-gray-500">预估总工日</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {Math.round(statistics.totalDays)}
                <span className="ml-1 text-sm font-normal text-gray-500">天</span>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索需求标题、描述或标签..."
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  showFilters || hasActiveFilters
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                筛选
                {hasActiveFilters && (
                  <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
                    {filterComplexity.length + filterRisk.length + filterStatus.length + (searchQuery ? 1 : 0)}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                  清除筛选
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-4 flex flex-wrap items-start gap-3 border-t border-gray-100 pt-4">
                <MultiSelectDropdown
                  id="complexity"
                  label={getDropdownLabel(filterComplexity, complexityOptions as Array<{ value: string; label: string }>, '整体复杂度')}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  hasSelection={filterComplexity.length > 0}
                >
                  {complexityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilterComplexity(toggleArrayFilter(filterComplexity, opt.value))}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border',
                          filterComplexity.includes(opt.value)
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 bg-white'
                        )}
                      >
                        {filterComplexity.includes(opt.value) && (
                          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={cn('h-2 w-2 rounded-full', COMPLEXITY_DOT_COLORS[opt.value])} />
                      <span className="text-gray-700">{opt.label}</span>
                      <span className="ml-auto text-xs text-gray-400">{statistics.counts[opt.value]}</span>
                    </button>
                  ))}
                  {filterComplexity.length > 0 && (
                    <button
                      onClick={() => setFilterComplexity([])}
                      className="w-full border-t border-gray-100 px-3 py-2 text-center text-xs text-gray-500 hover:text-gray-700"
                    >
                      清除选择
                    </button>
                  )}
                </MultiSelectDropdown>

                <MultiSelectDropdown
                  id="risk"
                  label={getDropdownLabel(filterRisk, complexityOptions as Array<{ value: string; label: string }>, '风险等级')}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  hasSelection={filterRisk.length > 0}
                >
                  {complexityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilterRisk(toggleArrayFilter(filterRisk, opt.value))}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border',
                          filterRisk.includes(opt.value)
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 bg-white'
                        )}
                      >
                        {filterRisk.includes(opt.value) && (
                          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={cn('h-2 w-2 rounded-full', COMPLEXITY_DOT_COLORS[opt.value])} />
                      <span className="text-gray-700">{opt.label}</span>
                      <span className="ml-auto text-xs text-gray-400">{statistics.riskCounts[opt.value]}</span>
                    </button>
                  ))}
                  {filterRisk.length > 0 && (
                    <button
                      onClick={() => setFilterRisk([])}
                      className="w-full border-t border-gray-100 px-3 py-2 text-center text-xs text-gray-500 hover:text-gray-700"
                    >
                      清除选择
                    </button>
                  )}
                </MultiSelectDropdown>

                <MultiSelectDropdown
                  id="status"
                  label={getDropdownLabel(filterStatus, statusOptions as Array<{ value: string; label: string }>, '需求状态')}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  hasSelection={filterStatus.length > 0}
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilterStatus(toggleArrayFilter(filterStatus, opt.value))}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border',
                          filterStatus.includes(opt.value)
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 bg-white'
                        )}
                      >
                        {filterStatus.includes(opt.value) && (
                          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="text-gray-700">{opt.label}</span>
                    </button>
                  ))}
                  {filterStatus.length > 0 && (
                    <button
                      onClick={() => setFilterStatus([])}
                      className="w-full border-t border-gray-100 px-3 py-2 text-center text-xs text-gray-500 hover:text-gray-700"
                    >
                      清除选择
                    </button>
                  )}
                </MultiSelectDropdown>
              </div>
            )}
          </div>

          <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              共找到 <span className="font-medium text-gray-900">{sortedAssessments.length}</span> 个需求
              {hasActiveFilters && <span>（已筛选）</span>}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <List className="h-3.5 w-3.5" />
              按复杂度从高到低排序
            </span>
          </div>

          {sortedAssessments.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
              <Activity className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">暂无符合条件的需求</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                >
                  清除筛选条件
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedAssessments.map(({ requirement, assessment: a }) => (
                <div
                  key={requirement.id}
                  onClick={() => openDetail(requirement.id)}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-400">{requirement.id}</span>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                            STATUS_COLORS[requirement.status]
                          )}
                        >
                          {STATUS_LABELS[requirement.status]}
                        </span>
                      </div>
                      <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-blue-600">
                        {requirement.title}
                      </h3>
                    </div>
                    <div
                      className={cn(
                        'ml-3 flex-shrink-0 rounded-lg bg-gradient-to-br px-2.5 py-1 text-xs font-bold text-white shadow',
                        COMPLEXITY_BG_COLORS[a.overallComplexity]
                      )}
                    >
                      {IMPACT_COMPLEXITY_LABELS[a.overallComplexity]}
                    </div>
                  </div>

                  <p className="mb-4 line-clamp-2 text-xs text-gray-500">{requirement.description}</p>

                  <div className="mb-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{a.totalEstimatedDays}</div>
                      <div className="text-[10px] text-gray-500">预估天</div>
                    </div>
                    <div className="border-x border-gray-100 text-center">
                      <div className="text-lg font-bold text-gray-900">{a.totalRegressionHours}</div>
                      <div className="text-[10px] text-gray-500">测试时</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={cn(
                          'text-lg font-bold',
                          a.riskLevel === 'critical'
                            ? 'text-red-600'
                            : a.riskLevel === 'high'
                              ? 'text-orange-600'
                              : a.riskLevel === 'medium'
                                ? 'text-yellow-600'
                                : 'text-green-600'
                        )}
                      >
                        {IMPACT_COMPLEXITY_LABELS[a.riskLevel]}
                      </div>
                      <div className="text-[10px] text-gray-500">风险</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {a.affectedModules.slice(0, 3).map((m) => (
                        <span
                          key={m.id}
                          className={cn(
                            'rounded px-1.5 py-0.5 text-[10px] font-medium',
                            IMPACT_COMPLEXITY_COLORS[m.complexity]
                          )}
                        >
                          {m.name.replace('模块', '')}
                        </span>
                      ))}
                      {a.affectedModules.length > 3 && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                          +{a.affectedModules.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                      查看详情
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {a.affectedInterfaces.length > 0 && (
                    <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3 text-[10px] text-gray-400">
                      <GitBranch className="h-3 w-3" />
                      {a.affectedInterfaces.length} 个接口受影响
                      {a.affectedInterfaces.some((i) => i.breakingChange) && (
                        <span className="ml-1 rounded bg-red-100 px-1 text-red-600">含破坏性变更</span>
                      )}
                    </div>
                  )}

                  {a.downstreamSystems.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                      <Server className="h-3 w-3" />
                      {a.downstreamSystems.length} 个下游系统受影响
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {viewMode === 'detail' && (
        <>
          <button
            onClick={() => setViewMode('overview')}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronUp className="h-4 w-4 rotate-90" />
            返回概览
          </button>

          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-4">
              <button
                onClick={() => setDetailMode('select')}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  detailMode === 'select'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <FileText className="h-4 w-4" />
                选择已有需求
              </button>
              <button
                onClick={() => setDetailMode('manual')}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  detailMode === 'manual'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Edit3 className="h-4 w-4" />
                手动输入
              </button>
            </div>

            {detailMode === 'select' ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedReqId}
                  onChange={(e) => setSelectedReqId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">请选择一个需求进行影响面分析...</option>
                  {requirements
                    .filter((r) => r.status !== 'archived')
                    .map((req) => {
                      const a = getImpactAssessment(req.id);
                      return (
                        <option key={req.id} value={req.id}>
                          [{a ? IMPACT_COMPLEXITY_LABELS[a.overallComplexity] : '-'}] {req.id} - {req.title}
                        </option>
                      );
                    })}
                </select>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">需求标题</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入需求标题..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">需求描述</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="详细描述需求内容，以便系统准确分析影响范围..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {detailMode === 'select' && selectedReq && (
              <div className="mt-4 rounded-lg bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-600">{selectedReq.id}</span>
                  <span className="text-sm font-medium text-blue-900">{selectedReq.title}</span>
                </div>
                <p className="text-xs text-blue-700">{selectedReq.description}</p>
              </div>
            )}
          </div>

          {!assessment && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
              <Activity className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">选择需求或输入需求描述</p>
              <p className="mt-2 text-sm text-gray-400">
                系统将自动分析需求对功能模块、接口、下游系统的影响范围
              </p>
            </div>
          )}

          {assessment && (
            <>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                <div
                  className={cn(
                    'rounded-xl bg-gradient-to-br p-6 text-white shadow-lg',
                    COMPLEXITY_BG_COLORS[assessment.overallComplexity]
                  )}
                >
                  <div className="mb-2 flex items-center gap-2 opacity-90">
                    <Zap className="h-5 w-5" />
                    <span className="text-sm font-medium">整体复杂度</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {IMPACT_COMPLEXITY_LABELS[assessment.overallComplexity]}
                  </div>
                  <p className="mt-2 text-xs opacity-80">基于模块数量和变更难度综合评估</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm font-medium">预估开发周期</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {assessment.totalEstimatedDays}
                    <span className="ml-1 text-lg font-normal text-gray-500">天</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">包含所有受影响模块的开发时间</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">回归测试工时</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {assessment.totalRegressionHours}
                    <span className="ml-1 text-lg font-normal text-gray-500">小时</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">覆盖单元、集成、端到端测试</p>
                </div>

                <div
                  className={cn(
                    'rounded-xl border p-6 shadow-sm',
                    assessment.riskLevel === 'critical'
                      ? 'border-red-200 bg-red-50'
                      : assessment.riskLevel === 'high'
                        ? 'border-orange-200 bg-orange-50'
                        : assessment.riskLevel === 'medium'
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-green-200 bg-green-50'
                  )}
                >
                  <div
                    className={cn(
                      'mb-2 flex items-center gap-2',
                      assessment.riskLevel === 'critical'
                        ? 'text-red-700'
                        : assessment.riskLevel === 'high'
                          ? 'text-orange-700'
                          : assessment.riskLevel === 'medium'
                            ? 'text-yellow-700'
                            : 'text-green-700'
                    )}
                  >
                    <ShieldAlert className="h-5 w-5" />
                    <span className="text-sm font-medium">风险等级</span>
                  </div>
                  <div
                    className={cn(
                      'text-3xl font-bold',
                      assessment.riskLevel === 'critical'
                        ? 'text-red-700'
                        : assessment.riskLevel === 'high'
                          ? 'text-orange-700'
                          : assessment.riskLevel === 'medium'
                            ? 'text-yellow-700'
                            : 'text-green-700'
                    )}
                  >
                    {IMPACT_COMPLEXITY_LABELS[assessment.riskLevel]}
                  </div>
                  <p
                    className={cn(
                      'mt-2 text-xs',
                      assessment.riskLevel === 'critical'
                        ? 'text-red-600'
                        : assessment.riskLevel === 'high'
                          ? 'text-orange-600'
                          : assessment.riskLevel === 'medium'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                    )}
                  >
                    综合破坏性变更、下游影响等因素
                  </p>
                </div>
              </div>

              <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-900">
                  <Lightbulb className="h-5 w-5" />
                  评估摘要
                </h3>
                <p className="text-sm text-blue-800">{assessment.summary}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Box className="h-5 w-5 text-blue-500" />
                      受影响模块
                    </h3>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {assessment.affectedModules.length} 个
                    </span>
                  </div>

                  <div className="space-y-3">
                    {displayedModules.map((module) => (
                      <div
                        key={module.id}
                        className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{module.name}</h4>
                            <p className="mt-1 text-xs text-gray-500">{module.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 text-xs font-medium',
                                CHANGE_TYPE_COLORS[module.changeType]
                              )}
                            >
                              {CHANGE_TYPE_LABELS[module.changeType]}
                            </span>
                            <span
                              className={cn(
                                'rounded-full border px-2 py-0.5 text-xs font-medium',
                                IMPACT_COMPLEXITY_COLORS[module.complexity]
                              )}
                            >
                              {IMPACT_COMPLEXITY_LABELS[module.complexity]}复杂度
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {module.relatedKeywords.map((kw) => (
                              <span
                                key={kw}
                                className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {module.estimatedDays} 天
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {assessment.affectedModules.length > 5 && (
                    <button
                      onClick={() => setShowAllModules(!showAllModules)}
                      className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      {showAllModules ? (
                        <>
                          收起 <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          查看全部 {assessment.affectedModules.length} 个模块{' '}
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <GitBranch className="h-5 w-5 text-purple-500" />
                      受影响接口
                    </h3>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                      {assessment.affectedInterfaces.length} 个
                    </span>
                  </div>

                  <div className="space-y-3">
                    {displayedInterfaces.map((iface) => (
                      <div
                        key={iface.id}
                        className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                'rounded px-2 py-0.5 font-mono text-xs font-bold',
                                METHOD_COLORS[iface.method]
                              )}
                            >
                              {iface.method}
                            </span>
                            <span className="font-medium text-gray-900">{iface.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {iface.breakingChange && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                破坏性变更
                              </span>
                            )}
                            <span
                              className={cn(
                                'rounded-full border px-2 py-0.5 text-xs font-medium',
                                IMPACT_COMPLEXITY_COLORS[iface.complexity]
                              )}
                            >
                              {IMPACT_COMPLEXITY_LABELS[iface.complexity]}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <code className="text-xs text-gray-600">{iface.path}</code>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-xs font-medium',
                              CHANGE_TYPE_COLORS[iface.changeType]
                            )}
                          >
                            {CHANGE_TYPE_LABELS[iface.changeType]}
                          </span>
                        </div>
                      </div>
                    ))}

                    {assessment.affectedInterfaces.length === 0 && (
                      <div className="py-8 text-center text-sm text-gray-400">
                        未识别到直接受影响的接口
                      </div>
                    )}
                  </div>

                  {assessment.affectedInterfaces.length > 5 && (
                    <button
                      onClick={() => setShowAllInterfaces(!showAllInterfaces)}
                      className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      {showAllInterfaces ? (
                        <>
                          收起 <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          查看全部 {assessment.affectedInterfaces.length} 个接口{' '}
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Server className="h-5 w-5 text-orange-500" />
                      下游系统影响
                    </h3>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {assessment.downstreamSystems.length} 个
                    </span>
                  </div>

                  <div className="space-y-3">
                    {displayedSystems.map((system) => (
                      <div
                        key={system.id}
                        className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{system.name}</span>
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {DOWNSTREAM_SYSTEM_TYPE_LABELS[system.type]}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'rounded-full border px-2 py-0.5 text-xs font-medium',
                              IMPACT_COMPLEXITY_COLORS[system.impactLevel]
                            )}
                          >
                            {IMPACT_COMPLEXITY_LABELS[system.impactLevel]}影响
                          </span>
                        </div>
                        <p className="mb-2 text-xs text-gray-600">{system.impactDescription}</p>
                        {system.contactTeam && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Users className="h-3 w-3" />
                            对接团队：{system.contactTeam}
                          </div>
                        )}
                      </div>
                    ))}

                    {assessment.downstreamSystems.length === 0 && (
                      <div className="py-8 text-center text-sm text-gray-400">
                        未识别到受影响的下游系统
                      </div>
                    )}
                  </div>

                  {assessment.downstreamSystems.length > 5 && (
                    <button
                      onClick={() => setShowAllSystems(!showAllSystems)}
                      className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      {showAllSystems ? (
                        <>
                          收起 <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          查看全部 {assessment.downstreamSystems.length} 个系统{' '}
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <CheckSquare className="h-5 w-5 text-green-500" />
                      回归测试范围
                    </h3>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {assessment.regressionScopes.length} 项
                    </span>
                  </div>

                  <div className="space-y-3">
                    {displayedScopes.map((scope) => (
                      <div
                        key={scope.id}
                        className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-gray-900">{scope.name}</span>
                          <span
                            className={cn(
                              'rounded px-2 py-0.5 text-xs font-medium text-white',
                              PRIORITY_COLORS[scope.priority as PriorityLevel]
                            )}
                          >
                            {PRIORITY_LABELS[scope.priority as PriorityLevel]}
                          </span>
                        </div>
                        <p className="mb-2 text-xs text-gray-600">{scope.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {TEST_TYPE_LABELS[scope.testType]}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {scope.estimatedHours} 小时
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {assessment.regressionScopes.length > 5 && (
                    <button
                      onClick={() => setShowAllScopes(!showAllScopes)}
                      className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      {showAllScopes ? (
                        <>
                          收起 <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          查看全部 {assessment.regressionScopes.length} 项测试{' '}
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  开发建议
                </h3>
                <div className="space-y-3">
                  {assessment.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg bg-yellow-50 p-4">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm text-yellow-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <div className="text-xs text-gray-500">
                    <p className="font-medium text-gray-700">评估说明</p>
                    <p className="mt-1">
                      本评估基于需求文本的语义分析自动生成，仅供参考。实际开发成本可能因技术方案、团队熟悉度、历史债务等因素而有所不同。
                      建议结合技术评审和详细方案设计进行最终确认。
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Edit3(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function Users(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MultiSelectDropdown({
  id,
  label,
  openDropdown,
  setOpenDropdown,
  hasSelection,
  children,
}: {
  id: string;
  label: string;
  openDropdown: string | null;
  setOpenDropdown: (v: string | null) => void;
  hasSelection: boolean;
  children: React.ReactNode;
}) {
  const isOpen = openDropdown === id;

  return (
    <div className="relative">
      <button
        onClick={() => setOpenDropdown(isOpen ? null : id)}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
          isOpen
            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
            : hasSelection
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
        )}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenDropdown(null)}
          />
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {children}
          </div>
        </>
      )}
    </div>
  );
}
