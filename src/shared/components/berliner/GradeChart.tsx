"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Courbe d'évolution des notes (sur 20) dans le temps.
// Remplace l'ancien SVG fait main par un composant shadcn (recharts).

export type GradePoint = { date: string; note: number };

const config = {
  note: { label: "Note", color: "var(--primary)" },
} satisfies ChartConfig;

export function GradeChart({
  data,
  avg,
  color = "var(--primary)",
}: {
  data: GradePoint[];
  avg: number | null;
  color?: string;
}) {
  if (data.length < 2) return null;
  return (
    <ChartContainer config={config} className="h-[150px] w-full">
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
        <CartesianGrid vertical={false} strokeDasharray="2 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          fontSize={9}
          tickFormatter={(d: string) =>
            new Date(d).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })
          }
        />
        <YAxis
          domain={[0, 20]}
          ticks={[0, 10, 14, 20]}
          tickLine={false}
          axisLine={false}
          width={26}
          fontSize={9}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {/* Repère "objectif" à 14 */}
        <ReferenceLine y={14} stroke="var(--ink-3)" strokeDasharray="3 3" />
        {/* Moyenne de la période */}
        {avg != null && (
          <ReferenceLine y={avg} stroke={color} strokeDasharray="4 2" />
        )}
        <Line
          dataKey="note"
          type="monotone"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--surface)", stroke: color, strokeWidth: 1.5 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
