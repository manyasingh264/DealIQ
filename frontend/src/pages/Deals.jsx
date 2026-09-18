import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Skeleton from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Deals({ onPageChange, onSelectDeal }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("dealiq_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchDeals = () => {
    setLoading(true);
    setError(null);
    fetch(`${API}/api/deals`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        setDeals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch deals:", err);
        setError("Unable to load deals");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = deals.filter(deal =>
    deal.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.deal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.primary_reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Deals</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all analyzed deals</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <Button onClick={() => onPageChange && onPageChange("new")} className="w-full sm:w-auto min-h-[44px]">
            <Plus className="w-4 h-4 mr-2" />
            Analyze Deal
          </Button>
        </div>
      </div>

      {/* Deals Table */}
      <Card>
        <CardContent className="p-0">
          {error ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load deals</h3>
              <p className="text-sm text-gray-500 mb-4">There was a problem connecting to the server</p>
              <Button onClick={fetchDeals}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Size</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Reason</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDeals.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-6 h-6 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? "No deals match your search" : "No deals analyzed yet"}
                          </h3>
                          {!searchTerm && (
                            <>
                              <p className="text-sm text-gray-500 mb-4">Analyze your first deal to start building sales intelligence.</p>
                              <Button onClick={() => onPageChange && onPageChange("new")}>
                                <Plus className="w-4 h-4 mr-2" />
                                Analyze Deal
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDeals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectDeal ? onSelectDeal(deal) : (onPageChange && onPageChange("new"))}>
                        <td className="px-4 py-2">
                          <div className="text-sm font-medium text-gray-900">{deal.company}</div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="text-sm text-gray-600">{deal.deal_name || "Deal Analysis"}</div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="text-sm text-gray-600">{deal.deal_size === ",000" ? "$45,000" : deal.deal_size}</div>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={deal.outcome === "WON" ? "success" : "danger"}>
                            {deal.outcome}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <div className="text-sm text-gray-500 capitalize">{deal.primary_reason?.replace(/_/g, " ") || "-"}</div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="text-sm text-gray-500">{formatDate(deal.created_at)}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredDeals.length > 0 && (
        <div className="text-sm text-gray-500">
          Showing {filteredDeals.length} of {deals.length} deals
        </div>
      )}
    </div>
  );
}
