import api from "@/src/lib/api";

// Get all syncs
export const FetchSyncs = () =>
  api.get("/api/sync");

// Get sync by ID
export const FetchSyncById = (id: string) =>
  api.get(`/api/sync/${id}`);

// Get sync status by ID
export const FetchSyncStatus = (id: string) =>
  api.get(`/api/sync/${id}/status`);

// Get syncs by date range
export const FetchSyncsByDateRange = (startDate: string, endDate: string) =>
  api.get(`/api/sync/range?startDate=${startDate}&endDate=${endDate}`);

// Start sync
export const StartSync = () =>
  api.post("/api/sync/start");

// Stop sync
export const StopSync = () =>
  api.post("/api/sync/stop");

// Pull sync
export const PullSync = () =>
  api.post("/api/sync/pull");