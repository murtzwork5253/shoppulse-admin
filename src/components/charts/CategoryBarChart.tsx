import { useId } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCategory, formatCompact, formatCurrency } from '../../utils/format';
import { axisTick, tooltipStyle } from './chartStyles';

type Props = { data: { category: string; value: number }[] };

// Horizontal bars read better than vertical ones with long category names. Data arrives sorted.
export function CategoryBarChart({ data }: Props) {
  const gradientId = useId();
  return (
    <div className="h-72 text-ink-2" role="img" aria-label="Revenue by category">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="28%"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#bdb0ff" />
              <stop offset="100%" stopColor="#6a3fe8" />
            </linearGradient>
          </defs>
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
            width={150}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => formatCategory(String(label))}
            contentStyle={tooltipStyle}
            cursor={{ fill: 'currentColor', fillOpacity: 0.07 }}
          />
          <Bar
            dataKey="value"
            name="Revenue"
            fill={`url(#${gradientId})`}
            radius={[0, 8, 8, 0]}
            background={{ fill: 'currentColor', fillOpacity: 0.06, radius: 8 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
