/* ---------- CATEGORY TYPES ---------- */

export interface CategoryDTO {
    _id: string;
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    categoryDescription?: string;
    icon?: string;
    displayOrder: number;
    isActive: boolean;
    metadata?: {
        productCount?: number;
    };
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface CreateCategoryPayload {
    categoryName: string;
    categorySlug: string;
    categoryDescription?: string;
    icon?: string;
    displayOrder: number;
    isActive?: boolean;
}

export interface UpdateCategoryPayload {
    categoryName?: string;
    categorySlug?: string;
    categoryDescription?: string;
    icon?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface CategoryWithProducts extends CategoryDTO {
    products: {
        productId: string;
        productTitle: string;
        modelCount: number;
    }[];
}

export interface CategoryTreeItem extends CategoryDTO {
    children?: CategoryTreeItem[];
}

/* ---------- API RESPONSE ---------- */
export interface CategoryApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    error?: string;
    count?: number;
}

export interface PaginatedCategoryResponse {
    categories: CategoryDTO[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Simple list response (when API returns data array directly)
export interface CategoryListResponse {
    success: boolean;
    count: number;
    data: CategoryDTO[];
}

/* ---------- QUERY PARAMS ---------- */
export interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: 'categoryId' | 'categoryName' | 'displayOrder' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface ProductsByCategoryParams {
    page?: number;
    limit?: number;
    sortBy?: 'price' | 'createdAt' | 'productTitle';
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
}

