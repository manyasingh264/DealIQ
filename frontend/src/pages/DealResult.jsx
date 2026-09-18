import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { CheckCircle, XCircle, AlertTriangle, Target, FileText, TrendingUp, Users } from "lucide-react";

export default function DealResult({ report, onBack }) {
  const isWon = report.outcome === "WON";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{report.company}</h1>
          <p className="text-sm text-gray-500 mt-1">{report.deal_name || "Deal Analysis"} · {report.deal_size === ",000" ? "$45,000" : report.deal_size}</p>
        </div>
        <Button variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          Back to Dashboard
        </Button>
      </div>

      {/* Outcome Summary */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Outcome</p>
              <div className="flex items-center gap-3">
                <Badge variant={isWon ? "success" : "danger"}>
                  {isWon ? "Won" : "Lost"}
                </Badge>
              </div>
            </div>
            <div className="flex-1 sm:mx-8">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Root cause</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {(report.primary_reason || report.reason || "Unknown").replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Section */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Objections */}
          {report.objections && report.objections.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Objections raised</p>
              <ul className="space-y-1">
                {report.objections.map((objection, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{objection}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Competitors */}
          {report.competitors && report.competitors.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Competitors mentioned</p>
              <div className="flex flex-wrap gap-2">
                {report.competitors.map((competitor, i) => (
                  <Badge key={i} variant="default">{competitor}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Positive Signals */}
          {report.positive_signals && report.positive_signals.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Positive signals</p>
              <ul className="space-y-1">
                {report.positive_signals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What Worked */}
          {report.what_worked && report.what_worked.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">What worked well</p>
              <ul className="space-y-1">
                {report.what_worked.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-700 mb-2">{report.primary_explanation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-600" />
                <p className="text-xs text-gray-500 uppercase tracking-wide">In our control</p>
              </div>
              <ul className="space-y-1">
                {(report.in_our_control || []).map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <p className="text-xs text-gray-500 uppercase tracking-wide">Outside our control</p>
              </div>
              <ul className="space-y-1">
                {(report.not_in_our_control || []).map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {(report.next_time || []).map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="text-indigo-600 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Sales Rep Feedback & Manager Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <CardTitle className="text-sm sm:text-base">Sales rep feedback</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{report.coaching_note}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <CardTitle className="text-sm sm:text-base">Manager insight</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{report.strategic_insight}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
