"use client";
import { useState } from "react";

export default function FilterSidebar({ isOpen, onClose, onApply, restaurants }) {
  const [restaurant, setRestaurant] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [hourMin, setHourMin] = useState("");
  const [hourMax, setHourMax] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleApply = () => {
    onApply({ restaurant, dateRange, amountMin, amountMax, hourMin, hourMax });
    onClose();
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 z-40 w-80 h-screen p-6 overflow-y-auto bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900 rounded-full p-2 absolute top-4 right-4 hover:bg-gray-200 transition"
        >
          ✕
        </button>

        <h5 className="text-lg font-bold text-gray-700 mb-6">Filter Options</h5>

        <div className="space-y-4">
          <label className="block text-gray-600 font-medium text-sm mb-1">Restaurant</label>
          <select
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition"
          >
            <option value="">Select Restaurant</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

           <label className="block text-gray-600 font-medium text-sm mb-1">Date Range</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
          </div>

           <label className="block text-gray-600 font-medium text-sm mb-1">Amount Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
            <input
              type="number"
              placeholder="Max"
              value={amountMax}
              onChange={(e) => setAmountMax(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
          </div>

           <label className="block text-gray-600 font-medium text-sm mb-1">Hour Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={hourMin}
              onChange={(e) => setHourMin(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
            <input
              type="number"
              placeholder="Max"
              value={hourMax}
              onChange={(e) => setHourMax(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
          </div>

          <button
            onClick={handleApply}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />}
    </>
  );
}
