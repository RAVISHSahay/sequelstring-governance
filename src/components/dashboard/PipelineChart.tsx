import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { stage: "Lead", value: 45, deals: 23 },
  { stage: "Qualified", value: 38, deals: 18 },
  { stage: "Proposal", value: 28, deals: 12 },
  { stage: "Negotiation", value: 18, deals: 8 },
  { stage: "Closed Won", value: 12, deals: 5 },
];

const COLORS = [
  "hsl(220, 14%, 70%)",
  "hsl(199, 89%, 48%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 68%, 50%)",
  "hsl(152, 69%, 31%)",
];

export function PipelineChart() {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Sales Pipeline</h3>
        <p className="text-sm text-muted-foreground">
          Deal progression across stages
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={24}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              type="number"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${props.payload.deals} deals • ₹${value}L`,
                "",
              ]}
              labelFormatter={(label) => `${label} Stage`}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
