import React, { useState, useMemo } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FlatTransaction } from '../types';

interface TransactionTableProps {
  transactions: FlatTransaction[];
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Derive unique filter options
  const types = useMemo(() => [...new Set(transactions.map((t) => t.type))].sort(), [transactions]);
  const years = useMemo(() => [...new Set(transactions.map((t) => new Date(t.timeStamp).getFullYear().toString()))].sort(), [transactions]);
  const employees = useMemo(() => {
    const map = new Map<string, string>();
    transactions.forEach((t) => map.set(t.employeeId, t.employeeName));
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [transactions]);

  // Filter and search
  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (yearFilter !== 'all' && new Date(t.timeStamp).getFullYear().toString() !== yearFilter) return false;
      if (employeeFilter !== 'all' && t.employeeId !== employeeFilter) return false;
      if (query) {
        return (
          t.transactionID.toLowerCase().includes(query) ||
          t.employeeName.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query) ||
          t.employeeId.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [transactions, search, typeFilter, yearFilter, employeeFilter]);

  // Reset page when filters change
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: { target: { value: string } },
  ) => {
    setter(e.target.value);
    setPage(0);
  };

  const paginatedRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        All Transactions
        <Chip label={`${filtered.length} / ${transactions.length}`} size="small" sx={{ ml: 1 }} />
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by ID, name, location..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ minWidth: 250, flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} label="Type" onChange={handleFilterChange(setTypeFilter)}>
            <MenuItem value="all">All</MenuItem>
            {types.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={yearFilter} label="Year" onChange={handleFilterChange(setYearFilter)}>
            <MenuItem value="all">All</MenuItem>
            {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Employee</InputLabel>
          <Select value={employeeFilter} label="Employee" onChange={handleFilterChange(setEmployeeFilter)}>
            <MenuItem value="all">All</MenuItem>
            {employees.map(([id, name]) => <MenuItem key={id} value={id}>{name} ({id})</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Transaction ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Amount</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((t) => (
              <TableRow key={t.transactionID} hover>
                <TableCell sx={{ fontFamily: 'monospace' }}>{t.transactionID}</TableCell>
                <TableCell>{t.employeeName}</TableCell>
                <TableCell>
                  <Chip
                    label={t.type}
                    size="small"
                    color={t.type === 'alpha' ? 'primary' : 'default'}
                    variant={t.type === 'alpha' ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell align="right">{formatCurrency(t.amount)}</TableCell>
                <TableCell>{formatDate(t.timeStamp)}</TableCell>
                <TableCell>{t.location}</TableCell>
              </TableRow>
            ))}
            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No transactions match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
};

export default TransactionTable;
