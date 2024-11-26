// src/pages/Dashboard.tsx
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    { title: 'Companies', description: 'Manage your companies', link: '/companies' },
    { title: 'Staff', description: 'Manage your staff', link: '/staff' },
    { title: 'Authorities', description: 'Manage authorities', link: '/authorities' },
    { title: 'Staff Levels', description: 'Manage staff levels', link: '/staff-levels' },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        gap: 2,
        p: 2,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.title}
          onClick={() => navigate(card.link)}
          sx={{ cursor: 'pointer', boxShadow: 3, ':hover': { boxShadow: 6 } }}
        >
          <CardContent>
            <Typography variant="h5">{card.title}</Typography>
            <Typography>{card.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Dashboard;
