import React, { useState, useEffect, useCallback} from 'react';
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
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';

import SearchBar from './SearchBar';
import RoomAssignmentDialog from './RoomAssignmentDialog';

function createData(id, nombre, modulo, profesor, sala, fecha) {
  return {
    id,
    nombre,
    modulo,
    profesor,
    sala,
    fecha,
  };
}

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
  {
    id: 'modulo',
    numeric: true,
    disablePadding: false,
    label: 'Módulo',
  },
  {
    id: 'profesor',
    numeric: true,
    disablePadding: false,
    label: 'Profesor',
  },
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
  const { order, orderBy, onRequestSort } =
    props;
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

export default function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selectedId, setSelectedId] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [events, setEvents] = useState([]);
  const [rows, setRows] = useState([
    createData('22654', 'Laboratorio 1', 'Cálculo 1', 'Juan López', 'S1', '2020-08-22'),
    createData('35485', 'Clase 1', 'Cálculo 2', 'John López', 'A22', '2020-10-22'),
    createData('55564', 'Laboratorio 11', 'Cálculo 3', 'Eduardo Salcedo', '', '2020-08-12'),
  ]);
  const [selectedRow, setSelectedRow] = useState();
  const [showRoomAssignmentDialog, setShowRoomAssignmentDialog] = useState(false);

  useEffect( () => {
    setEvents([
      {
        _id: 123,
        bloque: 5,
        fecha: Date.now(),
        fecha_creacion: Date.now(),
        modulo: "615cd601c9c677bba738f800",
        nombre: "Clase 1 práctica",
        profesor: "615cd5a9c9c677bba738f7ff",
        codigo: "TECWEB2020",
        estado: "disponible",
        fecha_fin_recurrencia: "2020-08-15T04:00:00.000Z",
        fecha_inicio_recurrencia: "2020-07-11T04:00:00.000Z",
        maximo_asistentes: 22,
        recurrencia: "semanal",
        sala: "615cd775c9c677bba738f805",
        asistentes: [
          { "presente": false, "asistente": "615ce862c9c677bba738f82d" }
        ]
      }
    ])
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, row) => {
    console.log("la row", row);
    setSelectedId(row.id);
    setSelectedRow(row);
  };

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
  }

  return (
    <Box sx={{ width: '100%' }}>

      <SearchBar />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >

            <EnhancedTableHead
              // numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      // selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.nombre}
                      </TableCell>
                      <TableCell align="right">{row.modulo}</TableCell>
                      <TableCell align="right">{row.profesor}</TableCell>
                      <TableCell align="right">
                        {row.sala || (
                          <IconButton onClick={ () => handleAddLocation(row) }>
                            <AddLocationIcon/>
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell align="right">{row.fecha}</TableCell>
                      <TableCell align="right">

                        <Tooltip title="Reservar">
                          <IconButton>
                            <EventSeatIcon/>
                          </IconButton>
                        </Tooltip>
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      { showRoomAssignmentDialog && (
        <RoomAssignmentDialog
          open={showRoomAssignmentDialog}
          handleClose={ () => setShowRoomAssignmentDialog(false) }
          event={events[0]}
        />
      ) }

    </Box>
  );
}
