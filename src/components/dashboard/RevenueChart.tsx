import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", actual: 42, forecast: 45 },
  { month: "Feb", actual: 48, forecast: 50 },
  { month: "Mar", actual: 55, forecast: 58 },
  { month: "Apr", actual: 62, forecast: 65 },
  { month: "May", actual: 70, forecast: 72 },
  { month: "Jun", actual: 78, forecast: 80 },
  { month: "Jul", actual: 85, forecast: 88 },
  { month: "Aug", actual: 92, forecast: 95 },
  { month: "Sep", actual: null, forecast: 102 },
  { month: "Oct", actual: null, forecast: 110 },
  { month: "Nov", actual: null, forecast: 118 },
  { month: "Dec", actual: null, forecast: 125 },
];

export function RevenueChart() {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Revenue Forecast
          </h3>
          <p className="text-sm text-muted-foreground">
            Actual vs Projected (₹ in Lakhs)
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Forecast</span>
          </div>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(217, 71%, 22%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(217, 71%, 22%)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(38, 92%, 50%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(38, 92%, 50%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`₹${value}L`, ""]}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorForecast)"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="hsl(217, 71%, 22%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorActual)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
