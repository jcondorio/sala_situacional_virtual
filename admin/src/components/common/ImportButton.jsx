import React from 'react';
import { Button } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../auth/constants";

const ImportButton = ({ csvData, colors, token }) => {
  const importData = async () => {
    try {
      if (csvData) {
        const accessToken = JSON.parse(token).accessToken; // Extraer el accessToken
        const response = await axios.post(
          `${API_URL}/import`,
          csvData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        //console.log("Data imported successfully:", response.data);
      } else {
        //console.log("csvData is empty");
      }
    } catch (error) {
      console.error("Error importing data:", error);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={importData}
      sx={{ backgroundColor: colors.primary[600], color: colors.grey[100] }}
    >
      Importar Datos
    </Button>
  );
};

export default ImportButton;