import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import md5 from 'js-md5';
// material
import {
  Link,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { validateRut } from '@fdograph/rut-utilities';
import Api from 'src/api/Api';
import Alerta from 'src/components/Alerta';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [varianteAlerta, setVarianteAlerta] = useState("");


  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Formik
      initialValues={{
        rut: "",
        password: ""
      }}
      validate={(values) => {
        const errors = {};

        if (!values.rut) {
          errors.rut = "Rut Requerido";

        }
        else if (!validateRut(values.rut)) {
          errors.rut = "Rut Invalido";

        }
        else if (!values.password) {
          errors.password = "Contraseña Requerida";
        }

        return errors;
      }}
      onSubmit={async (values) => {
        const contrasena = md5(values.password)

        const data = await Api.obtenerToken(values.rut, contrasena)
        if (data === -1) {

        }
        else if (data === 401) {

        }
        else if (data === 400) {

        }
        else if (data === 300) {
          setMensajeAlerta("Usuario o contraseña invalida");
          setVarianteAlerta("error");
          setMostrarAlerta(true)
          /*usuario no validado*/

        }
        else if (!data) {
          setMensajeAlerta("Usuario o contraseña invalida");
          setVarianteAlerta("error");
          setMostrarAlerta(true)

        }
        else {
          window.localStorage.setItem("token", data.token)
          window.localStorage.setItem("user", data.user_id)
          navigate('/dashboard', { replace: true });

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
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>

              <Link component={RouterLink} variant="subtitle2" to="/recuperar">
                ¿Recuperar Contraseña?
              </Link>
            </Stack>

            {mostrarAlerta && <Alerta mensaje={mensajeAlerta} variante={varianteAlerta} />}

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Ingresar
            </LoadingButton>
          </Form>
        );
      }}
    </Formik>

  );
}
