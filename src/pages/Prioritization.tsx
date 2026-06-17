import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequirementStore } from '@/store/useRequirementStore';
import {
  BarChart3,
  TrendingUp,
  User,
  DollarSign,
  Target,
  Zap,
  Settings,
  GripVertical,
  Info,
  Award,
  ArrowUp,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import { cn } from '@/lib/utils';

export default function Prioritization() {
  const navigate = useNavigate();
  const { getPrioritizedRequirements, updatePriorityScore } = useRequirementStore();
  const requirements = getPrioritizedRequirements();

  const [weights, setWeights] = useState({
    userValue: 0.3,
    implementationCost: 0.2,
    strategicAlignment: 0.3,
    urgency: 0.2,
  });

  const [showWeightPanel, setShowWeightPanel] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    const newWeights = { ...weights, [key]: value };
    const total = Object.values(newWeights).reduce((a, b) => a + b, 0);
    if (total > 0) {
      Object.keys(newWeights).forEach((k) => {
        newWeights[k as keyof typeof weights] =
          Math.round((newWeights[k as keyof typeof weights] / total) * 100) / 100;
      });
    }
    setWeights(newWeights);
  };

  const dimensions = [
    {
      key: 'userValue' as const,
      label: '用户价值',
      description: '需求对用户的价值大小',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      barColor: 'bg-blue-500',
    },
    {
      key: 'implementationCost' as const,
      label: '实现成本',
      description: '开发所需的时间和资源',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      barColor: 'bg-orange-500',
    },
    {
      key: 'strategicAlignment' as const,
      label: '战略对齐',
      description: '与产品战略目标的契合度',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      barColor: 'bg-green-500',
    },
    {
      key: 'urgency' as const,
      label: '紧急程度',
      description: '需求的时间敏感性',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      barColor: 'bg-purple-500',
    },
  ];

  const maxScore = requirements.length > 0 ? requirements[0].score.finalScore : 100;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">优先级排序</h1>
          <p className="mt-1 text-sm text-gray-500">
            基于用户价值、实现成本、战略对齐度和紧急程度综合评估
          </p>
        </div>
        <button
          onClick={() => setShowWeightPanel(!showWeightPanel)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
            showWeightPanel
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          )}
        >
          <Settings className="h-4 w-4" />
          权重设置
        </button>
      </div>

      {showWeightPanel && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Info className="h-4 w-4 text-blue-500" />
            评分维度权重
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dimensions.map((dim) => (
              <div key={dim.key} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className={cn('rounded p-1.5', dim.bgColor)}>
                    <dim.icon className={cn('h-4 w-4', dim.color)} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{dim.label}</span>
                </div>
                <p className="mb-3 text-xs text-gray-500">{dim.description}</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights[dim.key]}
                    onChange={(e) => handleWeightChange(dim.key, parseFloat(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="w-10 text-right text-sm font-medium text-gray-900">
                    {Math.round(weights[dim.key] * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            提示：调整权重后，综合评分会自动重新计算。当前权重总和：
            {Math.round(Object.values(weights).reduce((a, b) => a + b, 0) * 100)}%
          </p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">需求总数</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{requirements.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">最高评分</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{maxScore}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600">平均评分</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {requirements.length > 0
              ? Math.round(
                  requirements.reduce((sum, r) => sum + r.score.finalScore, 0) /
                    requirements.length
                )
              : 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">优先级排序列表</h2>
          <p className="mt-1 text-xs text-gray-500">
            点击需求卡片可查看详情，或调整各维度评分
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {requirements.map((req, index) => (
            <div
              key={req.id}
              className={cn(
                'p-6 transition-colors',
                selectedReqId === req.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold',
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md'
                      : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                        : index === 2
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                          : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">{req.id}</span>
                    <StatusBadge status={req.status} />
                    <PriorityBadge priority={req.priority} />
                  </div>

                  <h3
                    onClick={() => navigate(`/requirements/${req.id}`)}
                    className="mb-2 cursor-pointer text-base font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {req.title}
                  </h3>

                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex flex-1 items-center gap-3">
                      <span className="text-sm font-bold text-blue-600">
                        {req.score.finalScore} 分
                      </span>
                      <div className="flex-1 h-2 max-w-xs overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          style={{ width: `${(req.score.finalScore / maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {dimensions.map((dim) => (
                      <div
                        key={dim.key}
                        onClick={() => setSelectedReqId(selectedReqId === req.id ? null : req.id)}
                        className="cursor-pointer rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors hover:border-gray-200 hover:bg-white"
                      >
                        <div className="mb-1 flex items-center gap-1.5">
                          <dim.icon className={cn('h-3 w-3', dim.color)} />
                          <span className="text-xs text-gray-600">{dim.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {req.score[dim.key]}
                          </span>
                          <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={cn('h-full rounded-full', dim.barColor)}
                              style={{ width: `${req.score[dim.key] * 10}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedReqId === req.id && (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h4 className="mb-3 text-sm font-medium text-blue-900">
                        调整评分（1-10）
                      </h4>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {dimensions.map((dim) => (
                          <div key={dim.key}>
                            <label className="mb-1 block text-xs text-gray-600">
                              {dim.label}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={req.score[dim.key]}
                              onChange={(e) => {
                                const newScore = {
                                  userValue: req.score.userValue,
                                  implementationCost: req.score.implementationCost,
                                  strategicAlignment: req.score.strategicAlignment,
                                  urgency: req.score.urgency,
                                  [dim.key]: parseInt(e.target.value),
                                };
                                updatePriorityScore(req.id, newScore);
                              }}
                              className="w-full accent-blue-600"
                            />
                            <div className="text-center text-sm font-medium text-gray-700">
                              {req.score[dim.key]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
          <Info className="h-5 w-5 text-blue-500" />
          评分模型说明
        </h3>
        <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">用户价值</span>
            </div>
            <p className="text-xs text-blue-700">
              评估需求对用户的价值，包括使用频率、影响用户数、用户满意度提升等
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-900">实现成本</span>
            </div>
            <p className="text-xs text-orange-700">
              评估开发工作量，包括设计、开发、测试、上线所需的人力和时间
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">战略对齐</span>
            </div>
            <p className="text-xs text-green-700">
              评估需求与产品战略目标的契合程度，是否有助于长期目标的达成
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-900">紧急程度</span>
            </div>
            <p className="text-xs text-purple-700">
              评估需求的时间敏感性，延迟交付会造成多大影响
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
