import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch order");
      navigate("/orderlist");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  const statusLabel = order.status === 1 ? "Delivered" : "Pending";
  const statusStyle = order.status === 1 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-6 font-sans">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#4A5568]">Order Details</h1>
          <button
            onClick={() => navigate("/orderlist")}
            className="text-sm text-[#5c7cfa] hover:underline"
          >
            ← Back to Orders
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

          {/* Order Summary */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Order Number</p>
              <p className="text-lg font-semibold text-[#4A5568]">{order.order_number}</p>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-full ${statusStyle}`}>{statusLabel}</span>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Booking Date</p>
              <p className="text-sm text-[#4A5568]">{new Date(order.booking_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Chargeable Weight</p>
              <p className="text-sm text-[#4A5568]">{order.order_weight} kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Order Value</p>
              <p className="text-sm text-[#4A5568]">₹{order.order_value}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Dimensions</p>
              <p className="text-sm text-[#4A5568]">{order.length} × {order.width} × {order.height} cm</p>
            </div>
          </div>

          {/* Carrier Info */}
          {order.carrier_name && (
            <div className="flex items-center gap-3 bg-[#f8fafc] rounded-lg p-4">
              {order.image_url && <img src={order.image_url} alt={order.carrier_name} className="h-6 object-contain" />}
              <div>
                <p className="text-sm font-medium text-[#4A5568]">{order.carrier_name}</p>
                <p className="text-xs text-gray-400">{order.carrier_code}</p>
              </div>
            </div>
          )}

          {/* Seller / Buyer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div>
              <h3 className="font-medium text-[#4A5568] mb-3">Pickup (Seller) Details</h3>
              <div className="space-y-1.5 text-sm text-[#4A5568]">
                <p>{order.seller_name}</p>
                <p>{order.seller_address1}</p>
                {order.seller_address2 && <p>{order.seller_address2}</p>}
                <p>Pincode: {order.seller_pincode}</p>
                <p>Contact: {order.seller_contact}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-[#4A5568] mb-3">Buyer Details</h3>
              <div className="space-y-1.5 text-sm text-[#4A5568]">
                <p>{order.buyer_name}</p>
                <p>{order.buyer_address1}</p>
                {order.buyer_address2 && <p>{order.buyer_address2}</p>}
                <p>Pincode: {order.buyer_pincode}</p>
                <p>Contact: {order.buyer_contact}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}