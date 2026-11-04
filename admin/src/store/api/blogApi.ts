import { api } from "../api";

// ============================================================
// TYPES
// ============================================================

export type BlogStatus = "draft" | "published" | "archived";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  imageAlt?: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  status: BlogStatus;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogInput {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  imageAlt?: string;
  category: string;
  tags?: string[];
  author?: string;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export type BlogUpdateInput = Partial<BlogInput>;

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogListResponse {
  blogs: Blog[];
  pagination: BlogPagination;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  status?: BlogStatus;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============================================================
// BLOG API
// ============================================================

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL BLOGS - ADMIN
    getAllBlogsAdmin: builder.query<BlogListResponse, BlogListParams | void>({
      query: (params) => ({
        url: "/blogs/admin/all",
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<BlogListResponse>) =>
        response.data,
      providesTags: ["Blog"],
    }),

    // GET BLOG BY ID - ADMIN
    getBlogByIdAdmin: builder.query<Blog, string>({
      query: (id) => `/blogs/admin/${id}`,
      transformResponse: (response: ApiResponse<Blog>) => response.data,
      providesTags: ["Blog"],
    }),

    // CREATE BLOG
    // CREATE BLOG - WITH IMAGE UPLOAD
    createBlog: builder.mutation<Blog, FormData>({
      query: (formData) => ({
        url: "/blogs",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<Blog>) => response.data,
      invalidatesTags: ["Blog"],
    }),

    // UPDATE BLOG
    updateBlog: builder.mutation<Blog, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Blog>) => response.data,
      invalidatesTags: ["Blog"],
    }),

    // PUBLISH BLOG
    publishBlog: builder.mutation<Blog, string>({
      query: (id) => ({
        url: `/blogs/${id}/publish`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<Blog>) => response.data,
      invalidatesTags: ["Blog"],
    }),

    // UNPUBLISH BLOG
    unpublishBlog: builder.mutation<Blog, string>({
      query: (id) => ({
        url: `/blogs/${id}/unpublish`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<Blog>) => response.data,
      invalidatesTags: ["Blog"],
    }),

    // ARCHIVE BLOG
    archiveBlog: builder.mutation<Blog, string>({
      query: (id) => ({
        url: `/blogs/${id}/archive`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<Blog>) => response.data,
      invalidatesTags: ["Blog"],
    }),

    // DELETE BLOG
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetAllBlogsAdminQuery,
  useGetBlogByIdAdminQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  usePublishBlogMutation,
  useUnpublishBlogMutation,
  useArchiveBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
