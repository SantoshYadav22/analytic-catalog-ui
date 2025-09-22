"use client";

import { useEffect, useState } from "react";
import RestaurantList from "../../components/RestaurantList";
import { getRestaurants } from "../../services/restaurantService";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRestaurants();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filters.search]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getRestaurants({
        q: filters.search, 
        location: "",
        page: 1,
      });
      setRestaurants(data.data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>


      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <RestaurantList restaurants={restaurants} />
      )}
    </div>
  );
}
