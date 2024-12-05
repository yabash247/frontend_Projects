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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchNetUseStats,
  selectNetUseStats,
  selectNetUseStatsLoading,
  selectNetUseStatsError,
} from "../../features/bsf/netUseStatsSlice";

interface BatchDetailsModalProps {
  open: boolean;
  batch: any;
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

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOption(value);

    // Fetch NetUseStats when "Laying" is selected
    if (value === "Laying" && batch) {
      dispatch(fetchNetUseStats({ companyId, farmId, batchId: batch.id }));
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
          Batch : {batch ? batch.batch_name : "Batch Details"}
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
                  {netUseStats ? (
                    <>
                      <ListItem>
                        <ListItemText
                          primary= {"NET: "+netUseStats.net_use_stats.net || "N/A"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Lay End"
                          secondary={netUseStats.lay_end || "N/A"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Harvest Weight"
                          secondary={
                            netUseStats.harvest_weight
                              ? `${netUseStats.harvest_weight} grams`
                              : "N/A"
                          }
                        />
                      </ListItem>
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
                    secondary={batch ? batch.category : "N/A"}
                  />
                </ListItem>
              )}
              {selectedOption === "status" && (
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={batch ? batch.status : "N/A"}
                  />
                </ListItem>
              )}
              {selectedOption === "uploaded_by" && (
                <ListItem>
                  <ListItemText
                    primary="Uploaded By"
                    secondary={batch ? batch.uploaded_by : "N/A"}
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
