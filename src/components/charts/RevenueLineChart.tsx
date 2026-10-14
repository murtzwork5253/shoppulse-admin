import { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCompact, formatCurrency } from '../../utils/format';
import { axisTick, CHART_COLOR, tooltipStyle } from './chartStyles';

export function RevenueLineChart({ data }: { data: { month: string; revenue: number }[] }) {
  const gradientId = useId();
  return (
    <div className="h-72 text-ink-2" role="img" aria-label="Revenue over the last 12 months">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 4"
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
            cursor={{ stroke: CHART_COLOR, strokeOpacity: 0.3, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke={CHART_COLOR}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface)', fill: CHART_COLOR }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
