import React from "react";
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

interface NetUseStatsTableProps {
  netUseStats: any[];
  setSelectedNet: React.Dispatch<
    React.SetStateAction<{
      netusestats: any;
      associated_media: any[];
    } | null>
  >;
  showNetUseForm: boolean; // Add this if used
  setShowNetUseForm: React.Dispatch<React.SetStateAction<boolean>>; // Add this if used
  editNetId: number | null; // Add this if used
  setEditNetId: React.Dispatch<React.SetStateAction<number | null>>; // Add this if used
  companyId: number; // Add this if used
  farmId: number; // Add this if used
  batchId: any; // Add this if used
}


const detectMediaType = (media: any): any => {
  if (media.fileType) return media;

  const fileExtension = media.file.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    mp4: "video",
    avi: "video",
    mov: "video",
    mp3: "audio",
    wav: "audio",
    jpg: "image",
    jpeg: "image",
    png: "image",
  };

  return {
    ...media,
    fileType: typeMap[fileExtension || ""] || "unknown",
  };
};

export const NetUseStatsTable: React.FC<NetUseStatsTableProps> = ({
  netUseStats,
  setSelectedNet,
}) => {
  const handleRowClick = (net: any) => {
    setSelectedNet({
      ...net,
      associated_media: (net.associated_media || []).map(detectMediaType), // Enrich media
    });
    console.log("Net Selected:", net); // Debugging to ensure data flow
  };

  return (
    <TableContainer sx={{ maxHeight: 250, overflowY: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Net Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Associated Media</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {netUseStats.map((net: any) => (
            <TableRow
              key={net.netusestats?.id || net.id}
              sx={{ cursor: "pointer" }}
              onClick={() => handleRowClick(net)}
            >
              <TableCell>
                {net?.name || `Net ${net?.net || "Unknown"}`}
              </TableCell>
              <TableCell>{net.status || "Unknown"}</TableCell>
              <TableCell>
                {net.associated_media?.length > 0 ? (
                  <VideocamIcon sx={{ fontSize: 20, color: "green" }} />
                ) : (
                  <VideocamOffIcon sx={{ fontSize: 20, color: "gray" }} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
