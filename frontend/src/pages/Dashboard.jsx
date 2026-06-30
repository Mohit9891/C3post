import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#4A5568]">Welcome, {userName}</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex gap-4">
          <button onClick={() => navigate("/orderbook")} className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white px-6 py-3 rounded-lg text-sm font-medium">
            Orderbook
          </button>
          <button onClick={() => navigate("/orderlist")} className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white px-6 py-3 rounded-lg text-sm font-medium">
            Orderlist
          </button>
        </div>
      </div>
    </div>
  );
}