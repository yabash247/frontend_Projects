import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { PondAssociatedMediaContainer } from "./PondAssociatedMediaContainer";

interface PondUseStatsTableProps {
  pondUseStats: any[];
  setAssociatedMediaContent: React.Dispatch<
    React.SetStateAction<{
      pondusestats: any;
      associated_media: any[];
    } | null>
  >;
}

export const PondUseStatsTable: React.FC<PondUseStatsTableProps> = ({ pondUseStats, setAssociatedMediaContent }) => {
  const handleRowClick = (pond: any) => {
    setAssociatedMediaContent(pond);
  };

  return (
    <>
      <TableContainer
        sx={{
          maxHeight: 250,
          overflowY: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pond Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Associated Media</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pondUseStats.map((pond: any) => (
              <TableRow
                key={pond.pondusestats.id}
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(pond)}
              >
                <TableCell>{pond.pondusestats.pond_name}</TableCell>
                <TableCell>{pond.pondusestats.start_date}</TableCell>
                <TableCell>
                  {pond.associated_media?.length > 0 ? (
                    <VideocamIcon sx={{ fontSize: 20, color: "green" }} />
                  ) : (
                    <VideocamOffIcon sx={{ fontSize: 20, color: "gray" }} />
                  )}
                </TableCell>
                <TableCell>{pond.pondusestats.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
