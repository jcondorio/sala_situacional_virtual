import React from 'react';
import { Box } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material';

// Datos de ejemplo para el gráfico de barras
const barData = [
    { week: 'Week 1', value1: 120, value2: 150 },
    { week: 'Week 2', value1: 200, value2: 180 },
    { week: 'Week 3', value1: 300, value2: 220 },
    { week: 'Week 4', value1: 250, value2: 190 },
    { week: 'Week 5', value1: 400, value2: 230 },
];

// Datos de ejemplo para el gráfico de líneas
const lineData = [
    {
        id: 'Trend A',
        color: 'hsl(212, 70%, 50%)',
        data: [
            { x: 'Week 1', y: 130 },
            { x: 'Week 2', y: 170 },
            { x: 'Week 3', y: 210 },
            { x: 'Week 4', y: 190 },
            { x: 'Week 5', y: 250 },
        ],
    },
    {
        id: 'Trend B',
        color: 'hsl(125, 70%, 50%)',
        data: [
            { x: 'Week 1', y: 100 },
            { x: 'Week 2', y: 150 },
            { x: 'Week 3', y: 180 },
            { x: 'Week 4', y: 160 },
            { x: 'Week 5', y: 210 },
        ],
    },
];

const CombinedChart = () => {
    const theme = useTheme();
    const colors = {
        axis: {
            domain: {
                line: {
                    stroke: theme.palette.grey[100],
                },
            },
            legend: {
                text: {
                    fill: theme.palette.grey[100],
                },
            },
            ticks: {
                line: {
                    stroke: theme.palette.grey[100],
                    strokeWidth: 1,
                },
                text: {
                    fill: theme.palette.grey[100],
                },
            },
        },
        legends: {
            text: {
                fill: theme.palette.grey[100],
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

    return (
        <Box position="relative" width="100%" height="400px">
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <ResponsiveBar
                    data={barData}
                    keys={['value1', 'value2']}
                    indexBy="week"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'nivo' }}
                    borderColor={{ from: 'color', modifiers: [['darker', '1.6']] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Semanas epidemiológicas',
                        legendPosition: 'middle',
                        legendOffset: 36,
                        legendTextColor: theme.palette.grey[100],
                        tickTextColor: theme.palette.grey[100],
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Casos',
                        legendPosition: 'middle',
                        legendOffset: -40,
                        legendTextColor: theme.palette.grey[100],
                        tickTextColor: theme.palette.grey[100],
                    }}
                    enableLabel={false}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1,
                                    },
                                },
                            ],
                        },
                    ]}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    role="application"
                    barAriaLabel={(e) => {
                        return `${e.id}: ${e.formattedValue} in week: ${e.indexValue}`;
                    }}
                />
            </div>
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <ResponsiveLine
                    data={lineData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Semanas epidemiológicas',
                        legendOffset: 36,
                        legendTextColor: theme.palette.grey[100],
                        tickTextColor: theme.palette.grey[100],
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Tendencia',
                        legendOffset: -40,
                        legendTextColor: theme.palette.grey[100],
                        tickTextColor: theme.palette.grey[100],
                    }}
                    colors={{ scheme: 'nivo' }}
                    lineWidth={2}
                    enablePoints={false}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1,
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </div>
        </Box>
    );
};

export default CombinedChart;
