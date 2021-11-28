import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import md5 from 'js-md5';
// material
import {
  Link,
  Stack,
  TextField,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { validateRut } from '@fdograph/rut-utilities';
import Api from 'src/api/Api';

// ----------------------------------------------------------------------
export default function FormRecuperarContrasena({ setIdUsuario }) {
  const navigate = useNavigate();

  const [alerta, setAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");





  return (
    <Formik
      initialValues={{
        rut: "",
        validarRut: ""
      }}
      validate={(values) => {
        const errors = {};

        if (!values.rut) {
          errors.rut = "Rut Requerido";

        }
        else if (!validateRut(values.rut)) {
          errors.rut = "Rut Inválido";

        }
        else if (!values.validarRut) {
          errors.validarRut = "Verificación Rut Requerida";
        }
        else if (!validateRut(values.validarRut)) {
          errors.validarRut = "Verificación Rut Inválido";
        }
        else if (values.rut !== values.validarRut) {
          errors.validarRut = "Verificación NO Válida";
        }

        return errors;
      }}
      onSubmit={async (values) => {
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
          'abcdefghijklmnopqrstuvwxyz0123456789@#$';

        for (let i = 1; i <= 8; i++) {
          let char = Math.floor(Math.random()
            * str.length + 1);

          pass += str.charAt(char)
        }
        let contrasenaGenerada = pass
        let contrasenaMD5 = md5(contrasenaGenerada);

        const data = await Api.enviarContrasena(values.rut, contrasenaGenerada, contrasenaMD5)
        if (data === -1) {

        }
        else if (data === 401) {

        }
        else if (data === 400) {

        }
        else if (data === 300) {
          setMensajeAlerta("Error en el servidor");
          setAlerta(true);

        }
        else if (!data) {


        }
        else {
          setIdUsuario(data.message)

        }


      }}
    >
      {(props) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* y otras más */
        } = props;
        return (
          <Form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="text"
                label="Rut"
                name="rut"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.rut}
                error={Boolean(touched.rut && errors.rut)}
                helperText={touched.rut && errors.rut}

              />

              <TextField
                fullWidth
                type="text"
                label="Validar Rut"
                name="validarRut"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.validarRut}
                error={Boolean(touched.validarRut && errors.validarRut)}
                helperText={touched.validarRut && errors.validarRut}

              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>

              <Link component={RouterLink} variant="subtitle2" to="/login">
                Iniciar Sesión
              </Link>
            </Stack>

            {alerta && <Alert severity="error">{mensajeAlerta}</Alert>}

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Enviar Contraseña Provisoria
            </LoadingButton>
          </Form>
        );
      }}
    </Formik>

  );
}
