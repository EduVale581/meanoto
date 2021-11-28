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
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { validateRut } from '@fdograph/rut-utilities';
import Api from 'src/api/Api';
import md5 from 'js-md5';

// ----------------------------------------------------------------------

export default function FormCambiarClave({ id }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [alerta, setAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");


  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Formik
      initialValues={{
        provisoria: "",
        contrasena: "",
        validarContrasena: ""
      }}
      validate={(values) => {
        const errors = {};

        if (!values.provisoria) {
          errors.provisoria = "Contraseña Provisoria Requerida";

        }
        else if (!values.contrasena) {
          errors.contrasena = "Contraseña Requerida";

        }
        else if (!values.validarContrasena) {
          errors.validarContrasena = "Verificación Contraseña Requerida";
        }

        return errors;
      }}
      onSubmit={async (values) => {
        const provisoria = md5(values.provisoria);
        const contra = md5(values.contrasena);

        if (id) {
          const data = await Api.cambiarContrasena(id, provisoria, contra)
          if (data === -1) {
            setMensajeAlerta("Error en el servidor");
            setAlerta(true);

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
            navigate('/login', { replace: true });

          }


        }
        else {
          setMensajeAlerta("Error en el servidor");
          setAlerta(true);
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
                type={showPassword ? 'text' : 'password'}
                label="Contraseña Provisoria"
                name="provisoria"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.provisoria}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.provisoria && errors.provisoria)}
                helperText={touched.provisoria && errors.provisoria}
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                name="contrasena"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contrasena}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.contrasena && errors.contrasena)}
                helperText={touched.contrasena && errors.contrasena}
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Validar Contraseña"
                name="validarContrasena"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.validarContrasena}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.validarContrasena && errors.validarContrasena)}
                helperText={touched.validarContrasena && errors.validarContrasena}
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
              Cambiar Contraseña
            </LoadingButton>
          </Form>
        );
      }}
    </Formik>

  );
}
