import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBatch,
  selectBatch,
  selectBatchLoading,
  selectBatchError,
} from "../../features/bsf/batchSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { AppDispatch } from "../../store";
import BatchDetailsModal from "./BatchDetailsModal";

interface BatchTableProps {
  companyId: number;
  farmId: number;
}

const BatchTable: React.FC<BatchTableProps> = ({ companyId, farmId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const batchList = useSelector(selectBatch);
  const loading = useSelector(selectBatchLoading);
  const error = useSelector(selectBatchError);

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("status");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchBatch({ companyId, farmId, batchId: 0 }));
  }, [dispatch, companyId, farmId]);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (batch: any) => {
    setSelectedBatch(batch);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBatch(null);
  };

  const safeValue = (value: any) => (value === null || value === undefined ? "" : value);

  const getBatchStatus = (batch: any) => {
    const statuses = [
      batch.laying_status,
      batch.incubation_status,
      batch.nursery_status,
      batch.growout_status,
      batch.puppa_status,
    ];
    return statuses.includes("ongoing") ? "ongoing" : "completed";
  };

  const sortedBatches = [...batchList]
    .map((batch) => ({
      ...batch,
      status: getBatchStatus(batch),
    }))
    .sort((a, b) => {
      if (orderBy === "status") {
        if (a.status === b.status) return 0;
        return order === "asc"
          ? a.status === "ongoing"
            ? -1
            : 1
          : b.status === "ongoing"
          ? -1
          : 1;
      }
      const aValue = safeValue(a[orderBy]);
      const bValue = safeValue(b[orderBy]);
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

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
            <TableCell>
              <TableSortLabel
                active={orderBy === "batch_name"}
                direction={order}
                onClick={() => handleSort("batch_name")}
              >
                Batch Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Category</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "status"}
                direction={order}
                onClick={() => handleSort("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>Uploaded By</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBatches
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((batch) => (
              <TableRow key={batch.id}>
                <TableCell>{safeValue(batch.batch_name)}</TableCell>
                <TableCell>{safeValue(batch.category)}</TableCell>
                <TableCell>{safeValue(batch.status)}</TableCell>
                <TableCell>{safeValue(batch.uploaded_by)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(batch)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={batchList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>

      {/* Modal for Batch Details */}
      <BatchDetailsModal
        batch={selectedBatch}
        onClose={handleCloseModal}
        open={openModal}
        companyId={companyId}
        farmId={farmId}
      />
    </TableContainer>
  );
};

export default BatchTable;
