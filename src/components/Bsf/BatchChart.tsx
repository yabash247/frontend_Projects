import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectBatch } from "../../features/bsf/batchSlice";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { Chart } from "react-google-charts";

const BatchChart: React.FC<{ companyId: number; farmId: number }> = () => {
  const batchList = useSelector(selectBatch);
  const [xAxis, setXAxis] = useState("title");
  const [yAxis, setYAxis] = useState("category");

  const data = [
    [xAxis, yAxis],
    ...batchList.map((batch) => [batch[xAxis], batch[yAxis]]),
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Batch Chart
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <Select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="category">Category</MenuItem>
        </Select>
        <Select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
          <MenuItem value="category">Category</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </Select>
      </Box>
      <Chart
        chartType="Bar"
        data={data}
        width="100%"
        height="400px"
      />
    </Box>
  );
};

export default BatchChart;
