import api from "./api";

export const getRestaurants = async (params = {}) => {
  const res = await api.get("/restaurants", { params });
  return res.data;
};

export const getTopRevenueRestaurants = async (params = {}) => {
  const res = await api.get("/restaurants/top-revenue", { params });
  return res.data;
};

export const getRestaurantOrders = async (params = {}) => {
  const res = await api.get("/restaurants/orders", { params });
  return res.data;
};

export const getRestaurantOrderTrends = async (params = {}) => {
  const res = await api.get("/restaurants/order/trends", { params });
  return res.data;
};