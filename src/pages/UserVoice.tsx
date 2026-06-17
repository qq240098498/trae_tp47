import { useState, useMemo } from 'react';
import { useRequirementStore } from '@/store/useRequirementStore';
import {
  MessageSquare,
  TrendingUp,
  Search,
  Users,
  Megaphone,
  AlertCircle,
  Flame,
  ChevronDown,
  ChevronUp,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Minus as MinusIcon,
  Link as LinkIcon,
  Quote,
  SlidersHorizontal,
} from 'lucide-react';
import {
  FEEDBACK_CHANNEL_LABELS,
  FEEDBACK_CHANNEL_COLORS,
  SENTIMENT_LABELS,
} from '@/types';
import { cn } from '@/lib/utils';
import type { FeedbackChannel, UserVoiceDemand } from '@/types';
import { useNavigate } from 'react-router-dom';

type SortBy = 'heat' | 'mentions' | 'negative' | 'trend';

const TREND_ICONS = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  stable: MinusIcon,
};

const TREND_COLORS = {
  up: 'text-green-600',
  down: 'text-red-600',
  stable: 'text-gray-500',
};

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: 'heat', label: '热度评分' },
  { value: 'mentions', label: '提及次数' },
  { value: 'negative', label: '负面情绪' },
  { value: 'trend', label: '趋势变化' },
];

const CHANNEL_OPTIONS: Array<{ value: FeedbackChannel; label: string; icon: typeof MessageSquare }> = [
  { value: 'customer_service', label: FEEDBACK_CHANNEL_LABELS.customer_service, icon: Megaphone },
  { value: 'app_store', label: FEEDBACK_CHANNEL_LABELS.app_store, icon: MessageSquare },
  { value: 'social_media', label: FEEDBACK_CHANNEL_LABELS.social_media, icon: Users },
  { value: 'user_interview', label: FEEDBACK_CHANNEL_LABELS.user_interview, icon: Quote },
];

