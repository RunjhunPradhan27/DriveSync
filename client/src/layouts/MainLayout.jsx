import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import {
  Car,
  LayoutDashboard,
  Users,
  Receipt,
  Boxes,
  Package,
  CalendarClock,
  ClipboardList,
  UserCog,
  ShieldCheck,
  UserCircle,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

// Same routes and role gates as before, just data-driven instead of repeated
// JSX conditionals. `end: true` -> exact-match only (so "/" doesn't stay
// active on every route); no `roles` + no `auth` -> visible to everyone;
// `auth: true` with no `roles` -> visible to any authenticated role.
const NAV_ITEMS = [
  { to: '/', label: 'Vehicles', icon: Car, end: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, auth: true },
  { to: '/customers', label: 'Customers', icon: Users, roles: ['Admin', 'Sales Executive'] },
  { to: '/sales', label: 'Sales', icon: Receipt, roles: ['Admin', 'Sales Executive'] },
  { to: '/inventory', label: 'Inventory', icon: Boxes, roles: ['Admin', 'Inventory Manager'] },
  { to: '/spare-parts', label: 'Spare Parts', icon: Package, roles: ['Admin', 'Inventory Manager', 'Technician'] },
  { to: '/service-bookings', label: 'Service Bookings', icon: CalendarClock, roles: ['Admin', 'Technician', 'Sales Executive'] },
  { to: '/service-records', label: 'Service Records', icon: ClipboardList, roles: ['Admin', 'Technician'] },
  { to: '/employees', label: 'Employees', icon: UserCog, roles: ['Admin'] },
  { to: '/admin', label: 'Admin', icon: ShieldCheck, roles: ['Admin'] },
  { to: '/account', label: 'My Account', icon: UserCircle, auth: true }
];

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isVisible = (item) => {
    if (isAuthenticated) {
      if (item.roles) return item.roles.includes(user.role);
      return true;
    }
    return !item.roles && !item.auth;
  };

  const navItems = NAV_ITEMS.filter(isVisible);

  const renderLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      onClick={() => setMobileOpen(false)}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          collapsed ? 'justify-center' : '',
          isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        ].join(' ')
      }
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );

  const sidebarBody = (
    <>
      <div className={`flex items-center gap-2.5 px-4 py-5 ${collapsed ? 'justify-center px-2' : ''}`}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Car className="h-5 w-5" strokeWidth={2.25} />
        </span>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold text-white">DriveSync</p>
            <p className="truncate text-[11px] text-slate-400">Dealership Platform</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">{navItems.map(renderLink)}</nav>

      <div className="border-t border-slate-800 p-3">
        {isAuthenticated ? (
          <>
            <div className={`flex items-center gap-3 rounded-lg px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                {user.role.charAt(0)}
              </span>
              {!collapsed && (
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-medium text-white">{user.role}</p>
                  <p className="truncate text-xs text-slate-400">User #{user.id}</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={logout}
              title={collapsed ? 'Log out' : undefined}
              className={[
                'mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white',
                collapsed ? 'justify-center' : ''
              ].join(' ')}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
              {!collapsed && 'Log Out'}
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <UserCircle className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            {!collapsed && 'Log In'}
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={[
          'relative hidden shrink-0 flex-col bg-slate-900 transition-all duration-200 lg:sticky lg:top-0 lg:flex lg:h-screen',
          collapsed ? 'lg:w-20' : 'lg:w-64'
        ].join(' ')}
      >
        {sidebarBody}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-6 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-sm transition-colors hover:bg-slate-700 lg:flex"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="animate-slide-in absolute left-0 top-0 flex h-full w-64 flex-col bg-slate-900 shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarBody}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
              <Car className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">DriveSync</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications (coming soon)"
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
            </button>
            {isAuthenticated && (
              <span className="hidden items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-3 sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                  {user.role.charAt(0)}
                </span>
                <span className="text-xs font-medium text-slate-700">{user.role}</span>
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-400 sm:px-6">
          DriveSync — Automobile Sales &amp; Service Management
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
