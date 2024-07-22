import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect } from "react";

const BarSimpleChart = ({ data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        console.log("pum;", data[0].SEMANA);
    }, [data]);

    if (!data) {
        return <div>No hay datos disponibles</div>;
    }

    return (
        <div style={{ height: '280px' }}> 
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
                tooltip: {
                    container: {
                        background: '#333',
                        color: '#ddd',
                        fontSize: '13px',
                        borderRadius: '2px',
                        boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
                        padding: '5px 9px',
                    },
                    basic: {
                        whiteSpace: 'pre',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    table: {},
                    tableCell: {
                        padding: '3px 5px',
                    },
                },
            }}
            keys={Object.keys(data[0]).filter((key) => key !== "SEMANA")}
            indexBy={(item) => item.SEMANA}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}

             groupMode="grouped"
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "nivo" }}
            borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Semanas epidemiologicas',
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
            legends={[
                {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: "hover",
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
                return `${e.id}: ${e.formattedValue} in country: ${e.indexValue}`;
            }}
        />
        </div> 
        
    );
};

export default BarSimpleChart;