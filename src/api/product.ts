import api from "@/src/lib/api"
import { ProductInput } from "@/src/schema/schema"

export const FetchProducts = () =>
    api.get("/api/product");

export const FetchProductbyId = (id: string) =>
    api.get(`/api/product/${id}`);

export const FetchProductbyName = (name: string) =>
    api.get(`/api/product/${name}`);

export const FetchProductbyStatus = (status: string) =>
    api.get(`/api/product/${status}`);

export const FetchProductPaginated = (page: number, limit: number, status = "All", category = "All", search = "") =>
  api.get(`/api/product/paged?page=${page}&limit=${limit}&status=${status}&category=${category}&search=${search}`);

export const FetchProductbyCategory = (category: string) =>
    api.get(`/api/product/${category}`);

export const CreateProduct = (data: ProductInput) =>
    api.post("/api/product", data)

export const UpdateProduct = (id: string, data: ProductInput) =>
    api.put(`/api/product/${id}`, data);

export const DeleteProduct = (id: string) =>
    api.delete(`/api/product/${id}`);

