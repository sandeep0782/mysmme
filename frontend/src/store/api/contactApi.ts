import { api, BASE_URL } from "../api";

/* ================================================================
   API URLS
================================================================ */

const API_URLS = {
  CONTACT: `${BASE_URL}/contact`,
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
  id: string;
  status: string;
  createdAt: string;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  data: ContactInquiry;
}

/* ================================================================
   API
================================================================ */

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContactInquiry: builder.mutation<ContactApiResponse, ContactPayload>({
      query: (body) => ({
        url: API_URLS.CONTACT,
        method: "POST",
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

/* ================================================================
   HOOKS
================================================================ */

export const { useCreateContactInquiryMutation } = contactApi;
