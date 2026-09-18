import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Skeleton from "../components/ui/Skeleton";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Dashboard({ onPageChange, onSelectDeal }) {
  const [stats, setStats] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [dealsError, setDealsError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("dealiq_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setStatsError(null);
    setDealsError(null);

    Promise.allSettled([
      fetch(`${API}/api/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
      fetch(`${API}/api/deals`, { headers: getAuthHeaders() }).then(r => r.json())
    ]).then(([statsResult, dealsResult]) => {
      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
      } else {
        setStatsError("Failed to load stats");
      }
      if (dealsResult.status === "fulfilled") {
        setDeals(dealsResult.value);
      } else {
        setDealsError("Failed to load deals");
      }
      setLoading(false);
      
      if (statsResult.status === "rejected" && dealsResult.status === "rejected") {
        setError("Unable to load dashboard data");
      }
    }).catch(err => {
      console.error("Failed to fetch data:", err);
      setError("Unable to load dashboard data");
      setLoading(false);
    });
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setStatsError(null);
    setDealsError(null);

    Promise.allSettled([
      fetch(`${API}/api/stats`, { headers: getAuthHeaders() }).then(r => r.json()),
      fetch(`${API}/api/deals`, { headers: getAuthHeaders() }).then(r => r.json())
    ]).then(([statsResult, dealsResult]) => {
      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
      } else {
        setStatsError("Failed to load stats");
      }
      if (dealsResult.status === "fulfilled") {
        setDeals(dealsResult.value);
      } else {
        setDealsError("Failed to load deals");
      }
      setLoading(false);
      
      if (statsResult.status === "rejected" && dealsResult.status === "rejected") {
        setError("Unable to load dashboard data");
      }
    }).catch(err => {
      console.error("Failed to fetch data:", err);
      setError("Unable to load dashboard data");
      setLoading(false);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const calculateCompetitorLostDeals = (competitors, deals) => {
    const competitorLost = {};
    deals.forEach(deal => {
      if (deal.outcome === "LOST" && deal.report) {
        try {
          const report = typeof deal.report === "string" ? JSON.parse(deal.report) : deal.report;
          const comps = report.competitors || [];
          comps.forEach(comp => {
            if (!competitorLost[comp]) competitorLost[comp] = 0;
            competitorLost[comp]++;
          });
        } catch (e) {}
      }
    });
    return competitorLost;
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const competitorLostDeals = calculateCompetitorLostDeals(stats?.top_competitors || [], deals);
  const totalLost = stats?.lost || 0;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard data</h2>
        <p className="text-sm text-gray-500 mb-4">There was a problem connecting to the server</p>
        <Button onClick={handleRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Sales performance and deal analysis</p>
        </div>
        <Button onClick={() => onPageChange && onPageChange("new")}>
          <Plus className="w-4 h-4 mr-2" />
          Analyze Deal
        </Button>
      </div>

      {/* Subtle Pattern Alert */}
      {stats?.loss_reasons?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-2.5 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Recurring issue</p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="capitalize">{stats.loss_reasons[0]?.reason?.replace(/_/g, " ")}</span> was the most common loss reason ({stats.loss_reasons[0]?.count} deals)
            </p>
          </div>
        </div>
      )}

      {/* Compact KPI Row */}
      {statsError ? (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-2.5 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{statsError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-md px-4 py-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Deals analyzed</p>
            <p className="text-xl font-semibold text-gray-900">{stats?.total_deals || 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-md px-4 py-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Won</p>
            <p className="text-xl font-semibold text-green-600">{stats?.won || 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-md px-4 py-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Lost</p>
            <p className="text-xl font-semibold text-red-600">{stats?.lost || 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-md px-4 py-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Win rate</p>
            <p className="text-xl font-semibold text-green-600">{stats?.win_rate || 0}%</p>
          </div>
        </div>
      )}

      {/* Win/Loss Trend */}
      {!statsError && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.monthly_trend || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", color: "#111827", borderRadius: "4px" }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Legend />
                <Bar dataKey="won" fill="#10b981" name="Won" radius={[2, 2, 0, 0]} barSize={24} />
                <Bar dataKey="lost" fill="#ef4444" name="Lost" radius={[2, 2, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Loss Reasons */}
      {!statsError && (
        <Card>
          <CardHeader>
            <CardTitle>Loss Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.loss_reasons?.length > 0 ? (
              <div className="space-y-1">
                {stats.loss_reasons.map((reason, i) => {
                  const percentage = totalLost > 0 ? Math.round((reason.count / totalLost) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                      <span className="text-sm text-gray-700 capitalize">{reason.reason.replace(/_/g, " ")}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{percentage}%</span>
                        <span className="text-sm font-medium text-gray-900">{reason.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No loss data available</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Competitors Table */}
      {!statsError && stats?.top_competitors?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Competitors</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deals mentioned</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lost deals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.top_competitors.map(([name, count], i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <span className="text-sm font-medium text-gray-900">{name}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-sm text-gray-600">{count}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-sm text-gray-600">{competitorLostDeals[name] || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recurring Issues */}
      {!statsError && (stats?.loss_reasons?.length > 0 || stats?.top_competitors?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.loss_reasons?.length > 0 && stats.loss_reasons[0].count >= 2 && (
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-700 capitalize">
                      {stats.loss_reasons[0].reason.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-500"> in </span>
                    <span className="text-gray-900 font-medium">{stats.loss_reasons[0].count}</span>
                    <span className="text-gray-500"> lost deals</span>
                  </div>
                </div>
              )}
              {stats?.top_competitors?.length > 0 && stats.top_competitors[0][1] >= 2 && (
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-900 font-medium">{stats.top_competitors[0][0]}</span>
                    <span className="text-gray-500"> in </span>
                    <span className="text-gray-900 font-medium">{stats.top_competitors[0][1]}</span>
                    <span className="text-gray-500"> deals</span>
                    {competitorLostDeals[stats.top_competitors[0][0]] > 0 && (
                      <>
                        <span className="text-gray-500"> (</span>
                        <span className="text-gray-900 font-medium">{competitorLostDeals[stats.top_competitors[0][0]]}</span>
                        <span className="text-gray-500"> lost)</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {dealsError ? (
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-8 h-8 text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 mb-4">{dealsError}</p>
              <Button variant="secondary" size="sm" onClick={handleRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : deals.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No deals analyzed yet</h3>
              <p className="text-sm text-gray-500 mb-4">Analyze your first deal to start building sales intelligence.</p>
              <Button onClick={() => onPageChange && onPageChange("new")}>
                <Plus className="w-4 h-4 mr-2" />
                Analyze Deal
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deals.slice(0, 10).map((deal, i) => (
                    <tr key={i} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectDeal ? onSelectDeal(deal) : (onPageChange && onPageChange("deals"))}>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-gray-900">{deal.company}</div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm text-gray-600">{deal.deal_name || "Deal Analysis"}</div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm text-gray-900">{deal.deal_size === ",000" ? "$45,000" : deal.deal_size}</div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={deal.outcome === "WON" ? "success" : "danger"}>
                          {deal.outcome}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm text-gray-500">{getRelativeTime(deal.created_at)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
