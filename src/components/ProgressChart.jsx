import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProgressChart({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="label"
            stroke="#71717a"
            tickMargin={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#71717a"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              color: "#fafafa",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#e4e4e7"
            strokeWidth={3}
            dot={{ fill: "#e4e4e7", strokeWidth: 0, r: 4 }}
            activeDot={{
              r: 6,
              stroke: "#e4e4e7",
              strokeWidth: 2,
              fill: "#18181b",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
