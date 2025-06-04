// pages/Users.jsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { usersApi } from "../api/usersApi";

const Users = () => {
  const { data: users = [], isLoading } = usersApi.useGetUsersQuery();
  const [createUser] = usersApi.useCreateUserMutation();
  const [updateUser] = usersApi.useUpdateUserMutation();
  const [deleteUser] = usersApi.useDeleteUserMutation();

  const [userModal, setUserModal] = React.useState({
    open: false,
    mode: "create",
    data: null,
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [userForm, setUserForm] = React.useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "user",
  });

  const handleUserSubmit = async () => {
    try {
      if (userModal.mode === "create") {
        await createUser(userForm).unwrap();
        setSnackbar({
          open: true,
          message: "Пользователь обновлен успешно!",
          severity: "success",
        });
      }
      setUserModal({ open: false, mode: "create", data: null });
      setUserForm({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ошибка при сохранении",
        severity: "error",
      });
    }
  };

  const handleUserDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      setSnackbar({
        open: true,
        message: "Пользователь удален!",
        severity: "info",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ошибка при удалении",
        severity: "error",
      });
    }
  };

  const openUserModal = (mode, user = null) => {
    if (mode === "edit" && user) {
      setUserForm({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number || "",
        password: "",
        role: user.role,
      });
    } else {
      setUserForm({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        role: "user",
      });
    }
    setUserModal({ open: true, mode, data: user });
  };

  if (isLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Управление пользователями
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openUserModal("create")}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Добавить пользователя
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600 }}>Пользователь</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Телефон</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Роль</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {user.first_name?.charAt(0) || user.username?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number || "Не указан"}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.role === "admin"
                          ? "Администратор"
                          : user.role === "manager"
                          ? "Менеджер"
                          : "Пользователь"
                      }
                      color={
                        user.role === "admin"
                          ? "error"
                          : user.role === "manager"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => openUserModal("edit", user)}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleUserDelete(user.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* User Modal */}
      <Dialog
        open={userModal.open}
        onClose={() => setUserModal({ ...userModal, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {userModal.mode === "create"
            ? "Создать пользователя"
            : "Редактировать пользователя"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Имя пользователя"
              value={userForm.username}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Имя"
              value={userForm.first_name}
              onChange={(e) =>
                setUserForm({ ...userForm, first_name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Фамилия"
              value={userForm.last_name}
              onChange={(e) =>
                setUserForm({ ...userForm, last_name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Телефон"
              value={userForm.phone_number}
              onChange={(e) =>
                setUserForm({ ...userForm, phone_number: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Пароль"
              type="password"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              fullWidth
              required={userModal.mode === "create"}
              helperText={
                userModal.mode === "edit"
                  ? "Оставьте пустым, чтобы не изменять"
                  : ""
              }
            />
            <FormControl fullWidth required>
              <InputLabel>Роль</InputLabel>
              <Select
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
                label="Роль"
              >
                <MenuItem value="user">Пользователь</MenuItem>
                <MenuItem value="manager">Менеджер</MenuItem>
                <MenuItem value="admin">Администратор</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUserModal({ ...userModal, open: false })}>
            Отмена
          </Button>
          <Button
            onClick={handleUserSubmit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {userModal.mode === "create" ? "Создать" : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
