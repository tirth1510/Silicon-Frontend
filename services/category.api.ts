/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
    CategoryDTO,
    CreateCategoryPayload,
    UpdateCategoryPayload,
    CategoryWithProducts,
    CategoryTreeItem,
    CategoryApiResponse,
    PaginatedCategoryResponse,
    CategoryListResponse,
    CategoryQueryParams,
    ProductsByCategoryParams,
} from "@/types/category";

const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`,
});

/* ---------- PUBLIC ENDPOINTS ---------- */

/**
 * Get all categories with optional filters
 */
export const getAllCategories = async (
    params?: CategoryQueryParams
): Promise<CategoryListResponse | CategoryApiResponse<PaginatedCategoryResponse>> => {
    const res = await API.get<CategoryListResponse | CategoryApiResponse<PaginatedCategoryResponse>>("", {
        params,
    });
    return res.data;
};

/**
 * Get a single category by ID
 */
export const getCategoryById = async (
    categoryId: string
): Promise<CategoryApiResponse<CategoryDTO>> => {
    const res = await API.get<CategoryApiResponse<CategoryDTO>>(`/${categoryId}`);
    return res.data;
};

/**
 * Get category by slug (for SEO-friendly URLs)
 */
export const getCategoryBySlug = async (
    slug: string
): Promise<CategoryApiResponse<CategoryDTO>> => {
    const res = await API.get<CategoryApiResponse<CategoryDTO>>(`/slug/${slug}`);
    return res.data;
};

/**
 * Get products by category ID with pagination and filters
 */
export const getProductsByCategory = async (
    categoryId: string,
    params?: ProductsByCategoryParams
): Promise<CategoryApiResponse<any>> => {
    const res = await API.get<CategoryApiResponse<any>>(
        `/${categoryId}/products`,
        { params }
    );
    return res.data;
};

/**
 * Get category tree (nested structure)
 */
export const getCategoryTree = async (): Promise<
    CategoryApiResponse<CategoryTreeItem[]>
> => {
    const res = await API.get<CategoryApiResponse<CategoryTreeItem[]>>("/tree");
    return res.data;
};

/**
 * Get active categories only (for frontend display)
 */
export const getActiveCategories = async (): Promise<
    CategoryApiResponse<CategoryDTO[]>
> => {
    const res = await API.get<CategoryApiResponse<CategoryDTO[]>>("/active");
    return res.data;
};

/**
 * Get category with full product details
 */
export const getCategoryWithProducts = async (
    categoryId: string
): Promise<CategoryApiResponse<CategoryWithProducts>> => {
    const res = await API.get<CategoryApiResponse<CategoryWithProducts>>(
        `/${categoryId}/full`
    );
    return res.data;
};

/* ---------- ADMIN ENDPOINTS ---------- */

/**
 * Create a new category (Admin only)
 */
export const createCategory = async (
    payload: CreateCategoryPayload,
    token?: string
): Promise<CategoryApiResponse<CategoryDTO>> => {
    const res = await API.post<CategoryApiResponse<CategoryDTO>>("/", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
};

/**
 * Update category (Admin only)
 */
export const updateCategory = async (
    categoryId: string,
    payload: UpdateCategoryPayload,
    token?: string
): Promise<CategoryApiResponse<CategoryDTO>> => {
    const res = await API.put<CategoryApiResponse<CategoryDTO>>(
        `/${categoryId}`,
        payload,
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
    );
    return res.data;
};

/**
 * Delete category (Admin only)
 */
export const deleteCategory = async (
    categoryId: string,
    token?: string
): Promise<CategoryApiResponse<{ message: string; }>> => {
    const res = await API.delete<CategoryApiResponse<{ message: string; }>>(
        `/${categoryId}`,
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
    );
    return res.data;
};

/**
 * Assign product to category (Admin only)
 */
export const assignProductToCategory = async (
    productId: string,
    categoryId: string,
    token?: string
): Promise<CategoryApiResponse<any>> => {
    const res = await API.post<CategoryApiResponse<any>>(
        `/assign`,
        { productId, categoryId },
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
    );
    return res.data;
};

/**
 * Remove product from category (Admin only)
 */
export const removeProductFromCategory = async (
    productId: string,
    categoryId: string,
    token?: string
): Promise<CategoryApiResponse<any>> => {
    const res = await API.delete<CategoryApiResponse<any>>(
        `/assign/${productId}/${categoryId}`,
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
    );
    return res.data;
};

/**
 * Reorder categories (Admin only)
 */
export const reorderCategories = async (
    categoryOrders: { categoryId: string; displayOrder: number; }[],
    token?: string
): Promise<CategoryApiResponse<any>> => {
    const res = await API.put<CategoryApiResponse<any>>(
        `/reorder`,
        { categoryOrders },
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
    );
    return res.data;
};

/**
 * Toggle category active status (Admin only)
 */
export const toggleCategoryStatus = async (
    categoryId: string,
    token?: string
): Promise<CategoryApiResponse<CategoryDTO>> => {
    const res = await API.patch<CategoryApiResponse<CategoryDTO>>(
        `/${categoryId}/toggle-status`,
        {},
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
    );
    return res.data;
};

/* ---------- STATISTICS ---------- */

/**
 * Get category statistics (Admin only)
 */
export const getCategoryStats = async (
    token?: string
): Promise<CategoryApiResponse<any>> => {
    const res = await API.get<CategoryApiResponse<any>>("/stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
};

