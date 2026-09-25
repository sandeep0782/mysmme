import { api, BASE_URL } from "../api";

/* ================================================================
   API URLS
================================================================ */

const API_URLS = {
  CONTACT: `${BASE_URL}/contact`,

  ADMIN_CONTACTS: `${BASE_URL}/contact/admin`,

  ADMIN_CONTACT_BY_ID: (id: string) => `${BASE_URL}/contact/admin/${id}`,

  ADMIN_CONTACT_STATUS: (id: string) =>
    `${BASE_URL}/contact/admin/${id}/status`,
};

/* ================================================================
   TYPES
================================================================ */

export type ContactInquiryType =
  | "customer-support"
  | "order-support"
  | "seller-support"
  | "catalogue-support"
  | "business"
  | "technical"
  | "feedback"
  | "other";

export type ContactInquiryStatus =
  | "new"
  | "in-progress"
  | "resolved"
  | "closed";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;

  type: ContactInquiryType;

  reference?: string;

  subject: string;
  message: string;

  consent: boolean;
  website?: string;
}

export interface ContactInquiry {
  _id: string;

  name: string;
  email: string;
  phone?: string;

  type: ContactInquiryType;

  reference?: string;

  subject: string;
  message: string;

  status: ContactInquiryStatus;

  consent: boolean;

  source: "website";

  createdAt: string;
  updatedAt: string;
}

/* ================================================================
   RESPONSE TYPES
================================================================ */

interface PublicContactResponse {
  success: boolean;
  message: string;

  data: {
    id: string;
    status: ContactInquiryStatus;
    createdAt: string;
  };
}

interface AdminContactResponse {
  success: boolean;
  message: string;
  data: ContactInquiry;
}

interface AdminContactsResponse {
  success: boolean;
  message: string;

  data: {
    inquiries: ContactInquiry[];

    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };

    summary: {
      new: number;
      inProgress: number;
      resolved: number;
      closed: number;
      total: number;
    };
  };
}

export interface GetAdminContactsParams {
  page?: number;
  limit?: number;

  search?: string;

  status?: ContactInquiryStatus | "";

  type?: ContactInquiryType | "";
}

/* ================================================================
   API
================================================================ */

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* ============================================================
       PUBLIC CREATE
       POST /api/contact
    ============================================================ */

    createContactInquiry: builder.mutation<
      PublicContactResponse,
      ContactPayload
    >({
      query: (body) => ({
        url: API_URLS.CONTACT,
        method: "POST",
        body,
      }),
    }),

    /* ============================================================
       ADMIN LIST
       GET /api/contact/admin
    ============================================================ */

    getAdminContactInquiries: builder.query<
      AdminContactsResponse["data"],
      GetAdminContactsParams | void
    >({
      query: (params) => ({
        url: API_URLS.ADMIN_CONTACTS,

        method: "GET",

        params: {
          page: params?.page ?? 1,

          limit: params?.limit ?? 20,

          ...(params?.search
            ? {
                search: params.search,
              }
            : {}),

          ...(params?.status
            ? {
                status: params.status,
              }
            : {}),

          ...(params?.type
            ? {
                type: params.type,
              }
            : {}),
        },
      }),

      transformResponse: (response: AdminContactsResponse) => response.data,

      providesTags: (result) => [
        {
          type: "Contact",
          id: "LIST",
        },

        ...(result?.inquiries ?? []).map((item) => ({
          type: "Contact" as const,
          id: item._id,
        })),
      ],
    }),

    /* ============================================================
       ADMIN DETAIL
       GET /api/contact/admin/:id
    ============================================================ */

    getAdminContactInquiryById: builder.query<ContactInquiry, string>({
      query: (id) => ({
        url: API_URLS.ADMIN_CONTACT_BY_ID(id),

        method: "GET",
      }),

      transformResponse: (response: AdminContactResponse) => response.data,

      providesTags: (_result, _error, id) => [
        {
          type: "Contact",
          id,
        },
      ],
    }),

    /* ============================================================
       ADMIN STATUS UPDATE
       PATCH /api/contact/admin/:id/status
    ============================================================ */

    updateAdminContactInquiryStatus: builder.mutation<
      ContactInquiry,
      {
        id: string;
        status: ContactInquiryStatus;
      }
    >({
      query: ({ id, status }) => ({
        url: API_URLS.ADMIN_CONTACT_STATUS(id),

        method: "PATCH",

        body: {
          status,
        },
      }),

      transformResponse: (response: AdminContactResponse) => response.data,

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "Contact",
          id,
        },

        {
          type: "Contact",
          id: "LIST",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

/* ================================================================
   HOOKS
================================================================ */

export const {
  useCreateContactInquiryMutation,

  useGetAdminContactInquiriesQuery,

  useGetAdminContactInquiryByIdQuery,

  useUpdateAdminContactInquiryStatusMutation,
} = contactApi;
