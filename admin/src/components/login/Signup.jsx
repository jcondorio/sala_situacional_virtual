import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import { API_URL } from "../../auth/constants";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import Header from "../Header";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

const Signup = () => {
  const auth = useAuth();
  const goTo = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleFormSubmit = async (values) => {
    console.log("entrando al registro")
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        goTo("/");
      } else {
        const json = await response.json();
        console.log("Error response:", json);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="100px">
      <Header title="Registro de usuario" subtitle="Registro al evento Experiencias exitosas - Autoevaluación" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ID USUARIO"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.IdUser}
                name="IdUser"
                error={!!touched.IdUser && !!errors.IdUser}
                helperText={touched.IdUser && errors.IdUser}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password" // Cambié a "password" para ocultar la contraseña
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Password}
                name="Password"
                error={!!touched.Password && !!errors.Password}
                helperText={touched.Password && errors.Password}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="DNI"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dni}
                name="dni"
                error={!!touched.dni && !!errors.dni}
                helperText={touched.dni && errors.dni}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.NomUsu}
                name="NomUsu"
                error={!!touched.NomUsu && !!errors.NomUsu}
                helperText={touched.NomUsu && errors.NomUsu}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Primer Apellido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Ape1Usu}
                name="Ape1Usu"
                error={!!touched.Ape1Usu && !!errors.Ape1Usu}
                helperText={touched.Ape1Usu && errors.Ape1Usu}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Segundo Apellido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Ape2Usu}
                name="Ape2Usu"
                error={!!touched.Ape2Usu && !!errors.Ape2Usu}
                helperText={touched.Ape2Usu && errors.Ape2Usu}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Lugar de Estudios"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.OriginUsu}
                name="OriginUsu"
                error={!!touched.OriginUsu && !!errors.OriginUsu}
                helperText={touched.OriginUsu && errors.OriginUsu}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Gmail"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Gmail}
                name="Gmail"
                error={!!touched.Gmail && !!errors.Gmail}
                helperText={touched.Gmail && errors.Gmail}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Teléfono"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Phone}
                name="Phone"
                error={!!touched.Phone && !!errors.Phone}
                helperText={touched.Phone && errors.Phone}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Nuevo Usuario
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp = /^\d{9}$/; // Validación para un número de teléfono de 9 dígitos

const checkoutSchema = yup.object().shape({
  IdUser: yup.string().required("Ingrese un usuario"),
  Password: yup.string().required("Ingrese una contraseña"),
  dni: yup.string().required("Ingrese su DNI"),
  NomUsu: yup.string().required("Ingrese su nombre"),
  Ape1Usu: yup.string().required("Ingrese su primer apellido"),
  Ape2Usu: yup.string().required("Ingrese su segundo apellido"),
  OriginUsu: yup.string().required("Lugar de estudios o público en general"),
  Gmail: yup.string().email("Email no válido").required("Ingese un email"),
  Phone: yup.string().matches(phoneRegExp, "Ingrese un número de celular válido").required("Ingrese un número de celular válido"),
});

const initialValues = {
  IdUser: "",
  Password: "",
  dni: "",
  NomUsu: "",
  Ape1Usu: "",
  Ape2Usu: "",
  OriginUsu: "",
  Gmail: "",
  Phone: ""
};

export default Signup;
