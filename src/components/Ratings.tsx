import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import { Bolt, Star } from '@mui/icons-material';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Custom debounce hook
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

interface RatingsProps {
  label: string;
  user?: string;
  like: number;
  rowdy: number;
  note: string;
  artist: string;
  artistId: string;
  onRatingUpdate: (
    artistId: string,
    user: string,
    newRating: number,
    ratingType: 'like' | 'rowdy',
  ) => void;
  size: 'small' | 'medium' | 'large';
}

const Ratings: React.FC<RatingsProps> = ({
  label,
  user,
  like,
  rowdy,
  note,
  artist,
  artistId,
  onRatingUpdate,
  size,
}) => {
  const [editableNote, setEditableNote] = useState(note);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setEditableNote(note);
  }, [note]);

  const saveNoteToFirestore = async (newNote: string) => {
    // Search for the document by artist name
    const q = query(collection(db, 'lineup'), where('artist', '==', artist));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const artistDoc = querySnapshot.docs[0].ref;
      const artistData = querySnapshot.docs[0].data();
      const updatedRatings = artistData.ratings.map((rating: any) =>
        rating.name === user ? { ...rating, notes: newNote } : rating,
      );
      await updateDoc(artistDoc, {
        ratings: updatedRatings,
      });
    }
  };

  // Debounced save function - saves .5 second after user stops typing
  const debouncedSaveNote = useDebounce(saveNoteToFirestore, 1000);

  const handleNoteChange = (newNote: string) => {
    setEditableNote(newNote);
    debouncedSaveNote(newNote);
  };

  const handleLikeChange = async (
    _event: React.ChangeEvent<{}>,
    newValue: number | null,
  ) => {
    const newRating = newValue || 0;

    // Search for the document by artist name
    const q = query(collection(db, 'lineup'), where('artist', '==', artist));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const artistDoc = querySnapshot.docs[0].ref;
      const artistData = querySnapshot.docs[0].data();
      const updatedRatings = artistData.ratings.map((rating: any) =>
        rating.name === user ? { ...rating, like: newRating } : rating,
      );
      await updateDoc(artistDoc, {
        ratings: updatedRatings,
      });
      onRatingUpdate(artistId, user!, newRating, 'like');
    }
  };

  const handleRowdyChange = async (
    _event: React.ChangeEvent<{}>,
    newValue: number | null,
  ) => {
    const newRating = newValue || 0;

    // Search for the document by artist name
    const q = query(collection(db, 'lineup'), where('artist', '==', artist));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const artistDoc = querySnapshot.docs[0].ref;
      const artistData = querySnapshot.docs[0].data();
      const updatedRatings = artistData.ratings.map((rating: any) =>
        rating.name === user ? { ...rating, rowdy: newRating } : rating,
      );
      await updateDoc(artistDoc, {
        ratings: updatedRatings,
      });
      onRatingUpdate(artistId, user!, newRating, 'rowdy');
    }
  };

  return (
    <div style={{ marginRight: isSmallScreen ? 6 : 24 }}>
      <Typography variant="body2" color="text.secondary">
        <strong>{label}</strong>
      </Typography>
      <Box>
        <Rating
          value={like}
          onChange={handleLikeChange}
          icon={<Star fontSize={isSmallScreen ? size : 'medium'} />}
          emptyIcon={<Star fontSize={isSmallScreen ? size : 'medium'} />}
          size={isSmallScreen ? size : 'medium'}
        />
      </Box>
      <Box>
        <Rating
          value={rowdy}
          onChange={handleRowdyChange}
          icon={<Bolt fontSize={isSmallScreen ? size : 'medium'} />}
          emptyIcon={<Bolt fontSize={isSmallScreen ? size : 'medium'} />}
          sx={{ color: 'secondary.main' }}
          size={isSmallScreen ? size : 'medium'}
        />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          Notes:
        </Typography>
        <TextField
          value={editableNote}
          onChange={e => handleNoteChange(e.target.value)}
          variant="standard"
          multiline
        />
      </Box>
    </div>
  );
};

export default Ratings;
