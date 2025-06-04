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

const Floors = () => {
  const { data: buildings = [] } = dashboardApi.useGetBuildingsQuery();
  const [selectedBuilding, setSelectedBuilding] = React.useState("");
  const { data: floors = [], isLoading } = dashboardApi.useGetFloorsQuery(
    selectedBuilding,
    {
      skip: !selectedBuilding,
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

  const handleFloorSubmit = async () => {
    try {
      const formData = {
        ...floorForm,
        building: selectedBuilding || floorForm.building,
      };
      if (floorModal.mode === "create") {
        await createFloor(formData).unwrap();
        setSnackbar({
          open: true,
          message: "Этаж создан успешно!",
          severity: "success",
        });
      } else {
        await updateFloor({ id: floorModal.data.id, ...formData }).unwrap();
        setSnackbar({
          open: true,
          message: "Этаж обновлен успешно!",
          severity: "success",
        });
      }
      setFloorModal({ open: false, mode: "create", data: null });
      setFloorForm({ number: 1, description: "", building: "" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ошибка при сохранении",
        severity: "error",
      });
    }
  };

  const handleFloorDelete = async (id) => {
    try {
      await deleteFloor(id).unwrap();
      setSnackbar({ open: true, message: "Этаж удален!", severity: "info" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ошибка при удалении",
        severity: "error",
      });
    }
  };

  const openFloorModal = (mode, floor = null) => {
    if (mode === "edit" && floor) {
      setFloorForm({
        number: floor.number,
        description: floor.description,
        building: floor.building,
      });
    } else {
      setFloorForm({ number: 1, description: "", building: selectedBuilding });
    }
    setFloorModal({ open: true, mode, data: floor });
  };

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
          Управление этажами
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openFloorModal("create")}
          size="large"
          sx={{ borderRadius: 2 }}
          disabled={!selectedBuilding}
        >
          Добавить этаж
        </Button>
      </Box>

      {/* Building Selector */}
      <Card
        sx={{ mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Выберите здание</InputLabel>
            <Select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              label="Выберите здание"
            >
              {buildings.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.name} - {building.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {selectedBuilding && (
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Номер этажа</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Описание</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Здание</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {floors.map((floor) => (
                  <TableRow
                    key={floor.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {floor.number}
                    </TableCell>
                    <TableCell>{floor.description}</TableCell>
                    <TableCell>
                      {buildings.find((b) => b.id === floor.building)?.name}
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
                        onClick={() => handleFloorDelete(floor.id)}
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
      )}

      {/* Floor Modal */}
      <Dialog
        open={floorModal.open}
        onClose={() => setFloorModal({ ...floorModal, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {floorModal.mode === "create" ? "Создать этаж" : "Редактировать этаж"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Номер этажа"
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
            />
            <TextField
              label="Описание"
              value={floorForm.description}
              onChange={(e) =>
                setFloorForm({ ...floorForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
            {!selectedBuilding && (
              <FormControl fullWidth required>
                <InputLabel>Здание</InputLabel>
                <Select
                  value={floorForm.building}
                  onChange={(e) =>
                    setFloorForm({ ...floorForm, building: e.target.value })
                  }
                  label="Здание"
                >
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setFloorModal({ ...floorModal, open: false })}>
            Отмена
          </Button>
          <Button
            onClick={handleFloorSubmit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {floorModal.mode === "create" ? "Создать" : "Сохранить"}
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

export default Floors;
