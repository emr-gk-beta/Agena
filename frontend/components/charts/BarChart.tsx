'use client';

export type BarChartDatum = { label: string; value: number };

type Props = {
  data: BarChartDatum[];
  width?: number;
  height?: number;
  barColor?: string;
  labelColor?: string;
};

export default function BarChart({
  data,
  width = 480,
  height = 200,
  barColor = '#5eead4',
  labelColor = 'var(--ink-35)',
}: Props) {
  if (data.length === 0) return null;

  const pad = { top: 12, right: 8, bottom: 32, left: 8 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barGap = 4;
  const barW = Math.max(4, (chartW - barGap * (data.length - 1)) / data.length);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const x = pad.left + i * (barW + barGap);
        const y = pad.top + chartH - barH;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={3}
              fill={barColor}
              opacity={0.85}
            >
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
            {/* label */}
            {data.length <= 14 && (
              <text
                x={x + barW / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize={9}
                fill={labelColor}
                fontFamily="monospace"
              >
                {d.label.length > 5 ? d.label.slice(-5) : d.label}
              </text>
            )}
          </g>
        );
      })}
      {/* baseline */}
      <line
        x1={pad.left}
        y1={pad.top + chartH}
        x2={pad.left + chartW}
        y2={pad.top + chartH}
        stroke="var(--panel-border)"
        strokeWidth={1}
      />
    </svg>
  );
}
