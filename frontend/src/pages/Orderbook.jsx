import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

export default function Orderbook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    seller_name: "", seller_address1: "", seller_address2: "", seller_pincode: "", seller_contact: "",
    buyer_name: "", buyer_address1: "", buyer_address2: "", buyer_pincode: "", buyer_contact: "",
    order_weight: "", length: "", width: "", height: "", order_value: "", booking_date: "",
  });
  const [carriers, setCarriers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetRates = async () => {
    const { order_weight, length, width, height } = formData;
    if (!order_weight || !length || !width || !height) {
      alert("Please fill weight, length, width, height first");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
        `/orders/carriers?weight=${order_weight}&length=${length}&width=${width}&height=${height}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCarriers(res.data);
      setShowPopup(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch carriers");
    }
  };

const handleSelectCarrier = async (carrier_id) => {
  console.log("Sending order data:", { ...formData, carrier_id });
  try {
    const token = localStorage.getItem("token");
    const res = await API.post(
      "/orders",
      { ...formData, carrier_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(`${res.data.message} - Order Number: ${res.data.order_number}`);
    setShowPopup(false);
    navigate("/orderlist");
  } catch (err) {
    alert(err.response?.data?.message || "Failed to create order");
  }
};

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-[#4A5568] mb-6">Book an Order</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seller Column */}
          <div>
            <h3 className="font-medium text-[#4A5568] mb-4">Seller Details</h3>
            <div className="space-y-3">
              <input name="seller_name" placeholder="Name" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              <input name="seller_address1" placeholder="Address 1*" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              <input name="seller_address2" placeholder="Address 2 (optional)" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              <input name="seller_pincode" placeholder="Pincode" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              <input name="seller_contact" placeholder="Contact Number" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>

          {/* Buyer Column */}
          <div>
            <h3 className="font-medium text-[#4A5568] mb-4">Buyer Details</h3>
            <div className="space-y-3">
              <input name="buyer_name" placeholder="Name" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              <input name="buyer_address1" placeholder="Address 1*" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              <input name="buyer_address2" placeholder="Address 2 (optional)" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              <input name="buyer_pincode" placeholder="Pincode" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              <input name="buyer_contact" placeholder="Contact Number" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Shared Order Fields */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <input name="order_weight" type="number" placeholder="Weight (kg)" onChange={handleChange} className="px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input name="length" type="number" placeholder="Length" onChange={handleChange} className="px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input name="width" type="number" placeholder="Width" onChange={handleChange} className="px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input name="height" type="number" placeholder="Height" onChange={handleChange} className="px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input name="order_value" type="number" placeholder="Order Value" onChange={handleChange} className="px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <input name="booking_date" type="date" onChange={handleChange} className="mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm" />

        <button
          onClick={handleGetRates}
          className="w-full mt-6 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white font-medium py-3 rounded-lg text-sm"
        >
          Get Rates
        </button>
      </div>

      {/* Carrier Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[#4A5568] mb-4">Select a Carrier</h3>
            <div className="space-y-3">
              {carriers.map((carrier) => (
                <div key={carrier.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img src={carrier.image_url} alt={carrier.name} className="h-8 w-auto object-contain" />
                    <div>
                      <p className="text-sm font-medium text-[#4A5568]">{carrier.name}</p>
                      <p className="text-xs text-gray-400">Chargeable: {carrier.chargeable_weight} kg</p>
                    </div>
                  </div>
                  {carrier.available ? (
                    <button
                      onClick={() => handleSelectCarrier(carrier.id)}
                      className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white text-xs px-4 py-2 rounded-lg"
                    >
                      Select
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">Not Available</span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full mt-4 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}