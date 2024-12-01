import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFarmDetails, clearError } from "../../../features/company/BSF/farmSlice";
import { RootState, AppDispatch } from "../../../store";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

interface FarmDetailProps {
  companyId: number;
  farmId: number;
  appName: string;
}

const FarmDetail: React.FC<FarmDetailProps> = ({ companyId, farmId, appName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { farm, loading, error } = useSelector((state: RootState) => state.bsffarm);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchFarmDetails({ accessToken, companyId, farmId, appName }));
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, accessToken, companyId, farmId]);

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
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FarmDetail;
