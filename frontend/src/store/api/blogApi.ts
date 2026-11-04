import { api } from "../api";

// ============================================================
// TYPES
// ============================================================

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
  isFeatured: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

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

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============================================================
// PUBLIC BLOG API
// ============================================================

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET PUBLISHED BLOGS
    getPublishedBlogs: builder.query<BlogListResponse, BlogQueryParams | void>({
      query: (params) => ({
        url: "/blogs",
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<BlogListResponse>) =>
        response.data,
      providesTags: ["Blog"],
    }),

    // GET BLOG BY SLUG
    getBlogBySlug: builder.query<Blog, string>({
      query: (slug) => `/blogs/slug/${encodeURIComponent(slug)}`,
      transformResponse: (response: ApiResponse<Blog>) => response.data,
      providesTags: ["Blog"],
    }),
  }),
});

export const { useGetPublishedBlogsQuery, useGetBlogBySlugQuery } = blogApi;
