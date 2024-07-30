import React from 'react';
import { ResponsiveStream } from '@nivo/stream';
import { useTheme } from "@mui/material";

const MyResponsiveStream = ({ datosEnd }) => {
    const theme = useTheme();
    const colors = {
        axis: {
            domain: {
                line: {
                    stroke: 'transparent',  // Hacer las líneas de dominio transparentes
                },
            },
            legend: {
                text: {
                    fill: 'transparent',  // Hacer el texto de las leyendas transparente
                },
            },
            ticks: {
                line: {
                    stroke: 'transparent',  // Hacer las líneas de los ticks transparentes
                },
                text: {
                    fill: 'transparent',  // Hacer el texto de los ticks transparente
                },
            },
        },
        legends: {
            text: {
                fill: 'transparent',  // Hacer el texto de las leyendas transparente
            },
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

    if (!datosEnd) {
        return <div>No hay datos disponibles</div>;
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ResponsiveStream
                data={datosEnd}
                keys={['ic_inf', 'media_ic_inf', 'media_ic_sup']}
                margin={{ top: 50, right: 95, bottom: 50, left: 60 }}
                axisTop={null}
                axisRight={null}
                enableGridX={false}
                enableGridY={false}
                offsetType="diverging"
                colors={['white', 'green', 'yellow']}
                fillOpacity={0.85}
                curve="linear"
                borderColor={{ theme: 'background' }}
                theme={colors}  // Aplicar el tema
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        translateX: 100,
                        itemWidth: 80,
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
                    },
                ]}
            />
        </div>
    );
};

export default MyResponsiveStream;
