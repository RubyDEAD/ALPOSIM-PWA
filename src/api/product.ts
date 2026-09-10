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

export const FetchProductPaginated = (
  page: number,
  limit: number,
  status = "All",
  categoryId: number | undefined,
  search = ""
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status,
    search,
  });
  if (categoryId !== undefined) {
    params.set("categoryId", String(categoryId));
  }
  return api.get(`/api/product/paged?${params.toString()}`);
};

export const FetchProductbyCategory = (category: string) =>
    api.get(`/api/product/${category}`);

export const CreateProduct = (data: ProductInput) =>
    api.post("/api/product", data)

export const UpdateProduct = async (id: string, data: ProductInput, changedBy = "system") => {
    return api.put(`/api/product/${id}/${changedBy}`, data);
};

export const DeleteProduct = (id: string) =>
    api.delete(`/api/product/${id}`);



