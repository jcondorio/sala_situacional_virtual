// src/components/login/Login.jsx
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import tema from '../../assets/images/tema-epidemiologia.png';
import deepi from '../../assets/images/deepi.png';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/authProvider';
import { API_URL } from '../../auth/constants';
import { Link } from 'react-router-dom';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" to="https://yourwebsite.com/">
                Johan-Studios
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorResponse, setErrorResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const goTo = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/login/admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName,
            password,
          }),
        });
    
        if (response.ok) {
          const json = await response.json();
          if (json.body.accessToken && json.body.refreshToken) {
            auth.saveUser(json);
            console.log("pasa por aquisdadas")
            goTo('/contacts');
          }
        } else {
          // En caso de credenciales incorrectas, mostramos un mensaje al usuario
          const json = await response.json();
  
          setErrorResponse("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (auth.isAuthenticated) {
      return <Navigate to="/contacts" />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs"

            >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3 )), url(${tema})`, 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        color: 'white',
                    }}
                >
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '20px',
                            borderRadius: '10px',
                        }}
                    >
                        <Avatar sx={{ width: 100, height: 100, bgcolor: 'secondary.main' }}>
                            <img
                                alt="profile-user"
                                src={deepi}
                                style={{ cursor: 'pointer', borderRadius: '50%', width: '100%', height: '100%' }}
                            />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Iniciar sesión
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="userName"
                                label="Direccion de correo electronico"
                                name="userName"
                                autoComplete="userName"
                                autoFocus
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                INICIAR SESIÓN
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link to="#" variant="body2">
                                        Olvidaste tu contraseña?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link to="/signup" variant="body2">
                                        {"No tienes cuenta?, inscrirse"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>


                </Box>

                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
