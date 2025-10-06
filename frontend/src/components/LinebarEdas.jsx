import { Box, Typography, FormControl, InputLabel, MenuItem, Select, Button } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import axios from "axios";
import { serviceEstrablecimientos, serviceMicroRed } from "../services/irasServices";

const LinebarEdas = ({
    weekLabel = "2025 - SE 37",
    initial = {},
    onChange,
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [form, setForm] = useState({
        diris: "...",
        red: "...",
        microred: "...",
        establecimiento: "...",
        indicador: "...",
    });
    const [microred, setMicrored] = useState([]); // <- inicializar como array
    // form y setForm supongo que ya existen en tu componente
    const [establecimientos, setEstablecimientos] = useState([]);

    const handleChange = async (field, value) => {
        //console.log("que pasa", field, value);

        // Construimos el form actualizado localmente y lo seteamos
        const updated = { ...form, [field]: value };

        // Si cambias la red, limpiamos microred y establecimiento
        if (field === "red") {
            updated.microred = "";         // o null según tu convención
            updated.establecimiento = "";  // o null según tu convención

            // limpiamos los listados dependientes
            setMicrored([]);
            setEstablecimientos([]);
        }

        // Si cambias la microred, limpiamos establecimiento
        if (field === "microred") {
            updated.establecimiento = "";  // o null
            setEstablecimientos([]);       // opcional: si quieres borrar la lista al cambiar microred
        }

        // Actualiza el estado del form (usa el updated para notificar al parent)
        setForm(updated);
        onChange?.(updated);
        console.log("form (updated):", updated);

        // Ahora realizamos las llamadas asincrónicas según el field,
        // utilizando el `updated` local para obtener valores consistentes.
        if (field === "red") {
            try {
                const response2 = await serviceMicroRed(value);
                const arr = Array.isArray(response2) ? response2 : [response2].filter(Boolean);

                const names = arr
                    .map((d) => {
                        if (!d) return null;
                        if (typeof d === "string") return d.trim();
                        if (typeof d === "object" && "N_Micro_RED" in d) return String(d.N_Micro_RED).trim();
                        return null;
                    })
                    .filter(Boolean);

                const uniqueNames = Array.from(new Set(names));
                setMicrored(uniqueNames);
                console.log("microredes normalizadas:", uniqueNames);
            } catch (error) {
                console.error("Error al cargar microredes:", error);
                setMicrored([]);
            }
        } else if (field === "microred") {
            try {
                // usamos updated.red (la red actualizada) y value (la microred nueva)
                const response2 = await serviceEstrablecimientos(updated.red, value);
                const arr = Array.isArray(response2) ? response2 : [response2].filter(Boolean);

                const names = arr
                    .map((d) => {
                        if (!d) return null;
                        if (typeof d === "string") return d.trim();
                        if (typeof d === "object" && "N_EESS" in d) return String(d.N_EESS).trim();
                        return null;
                    })
                    .filter(Boolean);

                const uniqueNames = Array.from(new Set(names));
                setEstablecimientos(uniqueNames);
                console.log("establecimientos normalizados:", uniqueNames);
            } catch (error) {
                console.error("Error al cargar establecimientos:", error);
                setEstablecimientos([]);
            }
        } else if (field === "establecimiento") {
            // Si necesitas hacer algo cuando se selecciona establecimiento, agrégalo aquí
        }
    };


    return (
        <>
        <Box width="170px">
            {/* Tarjeta Semana */}
            <Box
                sx={{
                    borderRadius: "8px",
                    border: `1px solid ${colors.grey[400]}`,
                    bgcolor: colors.primary[400],
                    p: 2,
                    mb: 2,
                }}
            >
                <Typography variant="body2" color={colors.grey[100]}>
                    Consulta epidemiologica
                </Typography>
            </Box>

            {/* Panel de filtros */}
            <Box
                sx={{
                    borderRadius: "8px",
                    border: `1px solid ${colors.grey[400]}`,
                    bgcolor: colors.primary[400],
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                <FormControl fullWidth size="small">
                    <InputLabel>Red</InputLabel>
                    <Select
                        value={form.red || '...'}  // Establece "..." como valor inicial
                        onChange={(e) => handleChange("red", e.target.value)}
                    >
                        <MenuItem value="...">...</MenuItem>  // Muestra los tres puntos
                        <MenuItem value="RED DE SALUD TAC">RED DE SALUD TACNA</MenuItem>
                        <MenuItem value="DIRESA TACNA">DIRESA TACNA</MenuItem>
                        <MenuItem value="todo">Todo</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Microred</InputLabel>
                    <Select
                        value={form.microred} // evita undefined
                        label="Microred"
                        onChange={(e) => handleChange("microred", e.target.value)}
                    >
                        {Array.isArray(microred) && microred.length > 0 ? (
                            microred.map((m, idx) => (
                                <MenuItem key={`${m}-${idx}`} value={m}>
                                    {m}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>…</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Establecimiento</InputLabel>

                    <Select
                        value={form.establecimiento} // evita undefined
                        label="Microred"
                        onChange={(e) => handleChange("establecimiento", e.target.value)}
                    >
                        {Array.isArray(establecimientos) && establecimientos.length > 0 ? (
                            establecimientos.map((m, idx) => (
                                <MenuItem key={`${m}-${idx}`} value={m}>
                                    {m}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>…</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Indicador</InputLabel>
                    <Select
                        value={form.indicador}
                        onChange={(e) => handleChange("indicador", e.target.value)}
                    >
                        <MenuItem value="DAA_C1">EDAs {"<"} año </MenuItem>
                        <MenuItem value="DAA_C1_4">EDAs 1 A 4 años</MenuItem>
                        <MenuItem value="DAA_C5">EDAs 5 años</MenuItem>
                        <MenuItem value="DAA_C5_11">EDAs 5 a 11 años</MenuItem>
                        <MenuItem value="DAA_C12_17">EDAs 12 a 17 años</MenuItem>
                        <MenuItem value="DAA_C18_29">EDAs 18 a 29 años</MenuItem>
                        <MenuItem value="DAA_C30_59">EDAs 30 a 59 años</MenuItem>
                        <MenuItem value="DAA_C60">EDAs 60 a mas</MenuItem>
                        <MenuItem value="total edas">EDAs total</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
        </>
    );
};

export default LinebarEdas;
