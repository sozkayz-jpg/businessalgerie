"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { analyzeSEO } from "@/lib/cms/actions";

interface SEOAnalysis {
  score: number;
  checks: Array<{
    name: string;
    passed: boolean;
    message: string;
    priority: "high" | "medium" | "low";
  }>;
  suggestions: string[];
  geoScore: number;
}

export function SEOAnalyzer({
  title,
  description,
  content,
  slug,
  locale,
  keywords,
}: {
  title: string;
  description: string;
  content: string;
  slug: string;
  locale: string;
  keywords: string;
}) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const result = await analyzeSEO({ title, description, content, slug, locale, keywords });
    setAnalysis(result);
    setLoading(false);
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analyse SEO / Géo</CardTitle>
        <Button onClick={run} disabled={loading} size="sm">
          {loading ? "Analyse..." : "Analyser"}
        </Button>
      </CardHeader>
      <CardContent>
        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>Score SEO</span>
                  <span>{analysis.score}/100</span>
                </div>
                <Progress value={analysis.score} />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>Score GEO</span>
                  <span>{analysis.geoScore}/100</span>
                </div>
                <Progress value={analysis.geoScore} />
              </div>
            </div>

            <div className="grid gap-2">
              {analysis.checks.map((check) => (
                <div key={check.name} className="flex items-start justify-between rounded border p-2">
                  <div>
                    <p className="font-medium">{check.name}</p>
                    <p className="text-sm text-muted-foreground">{check.message}</p>
                  </div>
                  <Badge variant={check.passed ? "default" : "destructive"}>
                    {check.passed ? "OK" : check.priority.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>

            {analysis.suggestions.length > 0 && (
              <div>
                <p className="mb-2 font-medium">Suggestions</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
