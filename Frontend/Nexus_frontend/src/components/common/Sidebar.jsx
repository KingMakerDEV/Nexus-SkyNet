import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Database,
  GitCompare,
  BarChart3,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  Layers,
  Zap,
} from 'lucide-react';

const navItems = [
  {
    path: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
    description: 'Overview & metrics',
  },
  {
    path: '/upload',
    icon: Upload,
    label: 'Upload Data',
    description: 'Ingest new datasets',
  },
  {
    path: '/datasets',
    icon: Database,
    label: 'Dataset Explorer',
    description: 'Browse & search',
  },
  {
    path: '/compare',
    icon: GitCompare,
    label: 'Compare',
    description: 'Analyze differences',
  },
  {
    path: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
    description: 'Statistics & trends',
  },
  {
    path: '/ai-discovery',
    icon: Sparkles,
    label: 'AI Discovery',
    description: 'AI-powered insights',
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-sidebar-accent text-sidebar-primary glow-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                  }
                `}
              >
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-sidebar-accent text-sidebar-foreground group-hover:bg-sidebar-primary/20 group-hover:text-sidebar-primary'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : ''}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                )}
                {isActive && !collapsed && (
                  <div className="w-1.5 h-8 bg-primary rounded-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick stats */}
        {!collapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="p-4 rounded-xl bg-cosmic-radial border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quick Stats
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Datasets</span>
                  <span className="font-mono text-foreground">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Objects</span>
                  <span className="font-mono text-foreground">5.2M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sources</span>
                  <span className="font-mono text-foreground">12</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
