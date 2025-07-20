import React from 'react';
import { Box, Chip, ListItem, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Ratings from './Ratings';

interface Rating {
  name: string;
  like: number | null;
  notes: string;
  rowdy: number | null;
}

interface ArtistListItemProps {
  artist: {
    id: string;
    artist: string;
    genre: string[];
    desc: string;
    ratings: Rating[];
    day: 'Friday' | 'Saturday' | 'Sunday';
  };
  fullWidth?: boolean;
  onRatingUpdate: (
    artistId: string,
    user: string,
    newRating: number,
    ratingType: 'like' | 'rowdy',
  ) => void;
  users: { name: string; show: boolean }[];
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  width: '100%',
  marginBottom: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingLeft: 0,
  paddingRight: 0,
  '& > div:first-of-type': {
    width: '100%',
    marginBottom: '24px',
  },
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 'initial',
    paddingRight: 'initial',
    '& > div:first-of-type': {
      width: 300,
    },
  },
}));

const RatingsContainer = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  '& > div': {
    marginBottom: '8px',
  },
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    '& > div': {
      marginBottom: 0,
    },
  },
}));

const ArtistListItem: React.FC<ArtistListItemProps> = ({
  artist,
  users,
  onRatingUpdate,
}) => {
  return (
    <StyledListItem>
      <div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            alignItems: 'flex-start',
          }}
        >
          <Typography
            variant="h5"
            component="div"
            style={{ marginRight: '12px' }}
          >
            {artist.artist}
          </Typography>
          <Box>
            {artist.genre.map((genre, index) => (
              <Chip key={index} label={genre} style={{ marginRight: '4px' }} />
            ))}
          </Box>
        </Box>
        <Typography variant="overline">{artist.day}</Typography>
        <Typography variant="body2" color="text.secondary">
          {artist.desc}
        </Typography>
      </div>
      <RatingsContainer>
        {artist.ratings
          .filter(rating =>
            users?.some(user => user.name === rating.name && user.show),
          )
          .map(rating => (
            <Ratings
              label={rating.name.charAt(0).toUpperCase() + rating.name.slice(1)}
              user={rating.name}
              like={rating.like ?? 0}
              rowdy={rating.rowdy ?? 0}
              note={rating.notes}
              artist={artist.artist}
              onRatingUpdate={onRatingUpdate}
              artistId={artist.id}
              key={rating.name}
              size={
                users.filter(user => user.show).length > 2 ? 'small' : 'medium'
              }
            />
          ))}
      </RatingsContainer>
    </StyledListItem>
  );
};

export default ArtistListItem;
