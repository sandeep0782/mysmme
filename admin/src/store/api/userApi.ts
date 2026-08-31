import { api, BASE_URL } from "../api";

const API_URLS = {
  GET_USERS: `${BASE_URL}/users`,
  ADD_USER: `${BASE_URL}/users`,
  UPDATE_USER: (userId: string) => `${BASE_URL}/users/${userId}`,

  DELETE_USER: (userId: string) => `${BASE_URL}/users/${userId}`,

  REGISTER: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  GOOGLE_LOGIN: `${BASE_URL}/auth/google`,

  VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify-email/${token}`,

  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,

  RESET_PASSWORD: (token: string) => `${BASE_URL}/auth/reset-password/${token}`,

  VERIFY_AUTH: `${BASE_URL}/auth/verify-auth`,
  LOGOUT: `${BASE_URL}/auth/logout`,

  UPDATE_USER_PROFILE: (userId: string) =>
    `${BASE_URL}/users/profile/update/${userId}`,
};

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: API_URLS.GET_USERS,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    addUser: builder.mutation({
      query: (userData) => ({
        url: API_URLS.ADD_USER,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    updateSingleUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: API_URLS.UPDATE_USER(userId),
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // ============================================================
    // DELETE USER
    // ============================================================

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: API_URLS.DELETE_USER(userId),
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: API_URLS.REGISTER,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    login: builder.mutation({
      query: (userData) => ({
        url: API_URLS.LOGIN,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    verifyEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.VERIFY_EMAIL(token),
        method: "GET",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: API_URLS.FORGOT_PASSWORD,
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: API_URLS.RESET_PASSWORD(token),
        method: "POST",
        body: { newPassword },
      }),
    }),

    verifyAuth: builder.mutation({
      query: () => ({
        url: API_URLS.VERIFY_AUTH,
        method: "GET",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: API_URLS.LOGOUT,
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: API_URLS.UPDATE_USER_PROFILE(userId),
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthMutation,
  useLogoutMutation,
  useUpdateUserMutation,

  useGetUsersQuery,
  useAddUserMutation,
  useUpdateSingleUserMutation,
  useDeleteUserMutation,
} = userApi;
