import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect } from "react";

const BarSimpleChartEndemico = ({ data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        if (data?.length > 0) {
            console.log("Semana inicial:", data[0].SEMANA);
        }
    }, [data]);

    if (!data || data.length === 0) {
        return <div>No hay datos disponibles</div>;
    }

    // 🧠 Obtener claves (sin "SEMANA")
    const claves = Object.keys(data[0]).filter(key => key !== "SEMANA");

    // 📦 Mapa de semanas reales por número
    const mapaSemanas = {};
    data.forEach(d => {
        const semana = parseInt(d.SEMANA, 10);
        if (!isNaN(semana) && semana >= 1 && semana <= 53) {
            mapaSemanas[semana] = d;
        }
    });

    // 🧩 Generar data para semanas 1 a 53, completando las faltantes con 0
    const dataCompleta = Array.from({ length: 53 }, (_, i) => {
        const semana = i + 1;
        const original = mapaSemanas[semana];
        const base = { SEMANA: semana.toString() };

        claves.forEach(key => {
            base[key] = original ? Number(original[key]) || 0 : 0;
        });

        return base;
    });

    // 📊 Calcular valor máximo para eje Y
    const valores = dataCompleta.flatMap(d =>
        claves.map(key => Number(d[key]) || 0)
    );
    const maxY = Math.max(...valores, 1245);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ResponsiveBar
                data={dataCompleta}
                keys={claves}
                indexBy="SEMANA"
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: "linear", min: 0, max: maxY }}
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
                    legendTextColor: theme.palette.grey[100],
                    tickTextColor: theme.palette.grey[100],
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'CASOS',
                    legendOffset: -40,
                    legendTextColor: theme.palette.grey[100],
                    tickTextColor: theme.palette.grey[100],
                }}
                enableLabel={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                enableGridX={false}
                enableGridY={false}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                role="application"
                barAriaLabel={e => `${e.id}: ${e.formattedValue} en semana: ${e.indexValue}`}
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
                        tableCell: {
                            padding: '3px 5px',
                        },
                    },
                }}
            />
        </div>
    );
};

export default BarSimpleChartEndemico;
