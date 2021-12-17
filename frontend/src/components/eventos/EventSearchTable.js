import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import { visuallyHidden } from '@mui/utils';

import { useUsuario } from '../../context/usuarioContext';

import SearchBar from '../SearchBar';
import RoomAssignmentDialog from './RoomAssignmentDialog';
import EstudiantesAsistencia from './EstudiantesAsistencia';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  esES,
);

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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'nombre',
    numeric: false,
    disablePadding: true,
    label: 'Nombre',
  },
  // {
  //   id: 'modulo',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Módulo',
  // },
  // {
  //   id: 'profesor',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Profesor',
  // },
  {
    id: 'sala',
    numeric: true,
    disablePadding: false,
    label: 'Sala',
  },
  {
    id: 'fecha',
    numeric: true,
    disablePadding: false,
    label: 'Fecha',
  },
  {
    id: 'button',
    label: ''
  }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EventSearchTable({ events }) {

  const isMounted = useRef(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selectedId, setSelectedId] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [events, setEvents] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [showRoomAssignmentDialog, setShowRoomAssignmentDialog] = useState(
    false
  );

  const [mostrarEstudianteAsistencia, setMostrarEstudiateAsistencia] = useState(
    false
  );

  const { user } = useUsuario();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setRows(events);
  }, [events])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleClick = (event, row) => {
  //   setSelectedId(row.id);
  //   setSelectedRow(row);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selectedId === id;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleAddLocation = (row) => {
    setShowRoomAssignmentDialog(true);
  };

  const handleEstudianteAsistencia = (row) => {
    setMostrarEstudiateAsistencia(true);
  };

  // function createData(id, nombre, modulo, profesor, sala, fecha) {
  //   return {
  //     id,
  //     nombre,
  //     modulo,
  //     profesor,
  //     sala,
  //     fecha,
  //   };
  // }

  const handleSearch = (value) => {
    const cleanValue = removeAccents(value.toLowerCase());
    const filtered = events.filter(
      e => (
        removeAccents(e.id.toLowerCase()).indexOf(cleanValue) !== -1 ||
        removeAccents(e.nombre.toLowerCase()).indexOf(cleanValue) !== -1 ||
        removeAccents(e.fecha.toLowerCase()).indexOf(cleanValue) !== -1 ||
        removeAccents(e.profesor.toLowerCase()).indexOf(cleanValue) !== -1 ||
        removeAccents(e.modulo.toLowerCase()).indexOf(cleanValue) !== -1 ||
        removeAccents(e.sala.toLowerCase()).indexOf(cleanValue) !== -1
      )
    );
    setRows(filtered);
  };

  const isReserved = (row) => {
    return row.asistentes.some( a => a === user.refId );
  };

  const handleReservation = (ev) => {
    if( ! isReserved(ev) ) return reserve(ev);
    return cancelReservation(ev);
  }

  const cancelReservation = (ev) => {
    console.log("antes", ev.asistentes)
    const filtered = ev.asistentes.filter( a => a !== user.refId);
    ev.asistentes = filtered;
    console.log("despues", ev.asistentes)
    const index = rows.findIndex( r => r.id === ev.id );
    rows.splice(index, 1, ev);
    setRows([...rows]);
  }

  const reserve = (ev) => {
    ev.asistentes.push(user.refId)
    const index = rows.findIndex( r => r.id === ev.id );
    rows.splice(index, 1, ev);
    setRows([...rows]);
  }


  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  return (
    <Box sx={{ width: '100%' }}>

      <SearchBar
        placeholder='Busca un evento'
        onSearch={(e) => handleSearch(e.target.value)}
      />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >

            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.nombre}
                      </TableCell>
                      <TableCell align="right">
                        {(user.tipo_usuario === 'ADMIN' || user.tipo_usuario === 'OPERATIVO') ? (
                          <Grid continer>
                            <Grid item xs={2} md={2}>
                              <IconButton onClick={() => handleAddLocation(row)}>
                                <AddLocationIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs={10} md={10}>
                              {row.sala}
                            </Grid>

                          </Grid>

                        ) : (
                          row.sala
                        )
                        }

                      </TableCell>
                      <TableCell align="right">{row.fecha}</TableCell>
                      <TableCell align="right">
                        {user.tipo_usuario === 'ESTUDIANTE' ? (
                          <Tooltip title="Reservar">
                            <span>
                              <IconButton
                                disabled={row.sala ? false : true}
                                onClick={ () => handleReservation(row)}
                              >
                                <EventSeatIcon
                                  color={isReserved(row) ? "success" : ""}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <div></div>
                        )}

                        {user.tipo_usuario === 'ESTUDIANTE' ? (
                          <div></div>

                        ) : (

                          <Tooltip title="Visualizar">
                            <IconButton onClick={() => handleEstudianteAsistencia(row)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                        )}


                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }} >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <ThemeProvider theme={theme}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ThemeProvider>
      </Paper>

      {showRoomAssignmentDialog && (
        <RoomAssignmentDialog
          open={showRoomAssignmentDialog}
          handleClose={() => setShowRoomAssignmentDialog(false)}
          event={events[0]}
        />
      )}

      {mostrarEstudianteAsistencia && (
        <EstudiantesAsistencia
          open={mostrarEstudianteAsistencia}
          handleClose={() => setMostrarEstudiateAsistencia(false)}
          event={events[0]}
        />
      )}

    </Box>
  );
}
