import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequirementStore } from '@/store/useRequirementStore';
import {
  Kanban as KanbanIcon,
  ChevronRight,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import { STATUS_LABELS } from '@/types';
import type { RequirementStatus, Requirement } from '@/types';
import { cn } from '@/lib/utils';

const columns: { status: RequirementStatus; color: string; bgColor: string }[] = [
  { status: 'draft', color: 'border-gray-400', bgColor: 'bg-gray-50' },
  { status: 'analysis', color: 'border-yellow-400', bgColor: 'bg-yellow-50' },
  { status: 'planning', color: 'border-blue-400', bgColor: 'bg-blue-50' },
  { status: 'developing', color: 'border-purple-400', bgColor: 'bg-purple-50' },
  { status: 'testing', color: 'border-orange-400', bgColor: 'bg-orange-50' },
  { status: 'deployed', color: 'border-green-400', bgColor: 'bg-green-50' },
];

export default function Tracking() {
  const navigate = useNavigate();
  const { requirements, getRequirementsByStatus, updateRequirementStatus } =
    useRequirementStore();

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<RequirementStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, requirementId: string) => {
    setDraggedItem(requirementId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: RequirementStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: RequirementStatus) => {
    e.preventDefault();
    if (draggedItem) {
      updateRequirementStatus(draggedItem, status);
    }
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const getColumnRequirements = (status: RequirementStatus) => {
    return getRequirementsByStatus(status);
  };

  const totalRequirements = requirements.filter((r) => r.status !== 'archived').length;
  const deployedCount = getRequirementsByStatus('deployed').length;
  const inProgressCount =
    getRequirementsByStatus('developing').length + getRequirementsByStatus('testing').length;

  const moveToNext = (req: Requirement) => {
    const currentIndex = columns.findIndex((c) => c.status === req.status);
    if (currentIndex < columns.length - 1) {
      updateRequirementStatus(req.id, columns[currentIndex + 1].status);
    }
  };

  const moveToPrev = (req: Requirement) => {
    const currentIndex = columns.findIndex((c) => c.status === req.status);
    if (currentIndex > 0) {
      updateRequirementStatus(req.id, columns[currentIndex - 1].status);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">进度跟踪</h1>
          <p className="mt-1 text-sm text-gray-500">
            拖拽需求卡片调整状态，跟踪需求从提出到上线的全流程
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">完成率</p>
            <p className="text-lg font-bold text-gray-900">
              {totalRequirements > 0
                ? Math.round((deployedCount / totalRequirements) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-right">
            <p className="text-xs text-gray-500">进行中</p>
            <p className="text-lg font-bold text-gray-900">{inProgressCount}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-blue-100 p-2">
            <KanbanIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">总需求</p>
            <p className="text-xl font-bold text-gray-900">{totalRequirements}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-yellow-100 p-2">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">待处理</p>
            <p className="text-xl font-bold text-gray-900">
              {getRequirementsByStatus('draft').length +
                getRequirementsByStatus('analysis').length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-purple-100 p-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">进行中</p>
            <p className="text-xl font-bold text-gray-900">{inProgressCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-green-100 p-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">已上线</p>
            <p className="text-xl font-bold text-gray-900">{deployedCount}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnReqs = getColumnRequirements(column.status);
          const isDragOver = dragOverColumn === column.status;

          return (
            <div
              key={column.status}
              className={cn(
                'flex w-72 flex-shrink-0 flex-col rounded-xl border-2 bg-gray-50 transition-colors',
                column.color,
                isDragOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
              )}
              onDragOver={(e) => handleDragOver(e, column.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className={cn('rounded-t-lg px-4 py-3', column.bgColor)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {STATUS_LABELS[column.status]}
                  </h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm">
                    {columnReqs.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 p-3">
                {columnReqs.length === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400">
                    拖拽需求到这里
                  </div>
                ) : (
                  columnReqs.map((req) => (
                    <div
                      key={req.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, req.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => navigate(`/requirements/${req.id}`)}
                      className={cn(
                        'cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md',
                        draggedItem === req.id ? 'opacity-50 scale-95' : ''
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-400">{req.id}</span>
                        <PriorityBadge priority={req.priority} />
                      </div>

                      <h4 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900">
                        {req.title}
                      </h4>

                      <div className="mb-2 flex items-center gap-2">
                        {req.conflicts.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                            <AlertTriangle className="h-3 w-3" />
                            冲突
                          </span>
                        )}
                        {req.dependencies.length > 0 && (
                          <span className="text-xs text-gray-500">
                            依赖 {req.dependencies.length} 项
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                        {req.assignee && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            {req.assignee}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveToPrev(req);
                            }}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="上一阶段"
                          >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveToNext(req);
                            }}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="下一阶段"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">状态流转说明</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status="draft" />
              <StatusBadge status="analysis" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">需求分析阶段</h4>
            <p className="mt-1 text-xs text-gray-500">
              收集用户反馈，进行需求分析和结构化梳理，输出清晰的用户故事和验收标准
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status="planning" />
              <StatusBadge status="developing" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">开发实施阶段</h4>
            <p className="mt-1 text-xs text-gray-500">
              进行技术方案设计、排期规划，然后进入开发和联调阶段
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status="testing" />
              <StatusBadge status="deployed" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">测试上线阶段</h4>
            <p className="mt-1 text-xs text-gray-500">
              完成功能测试和验收测试，验证通过后发布上线，交付给用户使用
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
