import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Strategic patterns and recommendations</p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">Insights page under development</p>
        </CardContent>
      </Card>
    </div>
  );
}
