import * as React from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function ResponsiveMasonryCollage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // On mobile: only first 2 images
  const displayData = isMobile ? itemData.slice(0, 2) : itemData;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        columnCount: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
        columnGap: { xs: 1.5, sm: 2 },
      }}
    >
      {displayData.map((item, i) => (
        <Box
          key={`${item.img}-${i}`}
          component="img"
          src={item.img}
          alt={item.title || "gallery image"}
          loading="lazy"
          decoding="async"
          sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, (max-width:1200px) 33vw, 20vw"
          sx={{
            width: "100%",
            display: "block",
            breakInside: "avoid",
            mb: { xs: 1.5, sm: 2 },
            objectFit: "cover",
            borderRadius: 2,
            boxShadow: 1,
            transition: "transform 120ms ease, box-shadow 120ms ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
        />
      ))}
    </Box>
  );
}

const itemData = [
  { img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d", title: "Boots" },
  { img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", title: "Sunset Hike" },
  { img: "https://images.unsplash.com/photo-1502920514313-52581002a659", title: "Hiking Trail" },
  { img: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0", title: "Forest Sunset" },
  {
    img: "https://plus.unsplash.com/premium_photo-1700486007419-ef089e06f403?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUxfHx0cmF2ZWx8ZW58MHx8MHx8fDA%3D",
    title: "Campfire Lens",
  },
  { img: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3", title: "Night Sky" },
  // Extra images for desktop
  { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", title: "Ocean Escape" },
  { img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", title: "Mountain Peak" },
  { img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1", title: "Desert Journey" },
  { img: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66", title: "City Skyline" },
  { img: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c", title: "Tropical Beach" },
];
