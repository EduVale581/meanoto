import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'bloque', label: 'Bloque', minWidth: 100 },
  { id: 'lunes', label: 'Lunes', minWidth: 100 },
  { id: 'martes', label: 'Martes', minWidth: 100 },
  { id: 'miercoles', label: 'Miércoles', minWidth: 100, },
  { id: 'jueves', label: 'Jueves', minWidth: 100, },
  { id: 'viernes', label: 'Viernes', minWidth: 100, },
  { id: 'sabado', label: 'Sábado', minWidth: 100, },
];

function createData(bloque, lunes, martes, miercoles, jueves, viernes, sabado,) {
  return { bloque, lunes, martes, miercoles, jueves, viernes, sabado };
}

const rows = [
  createData('1', '', ' ', ' ', ' ', ' ', ' '),
  createData('2', ' ', '', '', '', '', ''),
  createData('3', '', '', '', '', '', ''),
  createData('4', '', '', '', '', '', ''),
  createData('5', '', '', '', '', '', ''),
  createData('6', '', '', '', '', '', ''),
  createData('7', '', '', '', '', '', ''),
  createData('8', '', '', '', '', '', ''),
  createData('9', '', '', '', '', '', ''),
  createData('10', '', '', '', '', '', ''),
  createData('11', '', '', '', '', '', ''),
];

export default function Schedule() {
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination */}
      {/*   rowsPerPageOptions={[10, 25, 100]} */}
      {/*   component="div" */}
      {/*   count={rows.length} */}
      {/*   rowsPerPage={rowsPerPage} */}
      {/*   page={page} */}
      {/*   onPageChange={handleChangePage} */}
      {/*   onRowsPerPageChange={handleChangeRowsPerPage} */}
      {/* /> */}
    </Paper>
  );
}
