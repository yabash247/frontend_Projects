import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Drawer,
  Divider,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchNetUseStats,
  selectNetUseStats,
  selectNetUseStatsLoading,
  selectNetUseStatsError,
} from "../../features/bsf/netUseStatsSlice";
import { PondUseStatsDisplay } from "./batchFiles/PondUseStatsDisplay";
import { NetUseStatsTable } from "./batchFiles/NetUseStatsTable";
import { PondUseStatsTable } from "./batchFiles/PondUseStatsTable";
import { PondAssociatedMediaContainer } from "./batchFiles/PondAssociatedMediaContainer";
import { AssociatedMediaContainer } from "./batchFiles/AssociatedMediaContainer";


interface BatchDetailsModalProps {
  open: boolean;
  batch: any | null;
  onClose: () => void;
  companyId: number;
  farmId: number;
}

const BatchDetailsModal: React.FC<BatchDetailsModalProps> = ({
  open,
  batch,
  onClose,
  companyId,
  farmId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const netUseStats = useSelector(selectNetUseStats);
  const loading = useSelector(selectNetUseStatsLoading);
  const error = useSelector(selectNetUseStatsError);
  const pondUseStats = useSelector((state: RootState) => state.bsfPonds.useStatsData);

  const [selectedOption, setSelectedOption] = useState<string>("Laying");
  const [showNetUseForm, setShowNetUseForm] = useState<boolean>(false);
  const [editNetId, setEditNetId] = useState<number | null>(null);
  const [associatedMediaContent, setAssociatedMediaContent] = useState<{
    pondusestats: any;
    associated_media: any[];
  } | null>(null);
  
  const [selectedNet, setSelectedNet] = useState<{
    netusestats: any;
    associated_media: any[];
  } | null>(null);
  
  useEffect(() => {
    if (selectedOption === "Laying" && batch?.id) {
      dispatch(fetchNetUseStats({ companyId, farmId, batchId: batch.id }));
    }
  }, [selectedOption, batch, companyId, farmId, dispatch]);

  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedOption(event.target.value);
    },
    []
  );

  const handleNetSelection = (net: any) => {
    setAssociatedMediaContent({
      pondusestats: net.netusestats,
      associated_media: net.associated_media,
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600, padding: 2 }} role="presentation">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            {batch?.batch_name || "Batch Details"}
          </Typography>
          <Button variant="text" color="primary" onClick={onClose}>
            Close
          </Button>
        </Box>
        <Divider />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={3} id="BatchInfoContainer">
            <PondUseStatsDisplay
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              batch={batch}
              companyId={companyId}
              farmId={farmId}
            />
          </Grid>

          <Grid item xs={9} id="NetUseStatsTableContainer">
            {selectedOption === "Laying" ? (
              loading ? (
                <CircularProgress />
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : ( console.log(netUseStats),
              
                <NetUseStatsTable
                netUseStats={netUseStats}
                setSelectedNet={setSelectedNet}
                  showNetUseForm={showNetUseForm}
                  setShowNetUseForm={setShowNetUseForm}
                  editNetId={editNetId}
                  setEditNetId={setEditNetId}
                  companyId={companyId}
                  farmId={farmId}
                  batchId={batch?.id}
                />
              )
            ) : (
              <PondUseStatsTable
                pondUseStats={pondUseStats}
                setAssociatedMediaContent={setAssociatedMediaContent}
              />
            )}
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
          
        {associatedMediaContent ? (
          selectedOption === "Laying" ? (
            <AssociatedMediaContainer
              selectedNet={{
                netusestats: associatedMediaContent.pondusestats, // Map pondusestats to netusestats
                associated_media: associatedMediaContent.associated_media,
              }}
            />
          ) : (
            <PondAssociatedMediaContainer selectedPond={associatedMediaContent} />
          )
        ) : (
          <Typography>Select a row to view associated media.</Typography>
        )}


      </Box>
    </Drawer>
  );
};

export default BatchDetailsModal;
