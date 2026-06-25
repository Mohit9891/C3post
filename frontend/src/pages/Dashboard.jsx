import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-6 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#4A5568]">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-xl font-semibold text-[#4A5568] mb-2">Welcome to C3POST</h2>
          <p className="text-gray-400 text-sm">Your account has been approved. You are now logged in.</p>
        </div>

      </div>
    </div>
  );
}