"use client";
import { useState } from "react";
import { getRestaurantOrderTrends } from "../services/restaurantService";

export default function OrderTrends({ restaurants }) {
    const [isOpen, setIsOpen] = useState(false);
    const [restaurantId, setRestaurantId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [trendsData, setTrendsData] = useState(null);

    const fetchTrends = async () => {
        if (!restaurantId || !startDate || !endDate) return;
        setLoading(true);

        try {
            const data = await getRestaurantOrderTrends({
                restaurant_id: restaurantId,
                start_date: startDate,
                end_date: endDate,
            });
            setTrendsData(data);
        } catch (error) {
            console.error("Error fetching trends:", error);
        } finally {
            setLoading(false);
        }
    };

    const transformTrendsData = (data) => {
        if (!data || !data.daily_orders) return [];
        const dates = Object.keys(data.daily_orders);
        return dates.map((date) => ({
            date,
            orders: data.daily_orders[date],
            revenue: data.daily_revenue[date],
            avgOrderValue: data.avg_order_value[date],
            peakHour: data.peak_hour[date],
        }));
    };

    const formattedData = transformTrendsData(trendsData);

    return (
        <>
            <button
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setIsOpen(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                    />
                </svg>
                <span>Trends</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl h-[80vh] relative flex flex-col">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Restaurant Trends
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-black mb-1">
                                Select Restaurant
                            </label>
                            <select
                                value={restaurantId}
                                onChange={(e) => setRestaurantId(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm text-black"
                            >
                                <option value="">-- Select --</option>
                                {restaurants?.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm text-black"
                                />
                            </div>
                        </div>

                        <button
                            onClick={fetchTrends}
                            disabled={loading}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Get Trends"}
                        </button>

                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

                            {formattedData?.map((day) => (
                                <div key={day.date} className="p-4 bg-gray-50 rounded-lg shadow mb-3">
                                    <h3 className="font-semibold text-gray-800 mb-2">{day.date}</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="p-2 bg-white rounded shadow-sm">
                                            <span className="block font-medium text-gray-600">Orders</span>
                                            <span className="text-gray-900">{day.orders}</span>
                                        </div>
                                        <div className="p-2 bg-white rounded shadow-sm">
                                            <span className="block font-medium text-gray-600">Revenue</span>
                                            <span className="text-gray-900">₹{day.revenue}</span>
                                        </div>
                                        <div className="p-2 bg-white rounded shadow-sm">
                                            <span className="block font-medium text-gray-600">Avg Order Value</span>
                                            <span className="text-gray-900">₹{day.avgOrderValue}</span>
                                        </div>
                                        <div className="p-2 bg-white rounded shadow-sm">
                                            <span className="block font-medium text-gray-600">Peak Hour</span>
                                            <span className="text-gray-900">{day.peakHour}:00 hrs</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
