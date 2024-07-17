import React from 'react';
import { Button } from "@mui/material";
import CSVReader from 'react-csv-reader';

const CsvReader = ({ setCsvData, colors }) => {
  const handleFile = (data) => {
    const headers = data[0];
    const rows = data.slice(1);
    const formattedData = rows.reduce((acc, row) => {
      if (row.length === headers.length) {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        acc.push(obj);
      } else {
        console.warn(`Ignoring row: ${row} - mismatch with headers`);
      }
      return acc;
    }, []);
    setCsvData(formattedData);
  };

  return (
    <>
      <CSVReader
        onFileLoaded={handleFile}
        inputId="csv-input"
        inputStyle={{ display: 'none' }}
        inputProps={{ accept: ".csv" }}
      />
      <label htmlFor="csv-input">
        <Button
          variant="contained"
          component="span"
          sx={{ backgroundColor: colors.primary[600], color: colors.grey[100] }}
        >
          Subir Archivo CSV
        </Button>
      </label>
    </>
  );
};

export default CsvReader;