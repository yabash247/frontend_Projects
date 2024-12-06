import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getAllFarmNets, selectNets } from '../../features/bsf/netSlice';
import { netUseCreate } from '../../features/bsf/netUseStatsSlice';
import dayjs from 'dayjs';

interface NetUseCreateFormProps {
  companyId: number;
  farmId: number;
  batchId: number;
}

const NetUseCreateForm: React.FC<NetUseCreateFormProps> = ({ companyId, farmId, batchId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const nets = useSelector(selectNets);
  const [selectedNet, setSelectedNet] = useState<string>('');
  const [layStart, setLayStart] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [stats, setStats] = useState<string>('ongoing');
  const [media, setMedia] = useState<{ title: string; file: File; comments?: string }[]>([]);

  useEffect(() => {
    dispatch(getAllFarmNets({ companyId, farmId }));
  }, [dispatch, companyId, farmId]);

  const handleAddMedia = () => {
    setMedia([...media, { title: '', file: null as any }]);
  };

  const handleFileChange = (index: number, file: File) => {
    const updatedMedia = [...media];
    updatedMedia[index].file = file;
    setMedia(updatedMedia);
  };

  const handleSubmit = () => {
    dispatch(
      netUseCreate({
        companyId,
        farmId,
        batchId,
        netId: Number(selectedNet),
        layStart,
        stats,
        media,
      })
    );
  };

  return (
    <Box>
      {nets.length === 0 ? (
        <Alert severity="warning" sx={{ my: 2 }}>
          No available nets. Please add nets with a "completed" status before proceeding.
        </Alert>
      ) : (
        <>
          <Typography variant="h6">Add New Net Use</Typography>
          <Divider sx={{ my: 2 }} />
          <FormControl fullWidth>
            <InputLabel>Select Net</InputLabel>
            <Select value={selectedNet} onChange={(e) => setSelectedNet(e.target.value)}>
              {nets.map((net: any) => (
                <MenuItem key={net.id} value={net.id}>
                  {net.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Lay Start"
            value={layStart}
            onChange={(e) => setLayStart(e.target.value)}
            sx={{ my: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={stats} onChange={(e) => setStats(e.target.value)}>
              <MenuItem value="ongoing">Ongoing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          {media.map((item, index) => (
            <Box key={index}>
              <TextField
                fullWidth
                label="Media Title"
                value={item.title}
                onChange={(e) => {
                  const updatedMedia = [...media];
                  updatedMedia[index].title = e.target.value;
                  setMedia(updatedMedia);
                }}
              />
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files![0])}
                style={{ margin: '10px 0' }}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddMedia}>
            Add Media
          </Button>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </>
      )}
    </Box>
  );
};

export default NetUseCreateForm;
