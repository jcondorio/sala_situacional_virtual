import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { useMemo } from 'react';

const rawData = [
  { mes: 'Enero', barras: 20, linea1: 12, linea2: 30 },
  { mes: 'Febrero', barras: 40, linea1: 25, linea2: 35 },
  { mes: 'Marzo', barras: 30, linea1: 18, linea2: 32 },
  { mes: 'Abril', barras: 35, linea1: 22, linea2: 40 },
];
const LineBar = ({data}) => {
  
  const lineData = useMemo(
    () => [
      {
        id: 'Línea 1',
        data: rawData.map((d) => ({ x: d.mes, y: d.linea1 })),
      },
      {
        id: 'Línea 2',
        data: rawData.map((d) => ({ x: d.mes, y: d.linea2 })),
      },
    ],
    []
  );

  return (
    <div style={{ height: 400, position: 'relative' }}>
      {/* Gráfico de Barras */}
      <div style={{ height: '100%', position: 'absolute', width: '100%' }}>
        <ResponsiveBar
          data={rawData}
          keys={['barras']}
          indexBy="mes"
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          axisBottom={{ legend: 'Mes', legendPosition: 'middle', legendOffset: 32 }}
          axisLeft={{ legend: 'Valor', legendPosition: 'middle', legendOffset: -40 }}
          enableGridY={false}
        />
      </div>

      {/* Gráficos de Línea */}
      <div style={{ height: '100%', position: 'absolute', width: '100%', pointerEvents: 'none' }}>
        <ResponsiveLine
          data={lineData}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', stacked: false }}
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          colors={{ scheme: 'category10' }}
          enablePoints={true}
          pointSize={8}
          pointBorderWidth={2}
          pointColor={{ theme: 'background' }}
          pointBorderColor={{ from: 'serieColor' }}
          useMesh={false}
          enableGridX={false}
          enableGridY={false}
          isInteractive={false}
        />
      </div>
    </div>
  );
}
export default LineBar;