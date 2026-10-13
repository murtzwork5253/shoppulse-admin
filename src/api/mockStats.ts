// The API has no order dates, so the 12-month trend is generated sample data that adds up to
// the real total revenue. The dashboard says so under the chart.
const WEIGHTS = [0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.09, 0.1, 0.1, 0.11];

export function monthlyTrend(total: number) {
  const now = new Date();
  return WEIGHTS.map((w, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return {
      month: d.toLocaleString('en-US', { month: 'short' }),
      revenue: Math.round(total * w),
    };
  });
}
