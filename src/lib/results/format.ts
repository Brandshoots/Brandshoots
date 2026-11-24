const wholeNumberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

export function formatMetricValue(value: number | null): string {
  if (value === null || !Number.isSafeInteger(value) || value < 0) return '—';
  return wholeNumberFormatter.format(value);
}

export function formatDurationMonths(months: number | null): string {
  if (months === null || !Number.isSafeInteger(months) || months < 0) return '—';
  return `${wholeNumberFormatter.format(months)} ${months === 1 ? 'month' : 'months'}`;
}

export function formatMetricDelta(before: number | null, after: number | null): string | null {
  if (before === null || after === null || !Number.isFinite(before) || !Number.isFinite(after)) {
    return null;
  }

  const difference = after - before;
  if (difference === 0) return 'No change';

  const absoluteChange = `${difference > 0 ? '+' : '−'}${formatMetricValue(Math.abs(difference))}`;
  if (before === 0) return absoluteChange;

  const percentage = Math.abs((difference / before) * 100);
  const formattedPercentage = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: percentage < 10 ? 1 : 0,
  }).format(percentage);

  return `${absoluteChange} (${difference > 0 ? '+' : '−'}${formattedPercentage}%)`;
}
