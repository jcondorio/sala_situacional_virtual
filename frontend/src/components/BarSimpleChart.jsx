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
        <div style={{ height: '100%', width: '100%'}}> 
            <div style={{ height: '100%', width: '100%' }}>
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
                    indexBy="SEMANA"
                    padding={0.3}
                    groupMode="grouped"
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={{ scheme: "nivo" }}
                    borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
                    axisTop={null}
                    axisRight={null}
                    margin={{ top: 40, right: 80, bottom: 50, left: 60 }}

                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Semanas epidemiológicas',
                        legendOffset: 36,
                        legendTextColor: theme.palette.grey[100],  // Color del texto de la leyenda del eje X
                        tickTextColor: theme.palette.grey[100],     // Color del texto de las etiquetas del eje X
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'CASOS',
                        legendOffset: -40,
                        legendTextColor: theme.palette.grey[100],  // Color del texto de la leyenda del eje Y
                        tickTextColor: theme.palette.grey[100],     // Color del texto de las etiquetas del eje Y
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
        </div>
    );
};

export default BarSimpleChart;
