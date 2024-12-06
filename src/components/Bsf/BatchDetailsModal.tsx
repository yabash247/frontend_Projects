import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material"; // Import SelectChangeEvent
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchNetUseStats,
  selectNetUseStats,
  selectNetUseStatsLoading,
  selectNetUseStatsError,
} from "../../features/bsf/netUseStatsSlice";
import NetUseCreateForm from "./NetUseStatsForm";

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

  const [selectedOption, setSelectedOption] = useState<string>("batch_name");
  const [selectedNet, setSelectedNet] = useState<string>("");
  const [showNetUseCreateForm, setShowNetUseCreateForm] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (selectedOption === "Laying" && batch?.id) {
      dispatch(fetchNetUseStats({ companyId, farmId, batchId: batch.id }));
    }
  }, [selectedOption, batch, companyId, farmId, dispatch]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

  const handleNetChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedNet(value);

    if (value === "add") {
      setShowNetUseCreateForm(true);
    } else {
      setShowNetUseCreateForm(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 600,
          padding: 2,
        }}
        role="presentation"
      >
        <Typography variant="h5" gutterBottom>
          {batch?.batch_name || "Batch Details"}
        </Typography>
        <Divider />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Left Column: Radio Buttons */}
          <Grid item xs={5}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Batch Information</FormLabel>
              <RadioGroup value={selectedOption} onChange={handleRadioChange}>
                <ListItem>
                  <FormControlLabel
                    value="Laying"
                    control={<Radio />}
                    label="Laying"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    value="category"
                    control={<Radio />}
                    label="Incubation"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    value="status"
                    control={<Radio />}
                    label="Nursery"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    value="uploaded_by"
                    control={<Radio />}
                    label="Grow Out"
                  />
                </ListItem>
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Fancy Vertical Divider */}
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            <Divider orientation="vertical" flexItem />
          </Grid>

          {/* Right Column: Display Selected Info */}
          <Grid item xs={6}>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            <List>
              {selectedOption === "Laying" && (
                <>
                  {netUseStats && netUseStats.net_use_stats?.length > 0 ? (
                    <>
                      <FormControl fullWidth>
                        <InputLabel id="net-select-label">Select Net</InputLabel>
                        <Select
                          labelId="net-select-label"
                          value={selectedNet}
                          onChange={handleNetChange} // Updated to handle SelectChangeEvent
                        >
                          <MenuItem value="add">Add</MenuItem>
                          {netUseStats.net_use_stats.map((net: any) => (
                            <MenuItem key={net.id} value={net.id}>
                              {net.net_name || `Net ${net.id}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {selectedNet !== "add" && selectedNet && (
                        <>
                          {netUseStats.net_use_stats
                            .filter((net: any) => net.id === Number(selectedNet))
                            .map((net: any) => (
                              <React.Fragment key={net.id}>
                                <ListItem>
                                  <ListItemText
                                    primary="Lay Start"
                                    secondary={net.lay_start || "N/A"}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Lay End"
                                    secondary={net.lay_end || "N/A"}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText
                                    primary="Harvest Weight"
                                    secondary={
                                      net.harvest_weight
                                        ? `${net.harvest_weight} grams`
                                        : "N/A"
                                    }
                                  />
                                </ListItem>
                              </React.Fragment>
                            ))}
                        </>
                      )}
                      {selectedNet === "add" && (
                        <NetUseCreateForm
                          companyId={companyId}
                          farmId={farmId}
                          batchId={batch?.id || 0}
                        />
                      )}
                    </>
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No Data"
                        secondary="No NetUseStats available for Laying."
                      />
                    </ListItem>
                  )}
                </>
              )}
              {selectedOption === "category" && (
                <ListItem>
                  <ListItemText
                    primary="Category"
                    secondary={batch?.category || "N/A"}
                  />
                </ListItem>
              )}
              {selectedOption === "status" && (
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={batch?.status || "N/A"}
                  />
                </ListItem>
              )}
              {selectedOption === "uploaded_by" && (
                <ListItem>
                  <ListItemText
                    primary="Uploaded By"
                    secondary={batch?.uploaded_by || "N/A"}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default BatchDetailsModal;
