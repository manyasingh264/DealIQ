import React, { useState } from "react";
import { Menu, Loader2 } from "lucide-react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import NewDeal from "./pages/NewDeal";
import DealResult from "./pages/DealResult";
import Deals from "./pages/Deals";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import { AuthProvider, useAuth } from "./context/auth";

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [report, setReport] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResult = (r) => {
    setReport(r);
    setCurrentPage("result");
    setRefreshKey(k => k + 1);
  };

  const handleSelectDeal = (deal) => {
    if (deal && deal.report) {
      const rep = typeof deal.report === "string" ? JSON.parse(deal.report) : deal.report;
      setReport({
        ...rep,
        company: deal.company,
        deal_size: deal.deal_size,
        outcome: deal.outcome,
        deal_name: deal.deal_name,
        primary_reason: rep.primary_reason || deal.primary_reason || "Unknown"
      });
      setCurrentPage("result");
    }
  };

  const handlePageChange = (page) => {
    if (page === "new") {
      setReport(null);
    }
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
            <span className="text-white font-black text-sm">DQ</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading DealIQ...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard key={refreshKey} onPageChange={handlePageChange} onSelectDeal={handleSelectDeal} />;
      case "new":
        return <NewDeal onResult={handleResult} />;
      case "result":
        return report ? <DealResult report={report} onBack={() => setCurrentPage("deals")} /> : null;
      case "deals":
        return <Deals onPageChange={handlePageChange} onSelectDeal={handleSelectDeal} />;
      case "insights":
        return <Insights />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard key={refreshKey} onPageChange={handlePageChange} onSelectDeal={handleSelectDeal} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">DQ</span>
          </div>
          <span className="text-gray-900 font-semibold text-sm">DealIQ</span>
        </div>
        <div className="w-8" />
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
