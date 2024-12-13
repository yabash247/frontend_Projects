import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFarmDetails, clearError } from "../../../features/company/BSF/farmSlice";
import { fetchBsfPonds, selectBsfPonds, selectBsfPondsStatus } from "../../../features/bsf/bsfPondsSlice";
import { RootState, AppDispatch } from "../../../store";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Modal,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StaffMemberList from "../../Company/StaffMemberList";
import BatchTable from "../../Bsf/BatchTable";
import BatchChart from "../../Bsf/BatchChart";
import PondModal from "../../Bsf/PondModal";

interface FarmDetailProps {
  companyId: number;
  farmId: number;
  appName: string;
}

const FarmDetail: React.FC<FarmDetailProps> = ({ companyId, farmId, appName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { farm, loading, error } = useSelector((state: RootState) => state.bsffarm);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const ponds = useSelector(selectBsfPonds);
  const pondStatus = useSelector(selectBsfPondsStatus);

  const [openStaffModal, setOpenStaffModal] = useState(false);
  const [openPondModal, setOpenPondModal] = useState(false);
  const [selectedPondId, setSelectedPondId] = useState<number | null>(null);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchFarmDetails({ companyId, farmId, appName }));
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, accessToken, companyId, farmId]);

  const handleOpenStaffModal = () => {
    setOpenStaffModal(true);
  };

  const handleCloseStaffModal = () => {
    setOpenStaffModal(false);
  };

  const handleOpenPondModal = (pondId: number | null = null) => {
    setSelectedPondId(pondId);
    setOpenPondModal(true);

    // Fetch pond data dynamically when opening the modal.
    dispatch(fetchBsfPonds({ farm: farmId, company: companyId }));
  };

  const handleClosePondModal = () => {
    setOpenPondModal(false);
    setSelectedPondId(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      {farm && (
        <Card>
          <CardMedia
            component="img"
            height="200"
            image={farm.background_image}
            alt={farm.name}
          />
          <CardContent>
            <Typography variant="h4" component="div">
              {farm.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {farm.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Status: {farm.status}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Established Date: {new Date(farm.established_date).toLocaleDateString()}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Associated Company
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Name: {farm.associated_company.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: {farm.associated_company.address}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenStaffModal}
              >
                View Staff Members
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpenPondModal()}
              >
                View Pond Details
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Modal to display StaffMemberList */}
      <Modal
        open={openStaffModal}
        onClose={handleCloseStaffModal}
        aria-labelledby="staff-member-list-modal"
        aria-describedby="modal-to-show-staff-members"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Staff Members
          </Typography>
          <StaffMemberList />
        </Box>
      </Modal>

      {/* Modal to display PondModal */}
      <Modal
        open={openPondModal}
        onClose={handleClosePondModal}
        aria-labelledby="pond-modal"
        aria-describedby="modal-to-show-pond-details"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          {pondStatus === "loading" && <CircularProgress />}
          {pondStatus === "failed" && <Alert severity="error">Failed to load ponds.</Alert>}
          {pondStatus === "succeeded" && ponds.length > 0 && (
            <PondModal
              isVisible={openPondModal}
              onClose={handleClosePondModal}
              farm={farmId}
              company={companyId}
              pondId={selectedPondId}
            />
          )}
        </Box>
      </Modal>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <BatchTable companyId={companyId} farmId={farmId} />
        </Grid>
        <Grid item xs={12}>
          <BatchChart companyId={companyId} farmId={farmId} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmDetail;
