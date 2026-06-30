import { useEffect, useState } from "react";
import API from "../utils/axios";

export default function Orderlist() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusLabel = (status) => (status === 1 ? "Delivered" : "Pending");
  const statusStyle = (status) =>
    status === 1 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#4A5568] mb-6">My Orders</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8fafc] text-[#4A5568] text-left">
              <tr>
                <th className="px-6 py-4 font-medium">Order #</th>
                <th className="px-6 py-4 font-medium">Carrier</th>
                <th className="px-6 py-4 font-medium">Buyer</th>
                <th className="px-6 py-4 font-medium">Weight</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Booking Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-[#4A5568]">{order.order_number}</td>
                    <td className="px-6 py-4 text-[#4A5568]">{order.carrier_name || "-"}</td>
                    <td className="px-6 py-4 text-[#4A5568]">{order.buyer_name}</td>
                    <td className="px-6 py-4 text-[#4A5568]">{order.order_weight} kg</td>
                    <td className="px-6 py-4 text-[#4A5568]">₹{order.order_value}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(order.booking_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusStyle(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}