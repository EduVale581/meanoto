import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Form, Formik } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import trashFill from '@iconify/icons-eva/trash-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { validateRut } from '@fdograph/rut-utilities';
import Api from '../../../api/Api';
import md5 from 'js-md5';

// ----------------------------------------------------------------------

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};
export default function RegisterForm() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [archivo, setArchivo] = useState(false);

  async function uploadFile(numMatriculaAlumno) {
    try {
      await Api.dbx.filesUpload({
        path: "/CertificadosAlumnoRegular/" + numMatriculaAlumno + ".pdf",
        contents: archivo,
        mode: "overwrite",
      });
      // si es que se sube bien, no devuelve la URL
      try {
        const shareResponse = await Api.dbx.sharingCreateSharedLinkWithSettings({
          path: "/CertificadosAlumnoRegular/" + numMatriculaAlumno + ".pdf",
        });
        let url = shareResponse.result.url;
        return url;
      } catch (ex) {
        const { url } = ex.error.error.shared_link_already_exists.metadata;
        return url;
      }
    } catch (ex) {
      return -1;
    }
  }


  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,

  } = useDropzone({
    accept: 'application/pdf',
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && file.type && file.type === "application/pdf") {
        setArchivo(file);

      }
      else {
        setArchivo(null);

      }

    }
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);



  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Formik
      initialValues={{
        rut: "",
        password: "",
        nombre: "",
        apellidos: "",
        numMatricula: "",
        correo: "",
        veriPassword: "",
      }}
      validate={(values) => {
        const errors = {};

        if (!values.nombre) {
          errors.nombre = "Nombre Requerido";
        }
        else if (!values.apellidos) {
          errors.apellidos = "Apellidos Requerido";
        }
        else if (!values.numMatricula) {
          errors.numMatricula = "Numero Matricula Requerido";
        }
        else if (!values.rut) {
          errors.rut = "Rut Requerido";

        }
        else if (values.rut.includes(".") | values.rut.includes("-")) {
          errors.rut = "El rut no debe tener puntos ni guión.";

        }
        else if (!validateRut(values.rut)) {
          errors.rut = "Rut Invalido";

        }
        else if (values.correo.includes("@") | values.correo.includes(".")) {
          errors.correo = "Correo invalido.";

        }
        else if (!values.correo) {
          errors.correo = "Correo Requerido";
        }
        else if (!values.password) {
          errors.password = "Contraseña Requerida";
        }
        else if (!values.veriPassword) {
          errors.password = "Verificación de contraseña Requerida";
        }
        else if (values.veriPassword !== values.password) {
          errors.veriPassword = "Las contraseñas no coinciden";
        }

        return errors;
      }}
      onSubmit={async (values) => {


        const contrasenaEncriptada = md5(values.password);

        let linkArchivo = await uploadFile(values.numMatricula);

        let estudiante = {
          nombre: values.nombre,
          apellido: values.apellidos,
          carrera: "",
          contrasena: contrasenaEncriptada,
          correo: values.correo + "@alumnos.utalca.cl",
          facultad: "",
          matricula: values.numMatricula,
          rut: values.rut,
          modulos: [],
          url_doc_alumno_reg: linkArchivo,
          eventos: [],
          tipo_usuario: "ESTUDIANTE"

        }

        if (archivo) {

          const data = await Api.registroEstudiante(estudiante);
          if (data === -1) {

          }
          else if (data === 401) {

          }
          else if (data === 400) {

          }
          else if (data === 300) {
            /*usuario ya existe validado*/

          }
          else if (!data) {

          }
          else {
            navigate('/login', { replace: true });

          }

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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  type="text"
                  label="Nombre"
                  name="nombre"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nombre}
                  error={Boolean(touched.nombre && errors.nombre)}
                  helperText={touched.nombre && errors.nombre}
                />

                <TextField
                  fullWidth
                  type="text"
                  label="Apellidos"
                  name="apellidos"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.apellidos}
                  error={Boolean(touched.apellidos && errors.apellidos)}
                  helperText={touched.apellidos && errors.apellidos}
                />
              </Stack>

              <TextField
                fullWidth
                label="Número Matrícula"
                name="numMatricula"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.numMatricula}
                error={Boolean(touched.numMatricula && errors.numMatricula)}
                helperText={touched.numMatricula && errors.numMatricula}

              />

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
                label="Correo"
                type="text"
                name="correo"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.correo}
                error={Boolean(touched.correo && errors.correo)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">@alumnos.utalca.cl</InputAdornment>
                  )
                }}
                helperText={touched.correo && errors.correo}
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

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Verificación Contraseña"
                name="veriPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.veriPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.veriPassword && errors.veriPassword)}
                helperText={touched.veriPassword && errors.veriPassword}
              />

              <div className="container">
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  <p>Arrastre y suelte certificado de alumno regular, o haga clic para seleccionar el certificado</p>
                  <em>(1 archivo permitido en formato pdf)</em>
                </div>
                <aside>
                  {archivo && archivo.type && (
                    <Grid container>
                      <Grid item xs={10} md={10}>
                        <Typography
                          variant="p"
                        >
                          {archivo.path} - {archivo.size} bytes
                        </Typography>
                      </Grid>
                      <Grid item xs={2} md={2} style={{ textAlign: "center" }}>
                        <IconButton
                          onClick={() => { setArchivo(null) }}
                        >
                          <Icon icon={trashFill} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  )}
                </aside>
              </div>




            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            </Stack>

            {archivo && archivo.type ? (
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Regístrate
              </LoadingButton>

            ) : (
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled
              >
                Regístrate
              </LoadingButton>

            )
            }


          </Form>
        );
      }
      }
    </ Formik >

    /*<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Nombre"
          {...getFieldProps('firstName')}
          error={Boolean(touched.firstName && errors.firstName)}
          helperText={touched.firstName && errors.firstName}
        />

        <TextField
          fullWidth
          label="Apellidos"
          {...getFieldProps('lastName')}
          error={Boolean(touched.lastName && errors.lastName)}
          helperText={touched.lastName && errors.lastName}
        />
      </Stack>*/
  );
}
