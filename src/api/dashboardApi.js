// api/dashboardApi.js
import { api } from "../store/store";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUniversity: builder.query({
      query: () => "university/",
      providesTags: ["University"],
    }),
    getBuildings: builder.query({
      query: () => "university/buildings/",
      providesTags: ["Building"],
    }),
    createBuilding: builder.mutation({
      query: (data) => ({
        url: "university/buildings/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Building"],
    }),
    updateBuilding: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `university/buildings/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Building"],
    }),
    deleteBuilding: builder.mutation({
      query: (id) => ({
        url: `university/buildings/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Building"],
    }),
    getFloors: builder.query({
      query: (buildingId) => `university/floors/?building_id=${buildingId}`,
      providesTags: ["Floor"],
    }),
    createFloor: builder.mutation({
      query: (data) => ({
        url: "university/floors/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Floor"],
    }),
    updateFloor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `university/floors/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Floor"],
    }),
    deleteFloor: builder.mutation({
      query: (id) => ({
        url: `university/floors/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Floor"],
    }),
    getFaculties: builder.query({
      query: () => "university/faculties/",
      providesTags: ["Faculty"],
    }),
    createFaculty: builder.mutation({
      query: (data) => ({
        url: "university/faculties/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),
    updateFaculty: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `university/faculties/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),
    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `university/faculties/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculty"],
    }),
    getRooms: builder.query({
      query: () => "university/rooms/",
      providesTags: ["Room"],
    }),
    createRoom: builder.mutation({
      query: (data) => ({
        url: "university/rooms/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),
    updateRoom: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `university/rooms/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `university/rooms/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Room"],
    }),
    getEquipment: builder.query({
      query: () => "inventory/equipment/",
      providesTags: ["Equipment"],
    }),
    getEquipmentTypes: builder.query({
      query: () => "inventory/equipment-types/",
      providesTags: ["Equipment"],
    }),
    getRepairs: builder.query({
      query: () => "inventory/repairs/",
      providesTags: ["Equipment"],
    }),
    getDisposals: builder.query({
      query: () => "inventory/disposals/",
      providesTags: ["Equipment"],
    }),
    getMovementHistory: builder.query({
      query: () => "inventory/movement-history/",
      providesTags: ["Equipment"],
    }),
  }),
});
