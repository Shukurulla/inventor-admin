// api/usersApi.js
import { api } from "../store/store";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "user/user/",
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "user/user/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `user/user/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/user/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});
