import React from 'react';
import Log_in from '../components/login/Login.jsx';
import tema from '../assets/images/diresa_tacna.jpeg';

const Login = () => {
    return (
        <div
            style={{
                backgroundImage: `url(${tema})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh', // Ajusta esto según sea necesario
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                
            }}
        >
            <Log_in />
        </div>
    );
}

export default Login;
