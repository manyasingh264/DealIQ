import React from "react";
import { LayoutDashboard, FileText, PlusCircle, BarChart3, Settings, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../context/auth";

const Sidebar = ({ currentPage, onPageChange, isMobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "deals", label: "Deals", icon: FileText },
    { id: "new", label: "Analyze Deal", icon: PlusCircle },
    { id: "insights", label: "Insights", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">DQ</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">DealIQ</h1>
            <p className="text-xs text-gray-500">Deal Analysis</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : (user?.email ? user.email.slice(0, 2).toUpperCase() : "DQ")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.full_name || "Sales User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "user@dealiq.com"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 uppercase tracking-wide">
            {user?.role || "USER"}
          </span>
          <button
            onClick={logout}
            title="Log out"
            className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4 lg:hidden">
          <button
            onClick={onMobileClose}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
