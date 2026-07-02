import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { Trash2 } from "lucide-react";

export default function Orderbook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    seller_name: "",
    seller_address1: "",
    seller_address2: "",
    seller_pincode: "",
    seller_contact: "",
    buyer_name: "",
    buyer_address1: "",
    buyer_address2: "",
    buyer_pincode: "",
    buyer_contact: "",
    order_value: "",
    booking_date: "",
  });
  const [packages, setPackages] = useState([
    { order_weight: "", length: "", width: "", height: "" },
  ]);
  const [carriers, setCarriers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePackageChange = (index, e) => {
    const updated = [...packages];
    updated[index][e.target.name] = e.target.value;
    setPackages(updated);
  };

  const addPackageRow = () => {
    setPackages([
      ...packages,
      { order_weight: "", length: "", width: "", height: "" },
    ]);
  };

  const handleGetRates = async () => {
    const first = packages[0];
    if (!first.order_weight || !first.length || !first.width || !first.height) {
      alert(
        "Please fill weight, length, width, height for at least one package",
      );
      return;
    }

    // Sum all package actual weights
    const totalWeight = packages.reduce(
      (sum, pkg) => sum + parseFloat(pkg.order_weight || 0),
      0,
    );

    // Sum all volumetric weights (each package has its own dimensions)
    const totalVolumetric = packages.reduce((sum, pkg) => {
      const vol =
        parseFloat(pkg.length || 0) *
        parseFloat(pkg.width || 0) *
        parseFloat(pkg.height || 0);
      return sum + vol;
    }, 0);

    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
        `/orders/carriers?weight=${totalWeight}&totalVolumetric=${totalVolumetric}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCarriers(res.data);
      setShowPopup(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch carriers");
    }
  };

  const handleSelectCarrier = async (carrier_id, price) => {
    try {
      const token = localStorage.getItem("token");
      const totalWeight = packages.reduce(
        (sum, pkg) => sum + parseFloat(pkg.order_weight || 0),
        0,
      );
      const gstAmount = (parseFloat(price) * 0.18).toFixed(2);
      const totalPrice = (parseFloat(price) * 1.18).toFixed(2);

      const res = await API.post(
        "/orders",
        {
          ...formData,
          order_weight: totalWeight,
          length: packages[0].length,
          width: packages[0].width,
          height: packages[0].height,
          carrier_id,
          base_price: price,
          gst: gstAmount,
          total_price: totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(`${res.data.message} - Order Number: ${res.data.order_number}`);
      setShowPopup(false);
      navigate("/orderlist");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create order");
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5c7cfa]";
  const labelClass = "block text-sm font-medium text-[#4A5568] mb-1";

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-[#4A5568] mb-6">
          Book an Order
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seller */}
          <div>
            <h3 className="font-medium text-[#4A5568] mb-4">Seller Details</h3>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  name="seller_name"
                  placeholder="Enter name"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Address 1 *</label>
                <input
                  name="seller_address1"
                  placeholder="Enter address"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Address 2</label>
                <input
                  name="seller_address2"
                  placeholder="Enter address (optional)"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  name="seller_pincode"
                  placeholder="Enter pincode"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Contact Number</label>
                <input
                  name="seller_contact"
                  placeholder="Enter contact"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Buyer */}
          <div>
            <h3 className="font-medium text-[#4A5568] mb-4">Buyer Details</h3>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  name="buyer_name"
                  placeholder="Enter name"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Address 1 *</label>
                <input
                  name="buyer_address1"
                  placeholder="Enter address"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Address 2</label>
                <input
                  name="buyer_address2"
                  placeholder="Enter address (optional)"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  name="buyer_pincode"
                  placeholder="Enter pincode"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Contact Number</label>
                <input
                  name="buyer_contact"
                  placeholder="Enter contact"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Package Rows */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-[#4A5568]">Package Details</h3>
            <button
              onClick={addPackageRow}
              className="flex items-center gap-1 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white text-xs px-3 py-1.5 rounded-lg"
            >
              + Add Package
            </button>
          </div>

          {/* Header */}
          <div className="grid grid-cols-4 gap-3 mb-1">
            {["Weight (kg)", "Length (cm)", "Width (cm)", "Height (cm)"].map(
              (h) => (
                <label key={h} className={labelClass}>
                  {h}
                </label>
              ),
            )}
          </div>

          {/* Rows */}
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-3 mb-2 items-center"
            >
              <input
                name="order_weight"
                type="number"
                placeholder="0"
                value={pkg.order_weight}
                onChange={(e) => handlePackageChange(index, e)}
                className={inputClass}
              />
              <input
                name="length"
                type="number"
                placeholder="0"
                value={pkg.length}
                onChange={(e) => handlePackageChange(index, e)}
                className={inputClass}
              />
              <input
                name="width"
                type="number"
                placeholder="0"
                value={pkg.width}
                onChange={(e) => handlePackageChange(index, e)}
                className={inputClass}
              />
              <div className="flex gap-2">
                <input
                  name="height"
                  type="number"
                  placeholder="0"
                  value={pkg.height}
                  onChange={(e) => handlePackageChange(index, e)}
                  className={inputClass}
                />
                {packages.length > 1 && (
                  <button
                    onClick={() =>
                      setPackages(packages.filter((_, i) => i !== index))
                    }
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Value and Booking Date */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Order Value (₹)</label>
            <input
              name="order_value"
              type="number"
              placeholder="Enter order value"
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Booking Date</label>
            <input
              name="booking_date"
              type="date"
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

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
            <h3 className="text-lg font-semibold text-[#4A5568] mb-4">
              Select a Carrier
            </h3>
            <div className="space-y-3">
              {carriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={carrier.image_url}
                      alt={carrier.name}
                      className="h-8 w-auto object-contain"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#4A5568]">
                        {carrier.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Chargeable: {carrier.chargeable_weight} kg
                      </p>

                      <p className="text-xs font-medium text-[#5c7cfa]">
                        Total: ₹{carrier.price}
                      </p>
                    </div>
                  </div>
                  {carrier.available ? (
                    <button
                      onClick={() =>
                        handleSelectCarrier(carrier.id, carrier.price)
                      }
                      className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white text-xs px-4 py-2 rounded-lg"
                    >
                      Ship
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
