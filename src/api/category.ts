import api from "@/src/lib/api";
import { CategoryInput } from "../schema/schema";

export const FetchCategories = () =>
    api.get("api/category");

export const FetchCategorybyName = (name: string) =>
    api.get(`api/category/${name}`);

export const FetchCategorybyId = (id: number) =>
    api.get(`api/category/${id}`);

export const CreateCategory = (data: CategoryInput) =>
    api.post("api/category", data)  

export const UpdateCategory = (id: number, data: CategoryInput) =>
    api.put(`api/category/${id}`, data);

export const DeleteCategory = (id: number) =>
    api.delete(`api/category/${id}`);



