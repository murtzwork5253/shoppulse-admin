import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCompact, formatCurrency } from '../../utils/format';
import { axisTick, CHART_COLOR, tooltipStyle } from './chartStyles';

export function RevenueLineChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <div className="h-72 text-slate-500" role="img" aria-label="Revenue over the last 12 months">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            strokeOpacity={0.15}
          />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis
            tickFormatter={formatCompact}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            width={48}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={tooltipStyle}
            cursor={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke={CHART_COLOR}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
