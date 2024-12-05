import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBatch, deleteBatch, selectBatch, selectBatchLoading, selectBatchError } from '../../features/bsf/batchSlice';
import { RootState, AppDispatch } from '../../store';
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface BatchListProps {
  companyId: number;
  farmId: number;
  batchId: number;
}

const BatchList: React.FC<BatchListProps> = ({ companyId, farmId, batchId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const batchList = useSelector((state: RootState) => selectBatch(state));
  const loading = useSelector((state: RootState) => selectBatchLoading(state));
  const error = useSelector((state: RootState) => selectBatchError(state));

  useEffect(() => {
    dispatch(fetchBatch({ companyId, farmId, batchId }));
  }, [dispatch, companyId, farmId, batchId]);

  const handleDelete = (batchId: number) => {
    dispatch(deleteBatch({ batchId }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" align="center" gutterBottom>
        Batch List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Uploaded By</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {batchList.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell>{batch.title}</TableCell>
              <TableCell>{batch.category}</TableCell>
              <TableCell>{batch.status}</TableCell>
              <TableCell>{batch.uploaded_by}</TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => handleDelete(batch.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BatchList;
