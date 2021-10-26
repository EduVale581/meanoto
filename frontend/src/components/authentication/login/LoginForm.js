import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
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

// ----------------------------------------------------------------------
const API = "http://127.0.0.1:8000";
export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


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
        const resp = await fetch(`${API}/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rut: values.rut, password: values.password })
        })
        if (!resp.ok) throw Error("Hubo un problema en la solicitud de inicio de sesión.")

        if (resp.status === 401) {
          throw ("Credenciales no válidas")
        }
        else if (resp.status === 400) {
          throw ("Formato de correo electrónico o contraseña no válidos")
        }
        const data = await resp.json()
        window.localStorage.setItem("token", data.token)
        window.localStorage.setItem("user", JSON.stringify(data.user_id))
        navigate('/dashboard', { replace: true });
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

              <Link component={RouterLink} variant="subtitle2" to="#">
                Recuperar Contraseña?
              </Link>
            </Stack>

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
