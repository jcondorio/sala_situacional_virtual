import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { tokens } from "../theme";
import { useTheme } from '@emotion/react';

const MyGroupedBarChart = ({ data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // Verificar si los datos están definidos y no están vacíos
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    // Extraer las semanas únicas para usar en la leyenda
    const weeks = Object.keys(data[0]).filter(key => key !== 'year');

    return (
        <div style={{ height: '280px' }}>  {/* Ajusta la altura según tus necesidades */}
            <ResponsiveBar
                data={data}
                theme={{
                    axis: {
                        domain: {
                            line: {
                                stroke: colors.grey[100],
                            },
                        },
                        legend: {
                            text: {
                                fill: colors.grey[100],
                            },
                        },
                        ticks: {
                            line: {
                                stroke: colors.grey[100],
                                strokeWidth: 1,
                            },
                            text: {
                                fill: colors.grey[100],
                            },
                        },
                    },
                    legends: {
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                }}
                keys={weeks}
                indexBy="year"
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                padding={0.01}
                groupMode="grouped"
                colors={['#377eb8']}  // Color azul, puedes cambiarlo por el color que prefieras
                borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'clasificado por años',
                    legendPosition: "middle",
                    legendOffset: 32,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Casos',
                    legendPosition: "middle",
                    legendOffset: -40,
                }}
                enableLabel={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                role="application"
                barAriaLabel={(e) => {
                    return `${e.id}: ${e.formattedValue} in country: ${e.indexValue}`;
                }}
            />
        </div>
    );
};

export default MyGroupedBarChart;
