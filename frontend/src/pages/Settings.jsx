import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Application configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 uppercase tracking-wide mb-2">API URL</label>
            <div className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 text-sm">
              {import.meta.env.VITE_API_URL || "http://localhost:3000"}
            </div>
            <p className="mt-2 text-xs text-gray-500">Configure via environment variable VITE_API_URL</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