export default function UserVoice() {
  const navigate = useNavigate();
  const {
    getUserVoiceDemands,
    getUserVoiceStatistics,
    userVoiceSearchQuery,
    setUserVoiceSearchQuery,
    userVoiceFilterChannels,
    toggleUserVoiceChannelFilter,
    userVoiceSortBy,
    setUserVoiceSortBy,
    getRequirementById,
  } = useRequirementStore();

  const [expandedDemandId, setExpandedDemandId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const statistics = useMemo(() => getUserVoiceStatistics(), [getUserVoiceStatistics]);
  const demands = useMemo(() => getUserVoiceDemands(), [getUserVoiceDemands]);

  const negativeRate = (demand: UserVoiceDemand) => {
    const total = demand.sentimentBreakdown.positive + demand.sentimentBreakdown.neutral + demand.sentimentBreakdown.negative;
    return total > 0 ? Math.round((demand.sentimentBreakdown.negative / total) * 100) : 0;
  };

  const positiveRate = (demand: UserVoiceDemand) => {
    const total = demand.sentimentBreakdown.positive + demand.sentimentBreakdown.neutral + demand.sentimentBreakdown.negative;
    return total > 0 ? Math.round((demand.sentimentBreakdown.positive / total) * 100) : 0;
  };

  const toggleExpand = (id: string) => {
    setExpandedDemandId(expandedDemandId === id ? null : id);
  };

  const clearFilters = () => {
    setUserVoiceSearchQuery('');
    userVoiceFilterChannels.forEach((c) => toggleUserVoiceChannelFilter(c));
  };

  const hasActiveFilters = userVoiceFilterChannels.length > 0 || userVoiceSearchQuery !== '';

  const getSentimentBarData = (demand: UserVoiceDemand) => {
    const total = demand.sentimentBreakdown.positive + demand.sentimentBreakdown.neutral + demand.sentimentBreakdown.negative;
    return [
      { key: 'positive' as const, value: demand.sentimentBreakdown.positive, percent: total > 0 ? (demand.sentimentBreakdown.positive / total) * 100 : 0 },
      { key: 'neutral' as const, value: demand.sentimentBreakdown.neutral, percent: total > 0 ? (demand.sentimentBreakdown.neutral / total) * 100 : 0 },
      { key: 'negative' as const, value: demand.sentimentBreakdown.negative, percent: total > 0 ? (demand.sentimentBreakdown.negative / total) * 100 : 0 },
    ];
  };

  const channelTotal = Object.values(statistics.channelsDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">用户之声</h1>
          <p className="text-sm text-gray-600">
            系统从多渠道用户反馈中自动提炼共性诉求，量化出现频次和情绪强度，为优先级决策提供数据支撑
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <MessageSquare className="h-3.5 w-3.5" />
            反馈总量
          </div>
          <div className="text-2xl font-bold text-gray-900">{statistics.totalFeedbacks.toLocaleString()}</div>
          <div className="mt-1 text-xs text-gray-400">近30天收集</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <Flame className="h-3.5 w-3.5" />
            提炼诉求
          </div>
          <div className="text-2xl font-bold text-gray-900">{statistics.totalDemands}</div>
          <div className="mt-1 text-xs text-gray-400">共性需求聚类</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp className="h-3.5 w-3.5" />
            平均情绪指数
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {statistics.avgSentimentScore > 0 ? '+' : ''}
            {(statistics.avgSentimentScore * 100).toFixed(0)}
          </div>
          <div className="mt-1 text-xs text-gray-400">-100 至 +100 区间</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-red-50 to-orange-50 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="h-3.5 w-3.5" />
            负面热点
          </div>
          <div className="text-2xl font-bold text-gray-900">{statistics.negativeHotspots.length}</div>
          <div className="mt-1 text-xs text-gray-400">需优先关注的问题</div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Megaphone className="h-5 w-5 text-blue-500" />
              反馈渠道分布
            </h3>
          </div>
          <div className="space-y-4">
            {CHANNEL_OPTIONS.map((opt) => {
              const count = statistics.channelsDistribution[opt.value];
              const percent = channelTotal > 0 ? (count / channelTotal) * 100 : 0;
              return (
                <div key={opt.value} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <opt.icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </div>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        opt.value === 'customer_service'
                          ? 'bg-blue-500'
                          : opt.value === 'app_store'
                            ? 'bg-purple-500'
                            : opt.value === 'social_media'
                              ? 'bg-pink-500'
                              : 'bg-teal-500'
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <TrendingUp className="h-5 w-5 text-green-500" />
              增长趋势诉求
            </h3>
          </div>
          <div className="space-y-3">
            {statistics.trendingDemands.slice(0, 5).map((demand, idx) => {
              const TrendIcon = TREND_ICONS[demand.trend];
              return (
                <div
                  key={demand.id}
                  onClick={() => toggleExpand(demand.id)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                      idx === 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : idx === 1
                          ? 'bg-gray-100 text-gray-600'
                          : idx === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-50 text-gray-500'
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{demand.featureName}</p>
                    <p className="text-xs text-gray-500">{demand.uniqueUsers} 位用户提及</p>
                  </div>
                  <div className={cn('flex items-center gap-0.5 text-xs font-medium', TREND_COLORS[demand.trend])}>
                    <TrendIcon className="h-3.5 w-3.5" />
                    {demand.trendChange > 0 ? '+' : ''}
                    {demand.trendChange}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <AlertCircle className="h-5 w-5 text-red-500" />
              负面情绪热点
            </h3>
          </div>
          <div className="space-y-3">
            {statistics.negativeHotspots.slice(0, 5).map((demand, idx) => {
              const negRate = negativeRate(demand);
              return (
                <div
                  key={demand.id}
                  onClick={() => toggleExpand(demand.id)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{demand.featureName}</p>
                    <p className="text-xs text-gray-500">{demand.sentimentBreakdown.negative} 条负面反馈</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-600">{negRate}%</div>
                    <div className="text-[10px] text-gray-400">负面占比</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={userVoiceSearchQuery}
              onChange={(e) => setUserVoiceSearchQuery(e.target.value)}
              placeholder="搜索诉求名称、描述或关键词..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            {userVoiceSearchQuery && (
              <button onClick={() => setUserVoiceSearchQuery('')} className="text-gray-400 hover:text-gray-600">
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
                {userVoiceFilterChannels.length + (userVoiceSearchQuery ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={userVoiceSortBy}
              onChange={(e) => setUserVoiceSortBy(e.target.value as SortBy)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  按{opt.label}排序
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

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
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
            <span className="text-xs text-gray-500">渠道筛选：</span>
            {CHANNEL_OPTIONS.map((opt) => {
              const selected = userVoiceFilterChannels.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleUserVoiceChannelFilter(opt.value)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    selected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <opt.icon className="h-3 w-3" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          共找到 <span className="font-medium text-gray-900">{demands.length}</span> 条用户诉求
          {hasActiveFilters && <span>（已筛选）</span>}
        </span>
      </div>

      {demands.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">暂无符合条件的用户诉求</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-3 text-sm text-blue-600 hover:text-blue-700">
              清除筛选条件
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {demands.map((demand, index) => {
            const expanded = expandedDemandId === demand.id;
            const sentimentData = getSentimentBarData(demand);
            const relatedReq = demand.relatedRequirementId
              ? getRequirementById(demand.relatedRequirementId)
              : undefined;

            return (
              <div
                key={demand.id}
                className={cn(
                  'rounded-xl border border-gray-200 bg-white shadow-sm transition-all',
                  expanded ? 'shadow-md' : 'hover:shadow-md'
                )}
              >
                <div
                  className="cursor-pointer p-5"
                  onClick={() => toggleExpand(demand.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white',
                          demand.heatScore >= 80
                            ? 'bg-gradient-to-br from-red-500 to-rose-600'
                            : demand.heatScore >= 60
                              ? 'bg-gradient-to-br from-orange-500 to-amber-600'
                              : demand.heatScore >= 40
                                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                                : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-400">{demand.id}</span>
                          <div
                            className={cn(
                              'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium',
                              TREND_COLORS[demand.trend]
                            )}
                          >
                            {(() => {
                              const Icon = TREND_ICONS[demand.trend];
                              return <Icon className="h-3 w-3" />;
                            })()}
                            {demand.trendChange > 0 ? '+' : ''}
                            {demand.trendChange}%
                          </div>
                          {relatedReq && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/requirements/${relatedReq.id}`);
                              }}
                              className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 hover:bg-indigo-100"
                            >
                              <LinkIcon className="h-3 w-3" />
                              {relatedReq.id}
                            </span>
                          )}
                        </div>
                        <h3 className="mb-1 text-base font-semibold text-gray-900">{demand.featureName}</h3>
                        <p className="mb-3 line-clamp-1 text-xs text-gray-500">{demand.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {demand.keywords.map((kw) => (
                            <span key={kw} className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-start gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{demand.uniqueUsers}</div>
                        <div className="text-[10px] text-gray-500">提及用户</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{demand.totalMentions}</div>
                        <div className="text-[10px] text-gray-500">总提及数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{negativeRate(demand)}%</div>
                        <div className="text-[10px] text-gray-500">负面占比</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            'text-lg font-bold',
                            demand.heatScore >= 80
                              ? 'text-red-600'
                              : demand.heatScore >= 60
                                ? 'text-orange-600'
                                : demand.heatScore >= 40
                                  ? 'text-yellow-600'
                                  : 'text-gray-600'
                          )}
                        >
                          {demand.heatScore}
                        </div>
                        <div className="text-[10px] text-gray-500">热度分</div>
                      </div>
                      <div className="ml-2 mt-1">
                        {expanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-gray-500">情绪分布</span>
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1 text-green-600">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            {SENTIMENT_LABELS.positive} {positiveRate(demand)}%
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <span className="h-2 w-2 rounded-full bg-gray-400" />
                            {SENTIMENT_LABELS.neutral} {100 - positiveRate(demand) - negativeRate(demand)}%
                          </span>
                          <span className="flex items-center gap-1 text-red-600">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            {SENTIMENT_LABELS.negative} {negativeRate(demand)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                        {sentimentData.map((seg) => (
                          <div
                            key={seg.key}
                            className={cn(
                              'h-full transition-all duration-500',
                              seg.key === 'positive'
                                ? 'bg-green-500'
                                : seg.key === 'neutral'
                                  ? 'bg-gray-400'
                                  : 'bg-red-500'
                            )}
                            style={{ width: `${seg.percent}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500">渠道来源：</span>
                      {CHANNEL_OPTIONS.map((opt) => {
                        const count = demand.channelBreakdown[opt.value];
                        if (count === 0) return null;
                        return (
                          <span
                            key={opt.value}
                            className={cn(
                              'flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium',
                              FEEDBACK_CHANNEL_COLORS[opt.value]
                            )}
                          >
                            <opt.icon className="h-3 w-3" />
                            {opt.label} {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Quote className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">用户原声样本</span>
                    </div>
                    <div className="space-y-2">
                      {demand.sampleFeedbacks.map((fb, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600"
                        >
                          <span className="mr-2 text-gray-400">「</span>
                          {fb}
                          <span className="ml-2 text-gray-400">」</span>
                        </div>
                      ))}
                    </div>

                    {relatedReq && (
                      <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-indigo-700">
                          <LinkIcon className="h-3.5 w-3.5" />
                          已关联需求
                        </div>
                        <div
                          onClick={() => navigate(`/requirements/${relatedReq.id}`)}
                          className="cursor-pointer rounded-lg bg-white px-4 py-3 transition-colors hover:bg-indigo-50"
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-mono text-xs text-indigo-600">{relatedReq.id}</span>
                            <span className="text-sm font-medium text-gray-900">{relatedReq.title}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1">{relatedReq.description}</p>
                        </div>
                      </div>
                    )}

                    {!relatedReq && (
                      <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center">
                        <p className="text-sm text-gray-500">
                          该诉求尚未关联需求，可基于此用户反馈创建新需求
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
