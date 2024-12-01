// src/components/AddCompanyForm.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setName, setDescription, setPhone, setEmail, setWebsite, setComments, setStatus, addCompany } from '../features/company/addCompanySlice';
import { TextField, Button, Container, Typography, Box, Alert, Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface AddCompanyFormProps {
  onClose?: () => void;
}

const AddCompanyForm: React.FC<AddCompanyFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { name, description, phone, email, website, comments, status, loading, error, newCompany, farm } = useSelector((state: RootState) => state.companies);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken); // Assuming accessToken is stored in auth slice

  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    dispatch(setEmail(emailValue));
    if (!/\S+@\S+\.\S+/.test(emailValue)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addCompany({ name, description, phone, email, website, comments, status, newCompany, farm })).then(() => {
      if (onClose) {
        onClose();
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Company
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value))}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            value={phone}
            onChange={(e) => dispatch(setPhone(e.target.value))}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Website"
            type="url"
            value={website}
            onChange={(e) => dispatch(setWebsite(e.target.value))}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Comments"
            value={comments}
            onChange={(e) => dispatch(setComments(e.target.value))}
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Status</FormLabel>
            <RadioGroup
              row
              value={status}
              onChange={(e) => dispatch(setStatus(e.target.value))}
            >
              <FormControlLabel value="active" control={<Radio />} label="Active" />
              <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'Adding...' : 'Add Company'}
            </Button>
          </Box>
          {error && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">{typeof error === 'string' ? error : JSON.stringify(error)}</Alert>
            </Box>
          )}
        </form>
        {newCompany && (
          <Box sx={{ mt: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  New Company Added
                </Typography>
                <Typography variant="body2" component="p">
                  Name: {newCompany.name}
                </Typography>
                <Typography variant="body2" component="p">
                  Description: {newCompany.description}
                </Typography>
                <Typography variant="body2" component="p">
                  Phone: {newCompany.phone}
                </Typography>
                <Typography variant="body2" component="p">
                  Email: {newCompany.email}
                </Typography>
                <Typography variant="body2" component="p">
                  Website: {newCompany.website}
                </Typography>
                <Typography variant="body2" component="p">
                  Comments: {newCompany.comments}
                </Typography>
                <Typography variant="body2" component="p">
                  Status: {newCompany.status}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AddCompanyForm;