// pages/Rooms.jsx
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
  Switch,
  FormControlLabel,
  Chip,
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

const Rooms = () => {
  const { data: rooms = [], isLoading } = dashboardApi.useGetRoomsQuery();
  const { data: faculties = [] } = dashboardApi.useGetFacultiesQuery();
  const { data: buildings = [] } = dashboardApi.useGetBuildingsQuery();
  const { data: allFloors = [] } = dashboardApi.useGetAllFloorsQuery();
  const [createRoom] = dashboardApi.useCreateRoomMutation();
  const [updateRoom] = dashboardApi.useUpdateRoomMutation();
  const [deleteRoom] = dashboardApi.useDeleteRoomMutation();

  const [roomModal, setRoomModal] = React.useState({
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
  const [roomForm, setRoomForm] = React.useState({
    number: "",
    name: "",
    is_special: false,
    building: "",
    floor: "",
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

  const handleRoomSubmit = async () => {
    try {
      const submitData = {
        number: roomForm.number,
        name: roomForm.name,
        is_special: roomForm.is_special,
        building: parseInt(roomForm.building),
        floor: parseInt(roomForm.floor),
      };

      if (roomModal.mode === "create") {
        await createRoom(submitData).unwrap();
        setSnackbar({
          open: true,
          message: "Кабинет успешно создан!",
          severity: "success",
        });
      } else {
        await updateRoom({ id: roomModal.data.id, ...submitData }).unwrap();
        setSnackbar({
          open: true,
          message: "Кабинет успешно обновлен!",
          severity: "success",
        });
      }
      setRoomModal({ open: false, mode: "create", data: null });
      setRoomForm({
        number: "",
        name: "",
        is_special: false,
        building: "",
        floor: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ошибка при сохранении",
        severity: "error",
      });
    }
  };

  const handleRoomDelete = async (room) => {
    const building = buildings.find((b) => b.id === room.building);
    showConfirmation(
      "Удаление кабинета",
      `Подтвердить удаление кабинета "${room.number} - ${room.name}" (${building?.name})? Это действие нельзя отменить.`,
      async () => {
        try {
          await deleteRoom(room.id).unwrap();
          setSnackbar({
            open: true,
            message: "Кабинет удален!",
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

  const openRoomModal = (mode, room = null) => {
    if (mode === "edit" && room) {
      setRoomForm({
        number: room.number,
        name: room.name,
        is_special: room.is_special,
        building: room.building.toString(),
        floor: room.floor.toString(),
      });
    } else {
      setRoomForm({
        number: "",
        name: "",
        is_special: false,
        building: "",
        floor: "",
      });
    }
    setRoomModal({ open: true, mode, data: room });
  };

  // Фильтровать этажи для выбранного здания
  const getFloorsForBuilding = (buildingId) => {
    return allFloors.filter((floor) => floor.building === parseInt(buildingId));
  };

  // Получить информацию о факультете
  const getFacultyInfo = (room) => {
    const faculty = faculties.find((f) => f.building === room.building);
    return faculty?.name || "Не привязан к факультету";
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
          Управление кабинетами
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openRoomModal("create")}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Добавить кабинет
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600 }}>Номер</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Название</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Факультет</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Здание</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Этаж</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Тип</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      Кабинеты не найдены
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow
                    key={room.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {room.number}
                    </TableCell>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{getFacultyInfo(room)}</TableCell>
                    <TableCell>
                      {buildings.find((b) => b.id === room.building)?.name ||
                        "Не указано"}
                    </TableCell>
                    <TableCell>{room.floor}-этаж</TableCell>
                    <TableCell>
                      <Chip
                        label={room.is_special ? "Специальный" : "Обычный"}
                        color={room.is_special ? "primary" : "default"}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => openRoomModal("edit", room)}
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRoomDelete(room)}
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

      {/* Room Modal */}
      <Dialog
        open={roomModal.open}
        onClose={() => setRoomModal({ ...roomModal, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {roomModal.mode === "create"
            ? "Создать кабинет"
            : "Редактировать кабинет"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Номер кабинета"
              value={roomForm.number}
              onChange={(e) =>
                setRoomForm({ ...roomForm, number: e.target.value })
              }
              fullWidth
              required
              placeholder="Например: 101, A-205"
            />
            <TextField
              label="Название кабинета"
              value={roomForm.name}
              onChange={(e) =>
                setRoomForm({ ...roomForm, name: e.target.value })
              }
              fullWidth
              placeholder="Например: Компьютерный класс, Аудитория"
            />
            <FormControl fullWidth required>
              <InputLabel>Здание</InputLabel>
              <Select
                value={roomForm.building}
                onChange={(e) => {
                  setRoomForm({
                    ...roomForm,
                    building: e.target.value,
                    floor: "", // Сбросить этаж при изменении здания
                  });
                }}
                label="Здание"
              >
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name} - {building.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required disabled={!roomForm.building}>
              <InputLabel>Этаж</InputLabel>
              <Select
                value={roomForm.floor}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, floor: e.target.value })
                }
                label="Этаж"
              >
                {roomForm.building &&
                  getFloorsForBuilding(roomForm.building).map((floor) => (
                    <MenuItem key={floor.id} value={floor.id}>
                      {floor.number}-этаж
                      {floor.description && ` (${floor.description})`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={roomForm.is_special}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, is_special: e.target.checked })
                  }
                />
              }
              label="Специальный кабинет"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRoomModal({ ...roomModal, open: false })}>
            Отменить
          </Button>
          <Button
            onClick={handleRoomSubmit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {roomModal.mode === "create" ? "Создать" : "Сохранить"}
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

export default Rooms;
