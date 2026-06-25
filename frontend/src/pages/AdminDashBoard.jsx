import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const fetchUsers = async (status = "") => {
    try {
      const token = localStorage.getItem("token");
      const url = status ? `/admin/users?status=${status}` : "/admin/users";
      const res = await API.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch users");
    }
  };

  const handleTab = (tab) => {
    setActiveTab(tab);
    fetchUsers(tab === "all" ? "" : tab);
  };

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/admin/users/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`User ${status} successfully`);
      fetchUsers(activeTab === "all" ? "" : activeTab);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const tabs = ["all", "pending", "approved", "rejected"];

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-6 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#4A5568]">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition duration-200 ${
                activeTab === tab
                  ? "bg-[#5c7cfa] text-white"
                  : "bg-white text-[#4A5568] border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f8fafc] text-[#4A5568] text-left">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-[#4A5568]">{user.name}</td>
                    <td className="px-6 py-4 text-[#4A5568]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusStyle[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.status !== "approved" && (
                          <button
                            onClick={() => handleStatus(user.id, "approved")}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg"
                          >
                            Approve
                          </button>
                        )}
                        {user.status !== "rejected" && (
                          <button
                            onClick={() => handleStatus(user.id, "rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg"
                          >
                            Reject
                          </button>
                        )}
                      </div>
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