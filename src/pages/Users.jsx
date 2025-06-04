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
import ConfirmationModal from "../components/ConfirmationModal";

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
  const [confirmModal, setConfirmModal] = React.useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
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

  const showConfirmation = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  const closeConfirmation = () => {
    setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  const handleUserSubmit = async () => {
    try {
      if (userModal.mode === "create") {
        await createUser(userForm).unwrap();
        setSnackbar({
          open: true,
          message: "Foydalanuvchi muvaffaqiyatli yaratildi!",
          severity: "success",
        });
      } else {
        const updateData = { ...userForm };
        if (!updateData.password) {
          delete updateData.password; // Don't send empty password
        }
        await updateUser({
          id: userModal.data.id,
          ...updateData,
        }).unwrap();
        setSnackbar({
          open: true,
          message: "Foydalanuvchi muvaffaqiyatli yangilandi!",
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
        message: "Saqlashda xatolik yuz berdi",
        severity: "error",
      });
    }
  };

  const handleUserDelete = async (user) => {
    showConfirmation(
      "Foydalanuvchini o'chirish",
      `"${user.first_name} ${user.last_name}" foydalanuvchisini o'chirishni tasdiqlaysizmi? Bu amal bekor qilib bo'lmaydi.`,
      async () => {
        try {
          await deleteUser(user.id).unwrap();
          setSnackbar({
            open: true,
            message: "Foydalanuvchi o'chirildi!",
            severity: "info",
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: "O'chirishda xatolik yuz berdi",
            severity: "error",
          });
        }
      }
    );
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

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "manager":
        return "Menejer";
      default:
        return "Foydalanuvchi";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "manager":
        return "warning";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return <Typography>Yuklanmoqda...</Typography>;
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
          Foydalanuvchilarni boshqarish
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openUserModal("create")}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Foydalanuvchi qo'shish
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600 }}>Foydalanuvchi</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Telefon</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Amallar
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
                  <TableCell>{user.phone_number || "Ko'rsatilmagan"}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleText(user.role)}
                      color={getRoleColor(user.role)}
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
                      onClick={() => handleUserDelete(user)}
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
            ? "Foydalanuvchi yaratish"
            : "Foydalanuvchini tahrirlash"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Foydalanuvchi nomi"
              value={userForm.username}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Ism"
              value={userForm.first_name}
              onChange={(e) =>
                setUserForm({ ...userForm, first_name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Familiya"
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
              label="Telefon"
              value={userForm.phone_number}
              onChange={(e) =>
                setUserForm({ ...userForm, phone_number: e.target.value })
              }
              fullWidth
              placeholder="+998901234567"
            />
            <TextField
              label="Parol"
              type="password"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              fullWidth
              required={userModal.mode === "create"}
              helperText={
                userModal.mode === "edit"
                  ? "Bo'sh qoldiring, agar o'zgartirmoqchi bo'lmasangiz"
                  : ""
              }
            />
            <FormControl fullWidth required>
              <InputLabel>Rol</InputLabel>
              <Select
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
                label="Rol"
              >
                <MenuItem value="user">Foydalanuvchi</MenuItem>
                <MenuItem value="manager">Menejer</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUserModal({ ...userModal, open: false })}>
            Bekor qilish
          </Button>
          <Button
            onClick={handleUserSubmit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {userModal.mode === "create" ? "Yaratish" : "Saqlash"}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
      />
    </Box>
  );
};

export default Users;
