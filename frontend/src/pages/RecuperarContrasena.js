import React, { useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
import FormRecuperarContrasena from '..//components/FormRecuperarContrasena';
import FormCambiarClave from "src/components/FormCambiarClave";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function RecuperarContrasena() {
  const [idUsuario, setIdUsuario] = useState(null);
  return (
    <RootStyle title="MeAnoto">
      <AuthLayout>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Recuperar Contraseña
            </Typography>
          </Stack>


          {idUsuario ? (<FormCambiarClave id={idUsuario} />) : (<FormRecuperarContrasena setIdUsuario={setIdUsuario} />)}

          <MHidden width="smUp">

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              <Link variant="subtitle2" component={RouterLink} to="login">
                Iniciar Sesión
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
