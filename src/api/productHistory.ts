import api from "@/src/lib/api"

export const FetchProductHistory = (productId: string) =>
    api.get(`/api/ProductHistory/id?productId=${productId}`);

export const FetchProductHistories = () =>
    api.get(`/api/ProductHistory`);