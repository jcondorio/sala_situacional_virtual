import React from 'react';
import { Typography, Paper } from "@mui/material";

const CsvDataList = ({ csvData, theme }) => {
  const lastTenRows = csvData ? csvData.slice(-10) : [];

  return (
    <>
      <Typography variant="h6">Datos del archivo CSV:</Typography>
      <Paper sx={{ maxHeight: 400, overflow: 'auto', padding: theme.spacing(2) }}>
        <ul>
          {lastTenRows.map((fila, indiceFila) => (
            <li key={indiceFila}>{JSON.stringify(fila)}</li>
          ))}
        </ul>
      </Paper>
    </>
  );
};

export default CsvDataList;
