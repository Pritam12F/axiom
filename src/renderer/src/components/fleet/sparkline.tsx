export function Sparkline({
  data,
  className,
  strokeClassName = "stroke-primary",
  width = 64,
  height = 20,
}: {
  data: number[]
  className?: string
  strokeClassName?: string
  width?: number
  height?: number
}) {
  if (data.length === 0) return null
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const step = width / (data.length - 1 || 1)
  const points = data.map((v, i) => {
    const x = i * step
    const y = height - ((v - min) / range) * height
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label="CPU usage trend">
      <polyline points={points.join(" ")} fill="none" strokeWidth={1.5} className={strokeClassName} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
