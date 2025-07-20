import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';

interface ArtistGridItemProps {
  artist: {
    artist: string;
    genre: string[];
    desc: string;
    ratings: any;
  };
}

const ArtistGridItem: React.FC<ArtistGridItemProps> = ({ artist }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {artist.artist}
        </Typography>
        <Chip label={artist.genre} style={{ marginBottom: '8px' }} />
        <Typography variant="body2" color="text.secondary">
          {artist.desc}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ArtistGridItem;
