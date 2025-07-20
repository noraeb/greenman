import React, { useMemo, useCallback, useState } from 'react';
import { debounce } from 'lodash';
import {
  Box,
  Autocomplete,
  TextField,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import UserSettings from './UserSettings';
import type { ArtistData } from './ArtistList';

interface ListFiltersProps {
  artists: ArtistData[];
  genres: string[];
  searchTerm: string;
  selectedDays: string[];
  users: { name: string; show: boolean }[];
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>;
  setUsers: React.Dispatch<
    React.SetStateAction<{ name: string; show: boolean }[]>
  >;
}

const StyledToggleButton = styled(ToggleButton)(() => ({
  '&.Mui-selected': {
    backgroundColor: 'darkorange',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkorange',
    },
  },
}));

const ListFilters: React.FC<ListFiltersProps> = ({
  artists,
  setGenres,
  setSearchTerm,
  setSelectedDays,
  genres,
  searchTerm,
  selectedDays,
  users,
  setUsers,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleGenreChange = useCallback(
    (_event: React.ChangeEvent<{}>, value: string[]) => {
      setGenres(value);
    },
    [setGenres],
  );

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 300),
    [setSearchTerm],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchTerm(value);
    debouncedSetSearchTerm(value);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };

  const handleDayChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newDays: string[]) => {
      setSelectedDays(newDays);
    },
    [setSelectedDays],
  );

  const genreOptions = useMemo(() => {
    return [...new Set(artists.flatMap(artist => artist.genre))].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [artists]);

  return (
    <>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          size="small"
          label="Search Artist"
          variant="outlined"
          value={localSearchTerm}
          onChange={handleSearchChange}
          style={{ flex: 1, marginRight: 16 }}
          slotProps={{
            htmlInput: { autoComplete: 'off' },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Autocomplete
          multiple
          options={genreOptions}
          value={genres}
          onChange={handleGenreChange}
          renderInput={params => (
            <TextField
              {...params}
              size="small"
              label="Genre"
              variant="outlined"
            />
          )}
          style={{ flex: 1 }}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" justifyContent="center" flex={1}></Box>
        <ToggleButtonGroup
          value={selectedDays}
          onChange={handleDayChange}
          aria-label="day selection"
          size="small"
        >
          <StyledToggleButton value="Friday" aria-label="friday">
            Friday
          </StyledToggleButton>
          <StyledToggleButton value="Saturday" aria-label="saturday">
            Saturday
          </StyledToggleButton>
          <StyledToggleButton value="Sunday" aria-label="sunday">
            Sunday
          </StyledToggleButton>
        </ToggleButtonGroup>
        <Box display="flex" justifyContent="flex-end" flex={1}>
          <UserSettings users={users} setUsers={setUsers} />
        </Box>
      </Box>
    </>
  );
};

export default ListFilters;
