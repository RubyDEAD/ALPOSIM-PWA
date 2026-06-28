import api from "@/src/lib/api"

export const FetchProductHistory = (productId: string) =>
    api.get(`/api/ProductHistory/${productId}`);

