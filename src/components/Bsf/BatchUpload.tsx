import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadBatch } from '../../features/bsf/batchSlice';
import { AppDispatch } from '../../store';
import { Button, Typography } from '@mui/material';

interface BatchUploadProps {
  companyId: number;
  branchId: number | null;
  batchId: number;
  batch?: any;
}

const BatchUpload: React.FC<BatchUploadProps> = ({ companyId, branchId, batchId, batch}) => {
  const [files, setFiles] = useState<File[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = () => {
    if (files.length > 0) {
      dispatch(uploadBatch({ companyId, branchId, batchId, files }));
    }
  };

  return (
    <div>
      <Typography variant="h6">Upload Batch</Typography>
      <input type="file" multiple onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default BatchUpload;
