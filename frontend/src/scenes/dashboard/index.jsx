import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { TextField, Button, Box, Typography } from '@mui/material';

const Dashboard = () => {
  const [inputValue, setInputValue] = useState('');
  const [qrValue, setQrValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleGenerate = () => {
    setQrValue(inputValue);
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4">Generador de Código QR</Typography>
      <TextField
        label="Ingrese texto o URL"
        variant="outlined"
        value={inputValue}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleGenerate}>
        Generar QR
      </Button>
      {qrValue && (
        <Box mt={4}>
          <QRCodeSVG value={qrValue} size={256} />
          <Typography variant="body1" mt={2}>
            Código QR generado para: {qrValue}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
