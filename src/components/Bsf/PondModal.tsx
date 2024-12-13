import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchBsfPonds,
  selectBsfPonds,
  selectBsfPondsStatus,
} from "../../features/bsf/bsfPondsSlice";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import "./styles/PondModal.css";
import { backendURL } from "../../utils/Constant";

interface PondModalProps {
  isVisible: boolean;
  onClose: () => void;
  farm: number;
  company: number;
  pondId?: number | null; // Optional: Specific pond ID to highlight
}

const PondModal: React.FC<PondModalProps> = ({ isVisible, onClose, farm, company, pondId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const ponds = useSelector(selectBsfPonds);
  const status = useSelector(selectBsfPondsStatus);

  // Trigger fetchBsfPonds only once when modal is opened
  useEffect(() => {
    if (isVisible && status === "idle") {
      dispatch(fetchBsfPonds({ farm, company }));
    }
  }, [dispatch, isVisible, farm, company, status]);

  const handleRetry = () => {
    dispatch(fetchBsfPonds({ farm, company }));
  };

  const highlightedPond = pondId ? ponds.find((p) => p.pond.id === pondId) : null;

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: "800px",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }}
    >
      {/* Modal Header */}
      <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
        Pond Details
      </Typography>
      {/* Close Button */}
      <button className="pond-modal-close-button" onClick={onClose}>
        ✖
      </button>

      {/* Loading State */}
      {status === "loading" && (
        <>
          <CircularProgress />
          <Typography>Loading ponds...</Typography>
        </>
      )}

      {/* Error State */}
      {status === "failed" && (
        <>
          <Alert severity="error">Failed to load pond data. Please try again.</Alert>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Retry
          </Button>
        </>
      )}

      {/* Content */}
      {status === "succeeded" && ponds.length > 0 && (
        <>
          {/* Highlighted Pond */}
          {highlightedPond ? (
            <Card sx={{ mb: 4 }}>
              <CardMedia
                component="img"
                height="140"
                image={backendURL+highlightedPond.associated_media[0]?.file || ""}
                alt={highlightedPond.pond.pond_name}
              />
             
              <CardContent>
                <Typography variant="h5" component="div">
                  {highlightedPond.pond.pond_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {highlightedPond.pond.pond_type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use: {highlightedPond.pond.pond_use}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dimensions: {`${highlightedPond.pond.width}m x ${highlightedPond.pond.length}m x ${highlightedPond.pond.depth}m`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {highlightedPond.pond.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comments: {highlightedPond.pond.comments || "No comments available"}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2" sx={{ mb: 3 }}>
              No specific pond highlighted. Displaying all ponds.
            </Typography>
          )}

          {/* All Ponds */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {ponds.map((pond) => (
              <Card key={pond.pond.id} sx={{ width: "240px", mb: 2 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={backendURL+pond.associated_media[0]?.file || ""}
                  alt={pond.pond.pond_name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {pond.pond.pond_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {pond.pond.pond_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Use: {pond.pond.pond_use}
                </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {pond.pond.status}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}

      {/* No Ponds State */}
      {status === "succeeded" && ponds.length === 0 && (
        <Alert severity="info">No ponds found for the selected farm and company.</Alert>
      )}
    </Box>
  );
};

export default PondModal;
