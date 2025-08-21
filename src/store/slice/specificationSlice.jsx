// src/store/slices/specificationSlice.js - Updated with delete actions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { specificationsAPI } from "../../services/api";

// Get all specifications
export const getAllSpecifications = createAsyncThunk(
  "specifications/getAllSpecifications",
  async (_, { rejectWithValue }) => {
    try {
      const [
        computerSpecs,
        projectorSpecs,
        printerSpecs,
        tvSpecs,
        routerSpecs,
        notebookSpecs,
        monoblokSpecs,
        whiteboardSpecs,
        extenderSpecs,
        monitorSpecs,
      ] = await Promise.all([
        specificationsAPI.getComputerSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getProjectorSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getPrinterSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getTVSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getRouterSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getNotebookSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getMonoblokSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getWhiteboardSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getExtenderSpecs().catch(() => ({ data: [] })),
        specificationsAPI.getMonitorSpecs().catch(() => ({ data: [] })),
      ]);

      return {
        computer: computerSpecs.data || [],
        projector: projectorSpecs.data || [],
        printer: printerSpecs.data || [],
        tv: tvSpecs.data || [],
        router: routerSpecs.data || [],
        notebook: notebookSpecs.data || [],
        monoblok: monoblokSpecs.data || [],
        whiteboard: whiteboardSpecs.data || [],
        extender: extenderSpecs.data || [],
        monitor: monitorSpecs.data || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get specification count
export const getSpecificationCount = createAsyncThunk(
  "specifications/getSpecificationCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.getSpecificationCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create specifications
export const createComputerSpec = createAsyncThunk(
  "specifications/createComputerSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createComputerSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProjectorSpec = createAsyncThunk(
  "specifications/createProjectorSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createProjectorSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPrinterSpec = createAsyncThunk(
  "specifications/createPrinterSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createPrinterSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTVSpec = createAsyncThunk(
  "specifications/createTVSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createTVSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createRouterSpec = createAsyncThunk(
  "specifications/createRouterSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createRouterSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createNotebookSpec = createAsyncThunk(
  "specifications/createNotebookSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createNotebookSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMonoblokSpec = createAsyncThunk(
  "specifications/createMonoblokSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createMonoblokSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createWhiteboardSpec = createAsyncThunk(
  "specifications/createWhiteboardSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createWhiteboardSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createExtenderSpec = createAsyncThunk(
  "specifications/createExtenderSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createExtenderSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMonitorSpec = createAsyncThunk(
  "specifications/createMonitorSpec",
  async (data, { rejectWithValue }) => {
    try {
      const response = await specificationsAPI.createMonitorSpec(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete specifications
export const deleteComputerSpec = createAsyncThunk(
  "specifications/deleteComputerSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteComputerSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProjectorSpec = createAsyncThunk(
  "specifications/deleteProjectorSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteProjectorSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePrinterSpec = createAsyncThunk(
  "specifications/deletePrinterSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deletePrinterSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTVSpec = createAsyncThunk(
  "specifications/deleteTVSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteTVSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRouterSpec = createAsyncThunk(
  "specifications/deleteRouterSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteRouterSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNotebookSpec = createAsyncThunk(
  "specifications/deleteNotebookSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteNotebookSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMonoblokSpec = createAsyncThunk(
  "specifications/deleteMonoblokSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteMonoblokSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteWhiteboardSpec = createAsyncThunk(
  "specifications/deleteWhiteboardSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteWhiteboardSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteExtenderSpec = createAsyncThunk(
  "specifications/deleteExtenderSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteExtenderSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMonitorSpec = createAsyncThunk(
  "specifications/deleteMonitorSpec",
  async (id, { rejectWithValue }) => {
    try {
      await specificationsAPI.deleteMonitorSpec(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const specificationSlice = createSlice({
  name: "specifications",
  initialState: {
    computer: [],
    projector: [],
    printer: [],
    tv: [],
    router: [],
    notebook: [],
    monoblok: [],
    whiteboard: [],
    extender: [],
    monitor: [],
    specificationCount: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all specifications
      .addCase(getAllSpecifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSpecifications.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(getAllSpecifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get specification count
      .addCase(getSpecificationCount.fulfilled, (state, action) => {
        state.specificationCount = action.payload;
      })
      // Create specifications
      .addCase(createComputerSpec.fulfilled, (state, action) => {
        state.computer.push(action.payload);
      })
      .addCase(createProjectorSpec.fulfilled, (state, action) => {
        state.projector.push(action.payload);
      })
      .addCase(createPrinterSpec.fulfilled, (state, action) => {
        state.printer.push(action.payload);
      })
      .addCase(createTVSpec.fulfilled, (state, action) => {
        state.tv.push(action.payload);
      })
      .addCase(createRouterSpec.fulfilled, (state, action) => {
        state.router.push(action.payload);
      })
      .addCase(createNotebookSpec.fulfilled, (state, action) => {
        state.notebook.push(action.payload);
      })
      .addCase(createMonoblokSpec.fulfilled, (state, action) => {
        state.monoblok.push(action.payload);
      })
      .addCase(createWhiteboardSpec.fulfilled, (state, action) => {
        state.whiteboard.push(action.payload);
      })
      .addCase(createExtenderSpec.fulfilled, (state, action) => {
        state.extender.push(action.payload);
      })
      .addCase(createMonitorSpec.fulfilled, (state, action) => {
        state.monitor.push(action.payload);
      })
      // Delete specifications
      .addCase(deleteComputerSpec.fulfilled, (state, action) => {
        state.computer = state.computer.filter(
          (spec) => spec.id !== action.payload
        );
      })
      .addCase(deleteProjectorSpec.fulfilled, (state, action) => {
        state.projector = state.projector.filter(
          (spec) => spec.id !== action.payload
        );
      })
      .addCase(deletePrinterSpec.fulfilled, (state, action) => {
        state.printer = state.printer.filter(
          (spec) => spec.id !== action.payload
        );
      })
      .addCase(deleteTVSpec.fulfilled, (state, action) => {
        state.tv = state.tv.filter((spec) => spec.id !== action.payload);
      })
      .addCase(deleteRouterSpec.fulfilled, (state, action) => {
        state.router = state.router.filter(
          (spec) => spec.id !== action.payload
        );
      })
      .addCase(deleteNotebookSpec.fulfilled, (state, action) => {
        state.notebook = state.notebook.filter(
          (spec) => spec.id !== action.payload
        );
      })
      .addCase(deleteMonoblokSpec.fulfilled, (state, action) => {
        state.monoblok = state.monoblok.filter(
          (spec) => spec.id !== action.payload
        );
      })
      .addCase(deleteWhiteboardSpec.fulfilled, (state, action) => {
        state.whiteboard = state.whiteboard.filter(
          (spec) => spec.id !== action.payload
        );
      })
      .addCase(deleteExtenderSpec.fulfilled, (state, action) => {
        state.extender = state.extender.filter(
          (spec) => spec.id !== action.payload
        );
      })
      .addCase(deleteMonitorSpec.fulfilled, (state, action) => {
        state.monitor = state.monitor.filter(
          (spec) => spec.id !== action.payload
        );
      });
  },
});

export const { clearError } = specificationSlice.actions;
export default specificationSlice.reducer;
