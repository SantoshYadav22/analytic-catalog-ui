"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { getTopRevenueRestaurants, getRestaurantOrders } from "../services/restaurantService";
import DateRangeDialog from "./DateRangeDialog";
import FilterSidebar from "./FilterSidebar";
import OrderTrends from "./OrderTrends";

export default function RestaurantList({ restaurants }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [restaurantData, setRestaurantData] = useState(restaurants);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedRestaurantIds, setExpandedRestaurantIds] = useState([]);

  const handleTopRevenueClick = () => setIsDialogOpen(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleOrders = (id) => {
    setExpandedRestaurantIds((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const handleLoadMoreOrders = async (restaurantId) => {
    setLoading(true);
    try {
      const restaurant = restaurantData.find(r => r.id === restaurantId);
      const nextPage = restaurant.orders.current_page + 1;

      const params = {
        restaurant_id: restaurantId,
        page: nextPage
      };

      const data = await getRestaurantOrders(params);

      restaurant.orders.data = [...restaurant.orders.data, ...data.orders.data];
      restaurant.orders.current_page = data.orders.current_page;
      restaurant.orders.total = data.orders.total;

      setRestaurantData([...restaurantData]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = async (filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.restaurant) params.restaurant_id = filters.restaurant;
      if (filters.dateRange.start) params.start_date = filters.dateRange.start;
      if (filters.dateRange.end) params.end_date = filters.dateRange.end;
      if (filters.amountMin) params.amount_min = filters.amountMin;
      if (filters.amountMax) params.amount_max = filters.amountMax;
      if (filters.hourMin) params.hour_min = filters.hourMin;
      if (filters.hourMax) params.hour_max = filters.hourMax;

      const data = await getRestaurantOrders(params);

      const restaurants = Array.isArray(data) ? data : data?.id ? [data] : [];
      if (!restaurants || restaurants.length === 0) {
        setError("No restaurants found for the selected date.");
        setRestaurantData([]);
        return;
      }

      setRestaurantData(restaurants);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const displayedRestaurants = restaurantData || [];

  const handleDialogSubmit = async (startDate, endDate) => {
    setIsDialogOpen(false);

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getTopRevenueRestaurants({ start_date: startDate, end_date: endDate });

      if (!data || data.length === 0) {
        setError("No restaurants found for the selected date range.");
        setRestaurantData([]);
        return;
      }

      setRestaurantData(data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch top revenue restaurants:", err);
      setError("Failed to fetch top revenue restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedRestaurants = useMemo(() => {
    if (!sortConfig.key) return Array.isArray(restaurantData) ? restaurantData : [restaurantData];

    return [...(Array.isArray(restaurantData) ? restaurantData : [restaurantData])].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "orders_sum_order_amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [restaurantData, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            </svg>

            <h2 className="text-xl font-bold text-white">Restaurants</h2>
          </div>
          <p className="text-white/90 text-sm mt-1">Manage your restaurant analytics</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleTopRevenueClick}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
              />
            </svg>
            <span>Top 3 Restaurants by Revenue</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={toggleSidebar} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <span>Filter</span>
          </button>

          <FilterSidebar
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            onApply={handleFilterApply}
            restaurants={restaurants}
          />

        <OrderTrends restaurants={restaurants} />
        </div>

      </div>

      {error && (
        <div className="text-red-600 text-sm px-6 py-2">{error}</div>
      )}

      {loading && (
        <div className="text-gray-500 text-sm px-6 py-2">Loading top restaurants...</div>
      )}

      <div className="overflow-x-auto">
        {displayedRestaurants.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No restaurants found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th onClick={() => handleSort("name")} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none">
                  <div className="flex items-center space-x-1">
                    <span>Restaurant Name</span>
                    {getSortIcon("name")}
                  </div>
                </th>
                <th onClick={() => handleSort("location")} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none">
                  <div className="flex items-center space-x-1">
                    <span>Location</span>
                    {getSortIcon("location")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort("orders_sum_order_amount")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Revenue</span>
                    {getSortIcon("orders_sum_order_amount")}
                  </div>
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRestaurants.map((r, index) => (
                <React.Fragment key={r.id}>
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-4 shadow-sm">
                          <span className="text-white font-bold text-sm">{r.name ? r.name.charAt(0).toUpperCase() : "-"}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{r.name || "Unnamed Restaurant"}</h3>
                          <p className="text-xs text-gray-500 mt-1">Restaurant #{String(index + 1).padStart(3, "0")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                          <svg className="h-3 w-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{r.location || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{r.orders_sum_order_amount ? Number(r.orders_sum_order_amount).toLocaleString() : "0"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Link href={`/restaurants/${r.id}`} className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">View</Link>

                      {r.orders && r.orders.data.length > 0 && (
                        <button
                          onClick={() => toggleOrders(r.id)}
                          className="mx-2 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          {expandedRestaurantIds.includes(r.id) ? "Hide Orders" : "Show Orders"}
                        </button>
                      )}
                    </td>
                  </tr>

                  {expandedRestaurantIds.includes(r.id) && r.orders && r.orders.data.length > 0 && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-2">
                        <div className="space-y-2 max-h-72 overflow-y-auto px-2 py-1">
                          <div className="flex justify-between bg-gray-100 p-2 rounded font-semibold text-gray-700">
                            <span>Order ID</span>
                            <span>Amount</span>
                            <span>Date / Time</span>
                          </div>
                          {r.orders.data.map((order) => (
                            <div
                              key={order.id}
                              className="flex justify-between bg-white p-2 rounded shadow-sm text-black"
                            >
                              <span>Order #{order.id}</span>
                              <span>₹{Number(order.order_amount).toLocaleString()}</span>
                              <span>{new Date(order.order_time).toLocaleString()}</span>
                            </div>
                          ))}

                          {r.orders.current_page * r.orders.per_page < r.orders.total && (
                            <div className="flex justify-center mt-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 text-sm px-4 py-2 bg-gray-100 rounded"
                                onClick={() => handleLoadMoreOrders(r.id)}
                              >
                                Load More Orders
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {restaurantData.length === 0 && !loading && !error && (
        <div className="text-center py-16">
          <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
        </div>
      )}

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {restaurantData.length} restaurant{restaurantData.length !== 1 ? "s" : ""}
        </p>
        <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => setRestaurantData(restaurants)}>Show All</button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={toggleSidebar}
        />
      )}
      <DateRangeDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSubmit={handleDialogSubmit} />
    </div>
  );
}
