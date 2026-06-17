import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  GitBranch,
  Kanban,
  Settings,
  Activity,
  MessageSquareHeart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '工作台', icon: LayoutDashboard },
  { path: '/requirements', label: '需求列表', icon: FileText },
  { path: '/prioritization', label: '优先级排序', icon: BarChart3 },
  { path: '/user-voice', label: '用户之声', icon: MessageSquareHeart },
  { path: '/dependencies', label: '依赖与冲突', icon: GitBranch },
  { path: '/impact-assessment', label: '影响面评估', icon: Activity },
  { path: '/tracking', label: '进度跟踪', icon: Kanban },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-screen w-64 flex-col border-r border-gray-200 bg-white',
        className
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900">需求管理系统</h1>
          <p className="text-xs text-gray-500">Product Requirements</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
          <Settings className="h-5 w-5" />
          设置
        </button>
      </div>
    </aside>
  );
}
