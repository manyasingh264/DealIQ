import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const STEPS = [
  "Parsing deal context",
  "Detecting signals & objections",
  "Finding root cause",
  "Generating recommendations",
  "Building analysis report",
];

export default function NewDeal({ onResult }) {
  const [form, setForm] = useState({
    company: "",
    deal_name: "",
    deal_size: "",
    deal_stage: "Negotiation",
    outcome: "LOST",
    deal_text: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.deal_size || !form.deal_text) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("dealiq_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const res = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers,
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        onResult(data.report);
      } else {
        setError("Analysis failed. Check your API key.");
      }
    } catch (err) {
      setLoading(false);
      setError("Could not connect to backend. Make sure it is running.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Analyze deal</h1>
          <p className="text-sm text-gray-500 mt-1">Analysis in progress...</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
              <p className="text-sm text-gray-600">Analyzing deal context</p>
              <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-0 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analyze deal</h1>
        <p className="text-sm text-gray-500 mt-1">Add deal context to generate a structured sales analysis.</p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Account / Company"
                placeholder="e.g., Acme Corporation"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
              <Input
                label="Deal name"
                placeholder="e.g., Q4 Platform License"
                value={form.deal_name}
                onChange={(e) => setForm({ ...form, deal_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Deal value"
                placeholder="e.g., $18,500"
                value={form.deal_size}
                onChange={(e) => setForm({ ...form, deal_size: e.target.value })}
              />
              <div>
                <label className="block text-xs text-gray-600 uppercase tracking-wide mb-2">Deal stage</label>
                <select
                  value={form.deal_stage}
                  onChange={(e) => setForm({ ...form, deal_stage: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Discovery">Discovery</option>
                  <option value="Demo">Demo</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closing">Closing</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 uppercase tracking-wide mb-2">Outcome</label>
              <div className="flex gap-3">
                {["WON", "LOST"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm({ ...form, outcome: opt })}
                    className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                      form.outcome === opt
                        ? opt === "WON"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Deal context"
              placeholder="CRM notes, call summary, email thread, meeting notes, etc."
              rows={8}
              value={form.deal_text}
              onChange={(e) => setForm({ ...form, deal_text: e.target.value })}
              helperText="Include customer objections, competitors, pricing discussions, product requirements, and other relevant context when available."
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full min-h-[44px]" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze deal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
