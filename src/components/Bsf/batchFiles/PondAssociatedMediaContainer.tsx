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

interface PondUseStatsDetails {
  id: number;
  pond_name: string;
  start_date: string;
  status: string;
}

interface PondAssociatedMediaContainerProps {
  selectedPond: {
    pondusestats: PondUseStatsDetails;
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

export const PondAssociatedMediaContainer: React.FC<PondAssociatedMediaContainerProps> = ({
  selectedPond,
}) => {
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

  if (!selectedPond) {
    return <Typography>No Pond selected. Click a row to view details.</Typography>;
  }

  return (
    <Box
      id="PondAssociatedMediaContainer"
      sx={{
        mt: 2,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 4,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h6">Pond Details</Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography>
          <strong>Pond Name:</strong> {selectedPond.pondusestats.pond_name}
        </Typography>
        <Typography>
          <strong>Start Date:</strong> {new Date(selectedPond.pondusestats.start_date).toDateString()}
        </Typography>
      </Box>
      <Typography>
        <strong>Status:</strong> {selectedPond.pondusestats.status}
      </Typography>

      {selectedPond.associated_media?.length > 0 ? (
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
              {selectedPond.associated_media.map((media: MediaItem) => (
                <MediaDisplay key={media.id} media={media} />
              ))}
            </Carousel>
          </Box>
        </>
      ) : (
        <Typography sx={{ mt: 2 }}>No media associated with this pond.</Typography>
      )}
    </Box>
  );
};
