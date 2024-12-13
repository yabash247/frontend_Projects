import React, { useEffect } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AppDispatch } from "../../../store";
import { useDispatch } from "react-redux";
import { fetchBsfPondsUseStats } from "../../../features/bsf/bsfPondsSlice";

interface PondUseStatsDisplayProps {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  batch: any | null;
  companyId: number;
  farmId: number;
}

export const PondUseStatsDisplay: React.FC<PondUseStatsDisplayProps> = ({
  selectedOption,
  setSelectedOption,
  batch,
  companyId,
  farmId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (selectedOption !== "Laying" && batch?.id) {
      dispatch(
        fetchBsfPondsUseStats({
          company: companyId,
          farm: farmId,
          batch: batch.id,
          harvest_stage: selectedOption,
        })
      );
    }
  }, [dispatch, selectedOption, companyId, farmId, batch]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup value={selectedOption} onChange={handleRadioChange}>
        <FormControlLabel value="Laying" control={<Radio />} label="Laying" />
        <FormControlLabel value="Incubation" control={<Radio />} label="Incubation" />
        <FormControlLabel value="Nursery" control={<Radio />} label="Nursery" />
        <FormControlLabel value="Growout" control={<Radio />} label="Grow Out" />
        <FormControlLabel value="PrePupa" control={<Radio />} label="PrePupa" />
        <FormControlLabel value="Pupa" control={<Radio />} label="Pupa" />
      </RadioGroup>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Tooltip title="Add new laying data for this batch">
          <Button
            id="addNewLayInfoButton"
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
          >
            Add
          </Button>
        </Tooltip>
      </Box>
    </FormControl>
  );
};
