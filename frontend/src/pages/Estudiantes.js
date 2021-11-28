import React, { useRef, useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { filter } from "lodash";
import {
  Card,
  Container,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Stack,
  Typography,
  IconButton,
  Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import * as locales from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import { useUsuario } from '../context/usuarioContext';
import TablaToolbarEstudiante from "../components/estudiantes/TablaToolbarEstudiante";
import TablaHeadEstudiante from "../components/estudiantes/TablaHeadEstudiante";
import Api from "src/api/Api";
import ModalEditarEstudiante from "src/components/estudiantes/ModalEditarEstudiante";

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_el) => {
      return (
        _el.nombreEstudiante.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _el.correo.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _el.numMatricula.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _el.facultad.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _el.carrera.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Estudiantes() {
  const isMounted = useRef(true);
  const { user, setUser, setCargandoUsuario, cargandoUsuario } = useUsuario();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("nombreEstudiante");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locale] = useState("esES");
  const [estudiantes, setEstudiantes] = useState([]);
  const tableHead = useState(defineTableHeader())[0];
  const [estudiante, setEstudiante] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [openModalEditar, setOpenModalEditar] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);




  function defineTableHeader() {
    const tableHeadAux = [
      { id: "nombreEstudiante", label: "Nombre Estudiante", alignRight: false },
      { id: "correo", label: "Correo", alignRight: false },
      { id: "numMatricula", label: "Numero Matricula", alignRight: false },
      { id: "facultad", label: "Facultad", alignRight: false },
      { id: "carrera", label: "Carrera", alignRight: false },
      { id: "archivo", label: "Archivo", alignRight: false },
      { id: "validado", label: "Verificación", alignRight: false },
      { id: "", label: "", alignRight: false },
    ];

    return tableHeadAux;
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = estudiantes.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredItems = applySortFilter(
    estudiantes,
    getComparator(order, orderBy),
    filterName
  );

  useEffect(() => {
    async function cargarEstduidantes() {
      const data = await Api.getEstudiantes()
      if (data === 401) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"
      }
      else if (data === 403) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login"

      }
      else if (data === 300) {

      }
      else if (data === -1) {

      }
      else {
        if (isMounted.current) {
          setEstudiantes(data);
        }
      }
      if (isMounted.current) {
        setLoadingTable(false);
      }


    }
    cargarEstduidantes();

  }, []);




  return (
    <Page title="MeAnoto">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Estudiantes
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
          >
            Nuevo Estudiante
          </Button>
        </Stack>
        <Card>
          <Grid container>
            <Grid item xs md={3}>
              <TablaToolbarEstudiante
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
            </Grid>
          </Grid>
          <Scrollbar>
            <TableContainer>
              {!loadingTable ? (
                <Table>
                  <TablaHeadEstudiante
                    order={order}
                    orderBy={orderBy}
                    headLabel={tableHead}
                    rowCount={estudiantes.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredItems
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, idx) => {
                        return (
                          <TableRow
                            hover
                            key={"tablaEstudiante_" + idx}
                            tabIndex={-1}
                          >
                            <TableCell align="left">{row.nombreEstudiante}</TableCell>
                            <TableCell align="left">{row.correo}</TableCell>
                            <TableCell align="left">{row.numMatricula}</TableCell>
                            <TableCell align="left"> {row.facultad} </TableCell>
                            <TableCell align="left">{row.carrera}</TableCell>
                            <TableCell align="left">
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  window.open(row.archivo, '_blank');

                                }}
                              >
                                Ver Archivo

                              </Button>
                            </TableCell>
                            <TableCell align="left">{row.validado ? "SI" : "NO"}</TableCell>
                            <TableCell align="left">
                              <IconButton
                                onClick={() => {
                                  Api.eliminarEstudiante(row.id).then(() => {
                                    Api.getEstudiantes().then((respuesta) => {
                                      if (respuesta === 403 || respuesta === 401) {
                                        window.localStorage.removeItem("token");
                                        window.localStorage.removeItem("user");
                                        window.location.href = "/login"

                                      }
                                      else if (respuesta === 300 || respuesta === -1) {

                                      }
                                      else {
                                        setEstudiantes(respuesta)

                                      }
                                    })
                                  }).catch(() => {

                                  })
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                              {
                                row.validado ? (
                                  <IconButton
                                    onClick={() => {

                                      Api.validarEstudiante(row.id, !row.validado).then((resp) => {

                                        if (resp === 403 || resp === 401) {
                                          window.localStorage.removeItem("token");
                                          window.localStorage.removeItem("user");
                                          window.location.href = "/login"

                                        }
                                        else if (resp === 300 || resp === -1) {

                                        } else {
                                          Api.getEstudiantes().then((respuesta) => {
                                            if (respuesta === 403 || respuesta === 401) {
                                              window.localStorage.removeItem("token");
                                              window.localStorage.removeItem("user");
                                              window.location.href = "/login"

                                            }
                                            else if (respuesta === 300 || respuesta === -1) {

                                            }
                                            else {
                                              setEstudiantes(respuesta)

                                            }


                                          })
                                        }



                                      }).catch(() => {

                                      })



                                    }}
                                  >
                                    <CancelIcon />
                                  </IconButton>

                                ) : (
                                  <IconButton
                                    onClick={() => {
                                      Api.validarEstudiante(row.id, !row.validado).then((resp) => {


                                        if (resp === 403 || resp === 401) {
                                          window.localStorage.removeItem("token");
                                          window.localStorage.removeItem("user");
                                          window.location.href = "/login"

                                        }
                                        else if (resp === 300 || resp === -1) {

                                        }
                                        else {
                                          Api.getEstudiantes().then((respuesta) => {
                                            if (respuesta === 403 || respuesta === 401) {
                                              window.localStorage.removeItem("token");
                                              window.localStorage.removeItem("user");
                                              window.location.href = "/login"

                                            }
                                            else if (respuesta === 300 || respuesta === -1) {

                                            }
                                            else {
                                              setEstudiantes(respuesta)

                                            }
                                          })

                                        }



                                      }).catch(() => {

                                      })

                                    }}
                                  >
                                    <CheckIcon />
                                  </IconButton>

                                )
                              }
                              <IconButton
                                onClick={() => {
                                  setEstudiante(row);
                                  setOpenModalEditar(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <Skeleton variant="rectangular" width="100%" height="500px" />
              )}
            </TableContainer>
          </Scrollbar>
          <ThemeProvider
            theme={(outerTheme) => createTheme(outerTheme, locales[locale])}
          >
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={estudiantes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ThemeProvider>
        </Card>
        {openModalEditar && (<ModalEditarEstudiante open={openModalEditar} setOpen={setOpenModalEditar} estudiante={estudiante} setEstudiante={setEstudiante} setEstudiantes={setEstudiantes} />)}



      </Container>
    </Page>
  );
}