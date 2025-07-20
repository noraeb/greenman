import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { Box, List, Fab, CircularProgress } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import ListFilters from './ListFilters';
import ArtistListItem from './ArtistListItem';
import { db } from '../firebaseConfig';

interface Rating {
  name: string;
  like: number | null;
  notes: string;
  rowdy: number | null;
}

export interface ArtistData {
  id: string;
  artist: string;
  genre: string[];
  desc: string;
  ratings: Rating[];
  day: 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

const ArtistList: React.FC = () => {
  const [artists, setArtists] = useState<ArtistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [users, setUsers] = useState<{ name: string; show: boolean }[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const lineupCollection = collection(db, 'lineup');
        const initialSnapshot = await getDocs(lineupCollection);
        const initialLineupList = initialSnapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() } as ArtistData),
        );

        const uniqueRatingNames = [
          ...new Set(
            initialLineupList.flatMap(artist =>
              artist.ratings.map(rating => rating.name),
            ),
          ),
        ].map(name => ({ name, show: true }));

        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          setUsers(uniqueRatingNames);
        }

        const unsubscribe = onSnapshot(lineupCollection, lineupSnapshot => {
          const lineupList = lineupSnapshot.docs.map(
            doc => ({ id: doc.id, ...doc.data() } as ArtistData),
          );
          lineupList.sort((a, b) => a.artist.localeCompare(b.artist));
          setArtists(lineupList);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching artists: ', error);
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handleRatingUpdate = useCallback(
    (
      artistId: string,
      user: string,
      newRating: number,
      ratingType: 'like' | 'rowdy',
    ) => {
      setArtists(prevArtists =>
        prevArtists.map(artist =>
          artist.id === artistId
            ? {
                ...artist,
                ratings: artist.ratings.map(rating =>
                  rating.name === user
                    ? { ...rating, [ratingType]: newRating }
                    : rating,
                ),
              }
            : artist,
        ),
      );
    },
    [],
  );

  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      const matchesGenre =
        genres.length === 0 ||
        genres.some(genre => artist.genre.includes(genre));
      const matchesSearchTerm = artist.artist
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDay =
        selectedDays.length === 0 ||
        selectedDays.length === 3 ||
        selectedDays.includes(artist.day);

      return matchesGenre && matchesSearchTerm && matchesDay;
    });
  }, [artists, genres, searchTerm, selectedDays]);

  return (
    <>
      <Box mb={2}>
        <ListFilters
          artists={artists}
          setGenres={setGenres}
          setSearchTerm={setSearchTerm}
          setSelectedDays={setSelectedDays}
          genres={genres}
          searchTerm={searchTerm}
          selectedDays={selectedDays}
          users={users}
          setUsers={setUsers}
        />
      </Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: 48 }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List style={{ minWidth: '100%', width: '100%' }}>
            {filteredArtists.map((artist, index) => (
              <ArtistListItem
                key={index}
                artist={artist}
                fullWidth
                onRatingUpdate={(artistId, user, newRating, ratingType) =>
                  handleRatingUpdate(artistId, user, newRating, ratingType)
                }
                users={users}
              />
            ))}
          </List>
          <Box
            position="sticky"
            bottom={16}
            right={16}
            display="flex"
            justifyContent="flex-end"
          >
            <Fab
              aria-label="to top"
              size="small"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Box>
        </>
      )}
    </>
  );
};

export default ArtistList;
