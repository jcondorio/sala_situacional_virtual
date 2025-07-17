import React from 'react';
import { ResponsiveStream } from '@nivo/stream';
import { useTheme } from "@mui/material";

const MyResponsiveStream = ({ datosEnd }) => {
    const theme = useTheme();

    const themeNivo = {
        axis: {
            domain: { line: { stroke: 'rgba(0,0,0,0)' } },
            legend: { text: { fill: 'rgba(0,0,0,0)' } },
            ticks: {
                line: { stroke: 'rgba(0,0,0,0)', strokeWidth: 1 },
                text: { fill: 'rgba(0,0,0,0)' },
            },
        },
        legends: {
            text: { fill: theme.palette.grey[100] },
        },
        tooltip: {
            container: {
                background: '#333',
                color: '#ddd',
                fontSize: '13px',
                borderRadius: '2px',
                boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
                padding: '5px 9px',
            },
        },
    };

    if (!datosEnd || datosEnd.length === 0) {
        return <div>No hay datos disponibles</div>;
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ResponsiveStream
                data={datosEnd}
                keys={['zona_exitosa', 'zona_segura', 'zona_alarma', 'zona_epidemia']}
                indexBy="semana"
                normalize={false}
                offsetType="none"
                minValue={0}
                maxValue={1200}
                margin={{ top: 50, right: 95, bottom: 50, left: 60 }}
                axisTop={null}
                axisRight={null}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Casos',
                    legendOffset: -40,
                    legendPosition: 'middle',
                }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Semana',
                    legendOffset: 36,
                    legendPosition: 'middle',
                }}
                enableGridX={false}
                enableGridY={true}
                colors={['white', 'green', 'yellow', 'red']}
                fillOpacity={0.85}
                curve="linear"
                borderColor={{ theme: 'background' }}
                theme={themeNivo}
                tooltip={({ indexValue, data }) => (
                    <div style={{ color: '#fff' }}>
                        <strong>Semana:</strong> {indexValue}<br />
                        <strong>Zona Exitosa:</strong> {data.zona_exitosa}<br />
                        <strong>Zona Segura:</strong> {data.zona_segura}<br />
                        <strong>Zona de Alarma:</strong> {data.zona_alarma}<br />
                        <strong>Zona de Epidemia:</strong> {data.zona_epidemia}
                    </div>
                )}
                legends={[
    {
        anchor: 'bottom-right',
        direction: 'column',
        translateX: 130, // ← Aumentado de 100 a 120
        itemWidth: 120,
        itemHeight: 20,
        itemTextColor: theme.palette.grey[100],
        symbolSize: 12,
        symbolShape: 'circle',
        effects: [
            {
                on: 'hover',
                style: {
                    itemTextColor: '#000',
                },
            },
        ],
        data: [
            { id: 'zona_exitosa', label: 'Zona Exitosa' },
            { id: 'zona_segura', label: 'Zona Segura' },
            { id: 'zona_alarma', label: 'Zona de Alarma' },
            { id: 'zona_epidemia', label: 'Zona de Epidemia' },
        ],
    },
]}
            />
        </div>
    );
};

export default MyResponsiveStream;
