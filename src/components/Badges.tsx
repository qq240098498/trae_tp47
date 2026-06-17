import { cn } from '@/lib/utils';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  SOURCE_LABELS,
  DEPENDENCY_TYPE_LABELS,
  DEPENDENCY_TYPE_COLORS,
} from '@/types';
import type {
  RequirementStatus,
  PriorityLevel,
  RequirementSource,
  Dependency,
} from '@/types';

interface StatusBadgeProps {
  status: RequirementStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        PRIORITY_COLORS[priority],
        className
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

interface SourceBadgeProps {
  source: RequirementSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700',
        className
      )}
    >
      {SOURCE_LABELS[source]}
    </span>
  );
}

interface DependencyBadgeProps {
  type: Dependency['type'];
  className?: string;
}

export function DependencyBadge({ type, className }: DependencyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        DEPENDENCY_TYPE_COLORS[type],
        className
      )}
    >
      {DEPENDENCY_TYPE_LABELS[type]}
    </span>
  );
}

interface TagBadgeProps {
  tag: string;
  className?: string;
  onRemove?: () => void;
}

export function TagBadge({ tag, className, onRemove }: TagBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700',
        className
      )}
    >
      {tag}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 text-blue-400 hover:text-blue-600"
        >
          ×
        </button>
      )}
    </span>
  );
}
