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
  Snackbar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getAllFarmNets, selectNets } from '../../features/bsf/netSlice';
import { netUseCreate } from '../../features/bsf/netUseStatsSlice';
import dayjs from 'dayjs';

interface Net {
  id: number;
  name: string;
}

interface Media {
  title: string;
  file: File;
  comments?: string;
}

interface NetUseCreateFormProps {
  companyId: number;
  farmId: number;
  batchId: number;
}

const NetUseCreateForms: React.FC<NetUseCreateFormProps> = ({ companyId, farmId, batchId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const nets = useSelector<RootState, Net[]>(selectNets);
  const [selectedNet, setSelectedNet] = useState<string>('');
  const [selectedNetName, setSelectedNetName] = useState<string>(''); // Display value for selected net
  const [layStart, setLayStart] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [stats, setStats] = useState<string>('ongoing');
  const [media, setMedia] = useState<Media[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAllFarmNets({ companyId, farmId }));
  }, [dispatch, companyId, farmId]);

  const handleNetSelect = (id: string, name: string) => {
    setSelectedNet(id);
    setSelectedNetName(name);
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: '', file: new File([], '') }]); // Provide a valid default File
  };

  const handleFileChange = (index: number, file: File) => {
    const updatedMedia = [...media];
    updatedMedia[index].file = file;
    setMedia(updatedMedia);
  };

  const validateForm = (): boolean => {
    if (!selectedNet) {
      setError('Please select a net.');
      return false;
    }
    if (!layStart) {
      setError('Please provide a valid lay start date.');
      return false;
    }
    if (!stats) {
      setError('Please select a status.');
      return false;
    }
    if (media.some((item) => !item.file || !item.file.name)) {
      setError('Please provide valid media files.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(
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
      setSuccess(true);
      setSelectedNet('');
      setSelectedNetName('');
      setLayStart(dayjs().format('YYYY-MM-DD'));
      setStats('ongoing');
      setMedia([]);
    } catch (err) {
      setError('An error occurred while creating net use.');
    }
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Net</InputLabel>
            <Select
              value={selectedNet}
              onChange={(e) => {
                const selected = nets.find((net) => net.id === Number(e.target.value));
                handleNetSelect(e.target.value, selected ? selected.name : '');
              }}
            >
              {nets.map((net) => (
                <MenuItem key={net.id} value={net.id}>
                  {net.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedNetName && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              Selected Net: {selectedNetName}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Lay Start"
            type="date"
            value={layStart}
            onChange={(e) => setLayStart(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={stats} onChange={(e) => setStats(e.target.value)}>
              <MenuItem value="ongoing">Ongoing</MenuItem>
              <MenuItem value="completed" disabled>
                Completed
              </MenuItem>
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          {media.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Media Title"
                value={item.title}
                onChange={(e) => {
                  const updatedMedia = [...media];
                  updatedMedia[index].title = e.target.value;
                  setMedia(updatedMedia);
                }}
                sx={{ mb: 1 }}
              />
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(index, e.target.files ? e.target.files[0] : new File([], ''))
                }
                style={{ marginBottom: '10px' }}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddMedia} sx={{ mb: 2 }}>
            Add Media
          </Button>
          <Divider sx={{ my: 2 }} />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!selectedNet || !layStart || !stats || media.some((item) => !item.file.name)}
          >
            Submit
          </Button>
          <Snackbar
            open={success}
            autoHideDuration={3000}
            onClose={() => setSuccess(false)}
            message="Net Use successfully submitted!"
          />
        </>
      )}
    </Box>
  );
};

export default NetUseCreateForms;
