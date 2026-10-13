import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCategory, formatCompact, formatCurrency } from '../../utils/format';
import { axisTick, CHART_COLOR, tooltipStyle } from './chartStyles';

type Props = { data: { category: string; value: number }[] };

// Horizontal bars read better than vertical ones with long category names. Data arrives sorted.
export function CategoryBarChart({ data }: Props) {
  return (
    <div className="h-72 text-slate-500" role="img" aria-label="Revenue by category">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="currentColor"
            strokeOpacity={0.15}
          />
          <XAxis
            type="number"
            tickFormatter={formatCompact}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
          />
          <YAxis
            type="category"
            dataKey="category"
            tickFormatter={formatCategory}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            width={110}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => formatCategory(String(label))}
            contentStyle={tooltipStyle}
            cursor={{ fill: 'currentColor', fillOpacity: 0.08 }}
          />
          <Bar dataKey="value" name="Revenue" fill={CHART_COLOR} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
