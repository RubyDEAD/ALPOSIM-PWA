import api from "@/src/lib/api";

// Daily report
export const FetchDailyReport = (date: string) =>
  api.get(`/api/report/daily?date=${date}`);

// Weekly report
export const FetchWeeklyReport = (month: number, year: number) =>
  api.get(`/api/report/weekly?month=${month}&year=${year}`);

// Monthly report
export const FetchMonthlyReport = (year: number) =>
  api.get(`/api/report/monthly?year=${year}`);

// Yearly report
export const FetchYearlyReport = () =>
  api.get("/api/report/yearly");