// Instalar el paquete de Nivo Stream
// yarn add @nivo/stream

import React from 'react';
import { ResponsiveStream } from '@nivo/stream';
//import dataEndemico from "../data/dataEndemico";

// Asegúrate de que el contenedor padre tenga una altura definida,
// de lo contrario, el gráfico no se renderizará.
const dataEndemico = [
    {
        "Raoul": 117,
        "Josiane": 14,
        "Marcel": 28,
        "René": 186,
        "Paul": 169,
        "Jacques": 130
    },
    {
        "Raoul": 183,
        "Josiane": 37,
        "Marcel": 24,
        "René": 72,
        "Paul": 148,
        "Jacques": 125
    },
    {
        "Raoul": 13,
        "Josiane": 173,
        "Marcel": 163,
        "René": 68,
        "Paul": 52,
        "Jacques": 16
    },
    {
        "Raoul": 54,
        "Josiane": 157,
        "Marcel": 76,
        "René": 30,
        "Paul": 187,
        "Jacques": 181
    },
    {
        "Raoul": 141,
        "Josiane": 180,
        "Marcel": 72,
        "René": 194,
        "Paul": 62,
        "Jacques": 116
    },
    {
        "Raoul": 51,
        "Josiane": 19,
        "Marcel": 183,
        "René": 178,
        "Paul": 35,
        "Jacques": 48
    },
    {
        "Raoul": 139,
        "Josiane": 79,
        "Marcel": 108,
        "René": 19,
        "Paul": 171,
        "Jacques": 43
    },
    {
        "Raoul": 139,
        "Josiane": 124,
        "Marcel": 56,
        "René": 185,
        "Paul": 117,
        "Jacques": 65
    },
    {
        "Raoul": 197,
        "Josiane": 65,
        "Marcel": 119,
        "René": 65,
        "Paul": 76,
        "Jacques": 184
    }
];
const MyResponsiveStream = () => (

    
    <ResponsiveStream
        data={dataEndemico}
        keys={['Raoul', 'Josiane', 'Marcel', 'René', 'Paul', 'Jacques']}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: 36,
            truncateTickAt: 0
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: -40,
            truncateTickAt: 0
        }}
        enableGridX={true}
        enableGridY={false}
        offsetType="silhouette"
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.85}
        borderColor={{ theme: 'background' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#2c998f',
                size: 4,
                padding: 2,
                stagger: true
            },
            {
                id: 'squares',
                type: 'patternSquares',
                background: 'inherit',
                color: '#e4c912',
                size: 6,
                padding: 2,
                stagger: true
            }
        ]}
        fill={[
            {
                match: {
                    id: 'Paul'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'Marcel'
                },
                id: 'squares'
            }
        ]}
        dotSize={8}
        dotColor={{ from: 'color' }}
        dotBorderWidth={2}
        dotBorderColor={{
            from: 'color',
            modifiers: [['darker', 0.7]]
        }}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                translateX: 100,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000000'
                        }
                    }
                ]
            }
        ]}
    />
);

export default MyResponsiveStream;
