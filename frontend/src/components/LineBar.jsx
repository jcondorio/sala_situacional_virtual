import { ResponsiveLine } from '@nivo/line';
import { useMemo } from 'react';

const darkTheme = {
  background: 'transparent',
  text: { fontSize: 12, fill: '#fff' },          // ← textos generales en blanco
  axis: {
    domain: { line: { stroke: 'rgba(255,255,255,.25)', strokeWidth: 1 } },
    ticks: {
      line: { stroke: 'rgba(255,255,255,.25)', strokeWidth: 1 },
      text: { fill: '#fff' },                    // ← números de ejes en blanco
    },
    legend: { text: { fill: '#fff' } },          // ← títulos de ejes en blanco
  },
  grid: { line: { stroke: 'rgba(255,255,255,.14)', strokeWidth: 1 } },
  tooltip: { container: { background: '#fff', color: '#111', fontSize: 12, borderRadius: 8 } },
  crosshair: { line: { stroke: 'rgba(255,255,255,.7)', strokeWidth: 1, strokeDasharray: '3 6' } },
};

export default function LineTriple({ data = [], currentYear }) {
  // Normaliza semanas 1..52
  const normalized = useMemo(() => {
    const weeks = Array.from({ length: 52 }, (_, i) => String(i + 1));
    const map = new Map((data ?? []).map(d => [String(Number(d.semana)), d]));
    return weeks.map(sem => {
      const r = map.get(sem) || {};
      return {
        semana: sem,
        annio: Number(r?.annio ?? 0),
        annioantes: Number(r?.annioantes ?? 0),
        annioantes2: Number(r?.annioantes2 ?? 0),
      };
    });
  }, [data]);

  // IDs visibles de cada serie
  const ids = useMemo(() => {
    const y = Number(currentYear);
    return Number.isFinite(y)
      ? { y: `${y}`, y1: `${y - 1}`, y2: `${y - 2}` }
      : { y: 'Año actual', y1: 'Año -1', y2: 'Año -2' };
  }, [currentYear]);

  // Datos (el actual va al final para quedar por encima)
  const lineData = useMemo(
    () => [
      { id: ids.y2, data: normalized.map(d => ({ x: d.semana, y: d.annioantes2 })) },
      { id: ids.y1, data: normalized.map(d => ({ x: d.semana, y: d.annioantes })) },
      { id: ids.y, data: normalized.map(d => ({ x: d.semana, y: d.annio })) },
    ],
    [normalized, ids]
  );

  const colorById = useMemo(
    () => ({
      [ids.y]: '#22d3ee', // año actual (cian brillante)
      [ids.y1]: '#22c55e', // año -1 (verde)
      [ids.y2]: '#eab308', // año -2 (amarillo)
    }),
    [ids]
  );
  // Ticks de X cada 4 semanas
  const tickValues = useMemo(
    () => normalized.filter((_, i) => i % 4 === 0).map(d => d.semana),
    [normalized]
  );

  if (!data?.length) {
    return <div style={{ height: 420, display: 'grid', placeItems: 'center', color: '#fff' }}>Sin datos</div>;
  }

  // 🔧 Capa personalizada para controlar grosor y líneas punteadas por serie
  const LinesLayer = ({ series, lineGenerator }) => (
    <g>
      {series.map(serie => {
        const isCurrent = serie.id === ids.y;
        return (
          <path
            key={serie.id}
            d={lineGenerator(serie.data.map(d => d.position))}
            fill="none"
            stroke={colorById[serie.id] || '#fff'}
            strokeWidth={isCurrent ? 5 : 2}             // ← más grueso el actual
            strokeLinejoin="round"
            strokeLinecap="round"
            style={!isCurrent ? { strokeDasharray: '6 6', opacity: 0.9 } : undefined} // ← punteado años previos
          />
        );
      })}
    </g>
  );

  return (
    <div style={{ height: 420 }}>
      <ResponsiveLine
        data={lineData}
        margin={{ top: 20, right: 120, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
        axisBottom={{ legend: 'Semana', legendOffset: 36, legendPosition: 'middle', tickValues }}
        axisLeft={{ legend: 'Casos', legendOffset: -45, legendPosition: 'middle' }}
        enableGridX
        enableGridY

        // Colores para puntos y leyenda
        colors={serie => colorById[serie.id] || '#fff'}

        // Puntos grandes en el año actual
        enablePoints
        pointColor={{ theme: 'background' }}
        pointBorderColor={{ from: 'serieColor' }}

        // Capas: reemplazamos las líneas por nuestra capa personalizada
        layers={[
          'grid', 'markers', 'axes', /* 'areas', */ LinesLayer, 'slices', 'points', 'mesh', 'legends',
        ]}

        useMesh
        theme={darkTheme}

        tooltip={({ point }) => (
          <div style={{ padding: 8, background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,.25)' }}>
            <div><strong>Semana:</strong> {point.data.xFormatted}</div>
            <div style={{ fontWeight: point.serieId === ids.y ? 800 : 600, color: '#111' }}>
              <strong>{point.serieId}:</strong> {point.data.yFormatted}
            </div>
          </div>
        )}

        legends={[
          {
            anchor: 'right',
            direction: 'column',
            translateX: 120,   // ← antes 90, lo alejamos más
            itemWidth: 110,
            itemHeight: 20,
            itemsSpacing: 8,
            symbolSize: 14,
            symbolShape: 'circle',
            itemTextColor: '#fff',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(255,255,255,0.06)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
