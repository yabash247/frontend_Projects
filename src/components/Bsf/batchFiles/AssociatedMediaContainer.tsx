import React, { useState } from "react";
import { Typography, Divider, Box, IconButton } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { backendURL } from "../../../utils/Constant";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

interface MediaItem {
  id: number;
  file: string;
  title: string;
  fileType?: string;
}

interface NetUseStatsDetails {
  id: number;
  lay_start: string;
  lay_end: string;
  harvest_weight: string;
}

interface AssociatedMediaContainerProps {
  selectedNet: {
    netusestats: NetUseStatsDetails;
    associated_media: MediaItem[];
  } | null;
}

const detectMediaType = (media: MediaItem): MediaItem => {
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

export const AssociatedMediaContainer: React.FC<AssociatedMediaContainerProps> = ({
  selectedNet,
}) => {
  console.log(selectedNet);
  
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const MediaDisplay: React.FC<{ media: MediaItem }> = ({ media }) => {
    const enrichedMedia = detectMediaType(media);
    const mediaUrl = `${backendURL}${enrichedMedia.file}`;

    switch (enrichedMedia.fileType) {
      case "video":
        return (
          <video
            src={mediaUrl}
            controls
            style={{ maxHeight: "300px", width: "100%" }}
          />
        );
      case "audio":
        return (
          <audio
            src={mediaUrl}
            controls
            style={{ width: "100%" }}
          />
        );
      case "image":
        return (
          <img
            src={mediaUrl}
            alt={enrichedMedia.title}
            style={{ maxHeight: "300px", width: "100%" }}
          />
        );
      default:
        return <Typography>Unsupported media type</Typography>;
    }
  };

  const toggleCarousel = () => {
    setIsCarouselPaused((prev) => !prev);
  };

  if (!selectedNet) {
    return <Typography>No Net selected. Click a row to view details.</Typography>;
  }

  return (
    <Box
      id="AssociatedMediaContainer"
      sx={{
        mt: 2,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 4,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h6">Net Details</Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography>
          <strong>Lay Start:</strong> {new Date(selectedNet.netusestats.lay_start).toDateString()}
        </Typography>
        <Typography>
          <strong>Lay End:</strong> {new Date(selectedNet.netusestats.lay_end).toDateString()}
        </Typography>
      </Box>
      <Typography>
        <strong>Harvest Weight:</strong> {selectedNet.netusestats.harvest_weight} g
      </Typography>

      {selectedNet.associated_media?.length > 0 ? (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Associated Media</Typography>
              <IconButton onClick={toggleCarousel}>
                {isCarouselPaused ? <PlayCircleIcon /> : <PauseCircleIcon />}
              </IconButton>
            </Box>
            <Carousel autoPlay={!isCarouselPaused}>
              {selectedNet.associated_media.map((media: MediaItem) => (
                <MediaDisplay key={media.id} media={media} />
              ))}
            </Carousel>
          </Box>
        </>
      ) : (
        <Typography sx={{ mt: 2 }}>No media associated with this net.</Typography>
      )}
    </Box>
  );
};
