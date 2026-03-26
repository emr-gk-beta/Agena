'use client';

export type LineChartDatum = { label: string; value: number };

type Props = {
  data: LineChartDatum[];
  width?: number;
  height?: number;
  lineColor?: string;
  fillColor?: string;
  labelColor?: string;
};

export default function LineChart({
  data,
  width = 480,
  height = 180,
  lineColor = '#38bdf8',
  fillColor = 'rgba(56,189,248,0.12)',
  labelColor = 'var(--ink-35)',
}: Props) {
  if (data.length === 0) return null;

  const pad = { top: 12, right: 8, bottom: 32, left: 8 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  const points = data.map((d, i) => {
    const x = pad.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW);
    const y = pad.top + chartH - (d.value / maxVal) * chartH;
    return { x, y, ...d };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath = [
    `M ${points[0].x},${pad.top + chartH}`,
    ...points.map((p) => `L ${p.x},${p.y}`),
    `L ${points[points.length - 1].x},${pad.top + chartH}`,
    'Z',
  ].join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
      {/* fill area */}
      <path d={areaPath} fill={fillColor} />
      {/* line */}
      <polyline points={polyline} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" />
      {/* dots */}
      {points.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r={3} fill={lineColor}>
          <title>{`${p.label}: ${p.value}`}</title>
        </circle>
      ))}
      {/* labels */}
      {data.length <= 14 &&
        points.map((p) => (
          <text
            key={p.label}
            x={p.x}
            y={height - 6}
            textAnchor="middle"
            fontSize={9}
            fill={labelColor}
            fontFamily="monospace"
          >
            {p.label.length > 5 ? p.label.slice(-5) : p.label}
          </text>
        ))}
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
