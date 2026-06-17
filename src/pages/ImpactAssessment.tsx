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
  ArrowRight,
  Layers,
  Activity,
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
} from '@/types';
import { cn } from '@/lib/utils';
import type { ImpactAssessmentResult } from '@/lib/utils';
import type { PriorityLevel } from '@/types';

const COMPLEXITY_BG_COLORS: Record<string, string> = {
  low: 'from-green-500 to-emerald-500',
  medium: 'from-yellow-500 to-amber-500',
  high: 'from-orange-500 to-red-500',
  critical: 'from-red-600 to-rose-700',
};

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
  PATCH: 'bg-purple-100 text-purple-700',
};

export default function ImpactAssessment() {
  const { requirements, getImpactAssessment, getImpactAssessmentFromText } = useRequirementStore();
  const [mode, setMode] = useState<'select' | 'manual'>('select');
  const [selectedReqId, setSelectedReqId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAllModules, setShowAllModules] = useState(false);
  const [showAllInterfaces, setShowAllInterfaces] = useState(false);
  const [showAllSystems, setShowAllSystems] = useState(false);
  const [showAllScopes, setShowAllScopes] = useState(false);

  const assessment = useMemo((): ImpactAssessmentResult | null => {
    if (mode === 'select' && selectedReqId) {
      return getImpactAssessment(selectedReqId);
    }
    if (mode === 'manual' && title.trim() && description.trim()) {
      return getImpactAssessmentFromText(title, description);
    }
    return null;
  }, [mode, selectedReqId, title, description, getImpactAssessment, getImpactAssessmentFromText]);

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">影响面评估</h1>
        <p className="text-sm text-gray-600">
          系统分析需求对现有功能模块的波及范围，帮助技术负责人评估真实开发成本
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={() => setMode('select')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              mode === 'select'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <FileText className="h-4 w-4" />
            选择已有需求
          </button>
          <button
            onClick={() => setMode('manual')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              mode === 'manual'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Edit3 className="h-4 w-4" />
            手动输入
          </button>
        </div>

        {mode === 'select' ? (
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
                .map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.id} - {req.title}
                  </option>
                ))}
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

        {mode === 'select' && selectedReq && (
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
                      查看全部 {assessment.affectedModules.length} 个模块 <ChevronDown className="h-4 w-4" />
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
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-yellow-50 p-4"
                >
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
