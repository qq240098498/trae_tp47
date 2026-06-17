import { useRequirementStore } from '@/store/useRequirementStore';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  GitBranch,
  Zap,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import { STATUS_LABELS } from '@/types';
import type { RequirementStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getStatistics, getPrioritizedRequirements, requirements } = useRequirementStore();
  const stats = getStatistics();
  const topRequirements = getPrioritizedRequirements().slice(0, 5);

  const statusOrder: RequirementStatus[] = [
    'draft',
    'analysis',
    'planning',
    'developing',
    'testing',
    'deployed',
  ];

  const statCards = [
    {
      label: '总需求数',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: '已上线',
      value: stats.byStatus.deployed,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: '进行中',
      value: stats.byStatus.developing + stats.byStatus.testing,
      icon: Clock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: '存在冲突',
      value: stats.hasConflicts,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const recentRequirements = [...requirements]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
        <p className="mt-1 text-sm text-gray-500">查看需求管理全局概览</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`rounded-lg ${card.bgColor} p-3`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">状态分布</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {statusOrder.map((status) => {
              const count = stats.byStatus[status];
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{STATUS_LABELS[status]}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">优先级分布</h2>
            <Zap className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(['critical', 'high', 'medium', 'low'] as const).map((priority) => (
              <div
                key={priority}
                className="flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <PriorityBadge priority={priority} className="mb-2" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.byPriority[priority]}
                </span>
                <span className="text-xs text-gray-500">条需求</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">平均优先级评分</p>
                <p className="text-xl font-bold text-gray-900">{stats.avgScore}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">最高优先级需求</h2>
            <button
              onClick={() => navigate('/prioritization')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 →
            </button>
          </div>
          <div className="space-y-3">
            {topRequirements.map((req, index) => (
              <div
                key={req.id}
                onClick={() => navigate(`/requirements/${req.id}`)}
                className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : index === 1
                        ? 'bg-gray-100 text-gray-600'
                        : index === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{req.title}</p>
                  <p className="text-xs text-gray-500">
                    评分：{req.score.finalScore} · {req.id}
                  </p>
                </div>
                <PriorityBadge priority={req.priority} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">最近更新</h2>
            <button
              onClick={() => navigate('/requirements')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 →
            </button>
          </div>
          <div className="space-y-3">
            {recentRequirements.map((req) => (
              <div
                key={req.id}
                onClick={() => navigate(`/requirements/${req.id}`)}
                className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{req.title}</p>
                  <p className="text-xs text-gray-500">
                    {req.id} · {new Date(req.updatedAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">依赖与冲突概览</h2>
          <button
            onClick={() => navigate('/dependencies')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            查看详情 →
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <GitBranch className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">有依赖关系</p>
              <p className="text-xl font-bold text-gray-900">{stats.hasDependencies}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="rounded-lg bg-orange-100 p-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">存在冲突</p>
              <p className="text-xl font-bold text-gray-900">{stats.hasConflicts}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">无依赖独立需求</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.total - stats.hasDependencies}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
