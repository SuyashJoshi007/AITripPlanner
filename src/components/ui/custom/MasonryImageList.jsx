import * as React from 'react';
import Box from '@mui/material/Box';

export default function StaticMasonryCollage() {
  const columns = 5;

  // Distribute images evenly by looping through columns
  const masonryColumns = Array.from({ length: columns }, () => []);
  itemData.forEach((item, index) => {
    masonryColumns[index % columns].push(item);
  });

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#ffffff',
        p: 2,
        borderRadius: 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      {masonryColumns.map((column, colIndex) => (
        <Box key={colIndex} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
          {column.map((item, index) => (
            <Box
              key={`${item.img}-${index}`}
              component="img"
              src={`${item.img}`}
              alt={item.title}
              loading="lazy"
              sx={{
                width: 220,
                height: 120 + ((index + colIndex) % 3) * 40,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: 1,
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}


const itemData = [
  { img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d', title: 'Boots' },
  { img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', title: 'Sunset Hike' },
  { img: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98', title: 'Map Reading' },
  { img: 'https://images.unsplash.com/photo-1502920514313-52581002a659', title: 'Hiking Trail' },
  { img: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', title: 'Forest Sunset' },
  { img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', title: 'Wildflowers' },
  { img: 'https://plus.unsplash.com/premium_photo-1700486007419-ef089e06f403?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUxfHx0cmF2ZWx8ZW58MHx8MHx8fDA%3D', title: 'Campfire Lens' },
  { img: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3', title: 'Night Sky' },
  { img: 'https://images.unsplash.com/photo-1496950866446-3253e1470e8e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D', title: 'Beach Waves' },
  { img: 'https://images.unsplash.com/photo-1540206395-68808572332f', title: 'Camper Van' },
  { img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', title: 'Lakeside Tent' },
  { img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', title: 'Island' },
  { img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D', title: 'Snowy Mountains' },
  { img: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31', title: 'Bridge Walk' },
  { img: 'https://plus.unsplash.com/premium_photo-1683121772967-31cb0614cbb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODN8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D', title: 'Forest Adventure' },
  { img: 'https://images.unsplash.com/photo-1469796466635-455ede028aca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA5fHx0cmF2ZWx8ZW58MHx8MHx8fDA%3D', title: 'Tropical Coast' },
  { img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', title: 'Scenic Drive' },
  { img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e', title: 'Canyon View' },
  { img: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D', title: 'Solo Traveler' },
  { img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', title: 'Ocean Sunset' },
];
