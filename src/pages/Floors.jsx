// pages/Floors.jsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
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

const Floors = () => {
  const { data: buildings = [] } = dashboardApi.useGetBuildingsQuery();
  const [selectedBuilding, setSelectedBuilding] = React.useState("all");

  // Barcha qavatlarni olish uchun alohida query
  const { data: allFloors = [], isLoading: allFloorsLoading } =
    dashboardApi.useGetAllFloorsQuery();

  // Tanlangan bino bo'yicha qavatlar
  const { data: floors = [], isLoading } = dashboardApi.useGetFloorsQuery(
    selectedBuilding !== "all" ? selectedBuilding : undefined,
    {
      skip: selectedBuilding === "all",
    }
  );

  const [createFloor] = dashboardApi.useCreateFloorMutation();
  const [updateFloor] = dashboardApi.useUpdateFloorMutation();
  const [deleteFloor] = dashboardApi.useDeleteFloorMutation();

  const [floorModal, setFloorModal] = React.useState({
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
  const [floorForm, setFloorForm] = React.useState({
    number: 1,
    description: "",
    building: "",
  });

  // Ko'rsatiladigan qavatlar - tanlangan binoga qarab
  const displayFloors = selectedBuilding === "all" ? allFloors : floors;

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

  const handleFloorSubmit = async () => {
    try {
      const formData = {
        ...floorForm,
        building:
          selectedBuilding !== "all" && selectedBuilding
            ? selectedBuilding
            : floorForm.building,
      };

      if (floorModal.mode === "create") {
        await createFloor(formData).unwrap();
        setSnackbar({
          open: true,
          message: "Qavat muvaffaqiyatli yaratildi!",
          severity: "success",
        });
      } else {
        await updateFloor({ id: floorModal.data.id, ...formData }).unwrap();
        setSnackbar({
          open: true,
          message: "Qavat muvaffaqiyatli yangilandi!",
          severity: "success",
        });
      }
      setFloorModal({ open: false, mode: "create", data: null });
      setFloorForm({ number: 1, description: "", building: "" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Saqlashda xatolik yuz berdi",
        severity: "error",
      });
    }
  };

  const handleFloorDelete = async (floor) => {
    const building = buildings.find((b) => b.id === floor.building);
    showConfirmation(
      "Qavatni o'chirish",
      `"${floor.number}-qavat (${building?.name})" qavatini o'chirishni tasdiqlaysizmi? Bu amal bekor qilib bo'lmaydi.`,
      async () => {
        try {
          await deleteFloor(floor.id).unwrap();
          setSnackbar({
            open: true,
            message: "Qavat o'chirildi!",
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

  const openFloorModal = (mode, floor = null) => {
    if (mode === "edit" && floor) {
      setFloorForm({
        number: floor.number,
        description: floor.description,
        building: floor.building,
      });
    } else {
      setFloorForm({
        number: 1,
        description: "",
        building: selectedBuilding !== "all" ? selectedBuilding : "",
      });
    }
    setFloorModal({ open: true, mode, data: floor });
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
          Qavatlarni boshqarish
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openFloorModal("create")}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Qavat qo'shish
        </Button>
      </Box>

      {/* Building Selector */}
      <Card
        sx={{ mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Binoni tanlang</InputLabel>
            <Select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              label="Binoni tanlang"
            >
              <MenuItem value="all">Barcha binolar</MenuItem>
              {buildings.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.name} - {building.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Floors Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600 }}>Qavat raqami</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tavsif</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bino</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Amallar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayFloors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      {selectedBuilding === "all"
                        ? "Hech qanday qavat topilmadi"
                        : "Tanlangan binoda qavatlar mavjud emas"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayFloors.map((floor) => (
                  <TableRow
                    key={floor.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {floor.number}-qavat
                    </TableCell>
                    <TableCell>
                      {floor.description || "Tavsif mavjud emas"}
                    </TableCell>
                    <TableCell>
                      {buildings.find((b) => b.id === floor.building)?.name ||
                        "Noma'lum"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => openFloorModal("edit", floor)}
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleFloorDelete(floor)}
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

      {/* Floor Modal */}
      <Dialog
        open={floorModal.open}
        onClose={() => setFloorModal({ ...floorModal, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {floorModal.mode === "create"
            ? "Qavat yaratish"
            : "Qavatni tahrirlash"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Qavat raqami"
              type="number"
              value={floorForm.number}
              onChange={(e) =>
                setFloorForm({
                  ...floorForm,
                  number: parseInt(e.target.value) || 1,
                })
              }
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Tavsif"
              value={floorForm.description}
              onChange={(e) =>
                setFloorForm({ ...floorForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              placeholder="Qavat haqida qo'shimcha ma'lumot"
            />
            {(selectedBuilding === "all" || floorModal.mode === "edit") && (
              <FormControl fullWidth required>
                <InputLabel>Bino</InputLabel>
                <Select
                  value={floorForm.building}
                  onChange={(e) =>
                    setFloorForm({ ...floorForm, building: e.target.value })
                  }
                  label="Bino"
                >
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name} - {building.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setFloorModal({ ...floorModal, open: false })}>
            Bekor qilish
          </Button>
          <Button
            onClick={handleFloorSubmit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {floorModal.mode === "create" ? "Yaratish" : "Saqlash"}
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

export default Floors;
