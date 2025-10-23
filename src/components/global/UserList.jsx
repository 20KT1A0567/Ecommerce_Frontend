import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    axios
      .get("https://demo-deployment2-8-cq0p.onrender.com/admin/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        setError("Error fetching users");
        console.log(err);
      });
  }, []);

  const updateUserRole = (id, newRole) => {
    axios
      .put(`https://demo-deployment2-8-cq0p.onrender.com/admin/users/${id}/role`, {
        role: newRole,
      })
      .then((response) => {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );
        alert("Role updated successfully!");
      })
      .catch((err) => {
        setError("Error updating role");
        console.log(err);
      });
  };

  const handleRoleChange = (id, e) => {
    const newRole = e.target.value;
    setSelectedRoles({ ...selectedRoles, [id]: newRole });
  };

  const handleUpdateClick = (id) => {
    const newRole = selectedRoles[id] || users.find((user) => user.id === id).role;
    updateUserRole(id, newRole);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>

      {error && (
        <Typography variant="body1" color="error" mb={2}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="user table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No users available.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.username}</TableCell>

                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`role-label-${user.id}`}>Role</InputLabel>
                      <Select
                        labelId={`role-label-${user.id}`}
                        value={selectedRoles[user.id] || user.role}
                        label="Role"
                        onChange={(e) => handleRoleChange(user.id, e)}
                      >
                        <MenuItem value="ROLE_USER">ROLE_USER</MenuItem>
                        <MenuItem value="ROLE_ADMIN">ROLE_ADMIN</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateClick(user.id)}
                    >
                      Update Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
