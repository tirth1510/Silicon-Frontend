/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    getProductsByCategory,
    getCategoryTree,
    getActiveCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/services/category.api";
import {
    CategoryDTO,
    CreateCategoryPayload,
    UpdateCategoryPayload,
    CategoryQueryParams,
    ProductsByCategoryParams,
    CategoryListResponse,
    CategoryApiResponse,
    PaginatedCategoryResponse,
} from "@/types/category";

/* ---------- USE ALL CATEGORIES ---------- */
export const useCategories = (params?: CategoryQueryParams) => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllCategories(params);
            if (response.success) {
                // Handle simple list response (data is array directly)
                if (Array.isArray(response.data)) {
                    const listResponse = response as CategoryListResponse;
                    setCategories(listResponse.data);
                    setPagination({
                        total: listResponse.count || listResponse.data.length,
                        page: 1,
                        limit: listResponse.count || listResponse.data.length,
                        totalPages: 1,
                    });
                } else {
                    // Handle paginated response (data has categories and pagination)
                    const paginatedResponse = response as CategoryApiResponse<PaginatedCategoryResponse>;
                    setCategories(paginatedResponse.data.categories);
                    setPagination(paginatedResponse.data.pagination);
                }
            } else {
                const errorMessage = 'message' in response && response.message ? response.message : "Failed to fetch categories";
                setError(errorMessage);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, pagination, refetch: fetchCategories };
};

/* ---------- USE SINGLE CATEGORY ---------- */
export const useCategory = (categoryId?: string) => {
    const [category, setCategory] = useState<CategoryDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategory = useCallback(async () => {
        if (!categoryId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getCategoryById(categoryId);
            if (response.success) {
                setCategory(response.data);
            } else {
                setError(response.message || "Failed to fetch category");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

    return { category, loading, error, refetch: fetchCategory };
};

/* ---------- USE CATEGORY BY SLUG ---------- */
export const useCategoryBySlug = (slug?: string) => {
    const [category, setCategory] = useState<CategoryDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategory = useCallback(async () => {
        if (!slug) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getCategoryBySlug(slug);
            if (response.success) {
                setCategory(response.data);
            } else {
                setError(response.message || "Failed to fetch category");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

    return { category, loading, error, refetch: fetchCategory };
};

/* ---------- USE PRODUCTS BY CATEGORY ---------- */
export const useProductsByCategory = (
    categoryId?: string,
    params?: ProductsByCategoryParams
) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });

    const fetchProducts = useCallback(async () => {
        if (!categoryId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getProductsByCategory(categoryId, params);
            if (response.success) {
                setProducts(response.data.products);
                setPagination(response.data.pagination);
            } else {
                setError(response.message || "Failed to fetch products");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [categoryId, params]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, pagination, refetch: fetchProducts };
};

/* ---------- USE CATEGORY TREE ---------- */
export const useCategoryTree = () => {
    const [tree, setTree] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTree = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCategoryTree();
            if (response.success) {
                setTree(response.data);
            } else {
                setError(response.message || "Failed to fetch category tree");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTree();
    }, [fetchTree]);

    return { tree, loading, error, refetch: fetchTree };
};

/* ---------- USE ACTIVE CATEGORIES ---------- */
export const useActiveCategories = () => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getActiveCategories();
            if (response.success) {
                setCategories(response.data);
            } else {
                setError(response.message || "Failed to fetch active categories");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, refetch: fetchCategories };
};

/* ---------- USE CATEGORY MUTATIONS (ADMIN) ---------- */
export const useCategoryMutations = (token?: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (payload: CreateCategoryPayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await createCategory(payload, token);
            if (!response.success) {
                throw new Error(response.message || "Failed to create category");
            }
            return response.data;
        } catch (err: any) {
            setError(err.message || "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const update = async (categoryId: string, payload: UpdateCategoryPayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await updateCategory(categoryId, payload, token);
            if (!response.success) {
                throw new Error(response.message || "Failed to update category");
            }
            return response.data;
        } catch (err: any) {
            setError(err.message || "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (categoryId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await deleteCategory(categoryId, token);
            if (!response.success) {
                throw new Error(response.message || "Failed to delete category");
            }
            return response.data;
        } catch (err: any) {
            setError(err.message || "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, update, remove, loading, error };
};

