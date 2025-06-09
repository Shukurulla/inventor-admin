// pages/Faculties.jsx
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
import { dashboardApi } from "../api/dashboardApi";
import ConfirmationModal from "../components/ConfirmationModal";

const Faculties = () => {
  const { data: faculties = [], isLoading } =
    dashboardApi.useGetFacultiesQuery();
  const { data: buildings = [] } = dashboardApi.useGetBuildingsQuery();
  const [createFaculty] = dashboardApi.useCreateFacultyMutation();
  const [updateFaculty] = dashboardApi.useUpdateFacultyMutation();
  const [deleteFaculty] = dashboardApi.useDeleteFacultyMutation();

  const [facultyModal, setFacultyModal] = React.useState({
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
  const [facultyForm, setFacultyForm] = React.useState({
    name: "",
    building: "",
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

  const handleFacultySubmit = async () => {
    try {
      if (facultyModal.mode === "create") {
        await createFaculty(facultyForm).unwrap();
        setSnackbar({
          open: true,
          message: "Факультет успешно создан!",
          severity: "success",
        });
      } else {
        await updateFaculty({
          id: facultyModal.data.id,
          ...facultyForm,
        }).unwrap();
        setSnackbar({
          open: true,
          message: "Факультет успешно обновлен!",
          severity: "success",
        });
      }
      setFacultyModal({ open: false, mode: "create", data: null });
      setFacultyForm({ name: "", building: "" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ошибка при сохранении",
        severity: "error",
      });
    }
  };

  const handleFacultyDelete = async (faculty) => {
    const building = buildings.find((b) => b.id === faculty.building);
    showConfirmation(
      "Удаление факультета",
      `Подтвердить удаление факультета "${faculty.name}" (${building?.name})? Это действие нельзя отменить.`,
      async () => {
        try {
          await deleteFaculty(faculty.id).unwrap();
          setSnackbar({
            open: true,
            message: "Факультет удален!",
            severity: "info",
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Ошибка при удалении",
            severity: "error",
          });
        }
      }
    );
  };

  const openFacultyModal = (mode, faculty = null) => {
    if (mode === "edit" && faculty) {
      setFacultyForm({ name: faculty.name, building: faculty.building });
    } else {
      setFacultyForm({ name: "", building: "" });
    }
    setFacultyModal({ open: true, mode, data: faculty });
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
          Управление факультетами
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openFacultyModal("create")}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Добавить факультет
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600 }}>Название</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Здание</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faculties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      Факультеты не найдены
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                faculties.map((faculty) => (
                  <TableRow
                    key={faculty.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {faculty.name}
                    </TableCell>
                    <TableCell>
                      {buildings.find((b) => b.id === faculty.building)?.name ||
                        "Не указано"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => openFacultyModal("edit", faculty)}
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleFacultyDelete(faculty)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Faculty Modal */}
      <Dialog
        open={facultyModal.open}
        onClose={() => setFacultyModal({ ...facultyModal, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {facultyModal.mode === "create"
            ? "Создать факультет"
            : "Редактировать факультет"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Название факультета"
              value={facultyForm.name}
              onChange={(e) =>
                setFacultyForm({ ...facultyForm, name: e.target.value })
              }
              fullWidth
              required
              placeholder="Введите название факультета"
            />
            <FormControl fullWidth required>
              <InputLabel>Здание</InputLabel>
              <Select
                value={facultyForm.building}
                onChange={(e) =>
                  setFacultyForm({ ...facultyForm, building: e.target.value })
                }
                label="Здание"
              >
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name} - {building.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setFacultyModal({ ...facultyModal, open: false })}
          >
            Отменить
          </Button>
          <Button
            onClick={handleFacultySubmit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {facultyModal.mode === "create" ? "Создать" : "Сохранить"}
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

export default Faculties;
