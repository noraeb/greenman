import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

interface User {
  name: string;
  show: boolean;
}

interface UserSettingsProps {
  users: User[];
  setUsers: (selectedUsers: User[]) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ users, setUsers }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, [setUsers]);

  const handleToggle = (user: string) => {
    const updatedUsers = users.map(u =>
      u.name === user ? { ...u, show: !u.show } : u,
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Show users</DialogTitle>
        <DialogContent>
          {users.map(user => (
            <FormControlLabel
              key={user.name}
              control={
                <Checkbox
                  checked={user.show}
                  onChange={() => handleToggle(user.name)}
                />
              }
              label={user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSettings;
