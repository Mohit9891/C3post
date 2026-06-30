import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("You must agree to the Terms & Conditions");
      return;
    }
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      alert(res.data.message);
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f7fe] p-4 font-sans text-[#333333]">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-[#1a1aff] mb-6 tracking-wide">
        C3POST
      </h1>

      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h2 className="text-center text-xl font-semibold text-[#4A5568] mb-8">
          Sign in to C3POST
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#5c7cfa] placeholder:text-[#cbd5e1]"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[#4A5568]">
                Password
              </label>
              <a href="#" className="text-sm text-gray-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#5c7cfa] placeholder:text-[#cbd5e1]"
            />
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-[#5c7cfa] bg-gray-100 border-gray-300 rounded focus:ring-[#5c7cfa]"
            />
            <label htmlFor="terms" className="text-xs text-[#4A5568]">
              I agree to the{" "}
              <a href="#" className="text-[#5c7cfa] hover:underline">
                Terms & Condition
              </a>{" "}
              &{" "}
              <a href="#" className="text-[#5c7cfa] hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white font-medium py-3 px-4 rounded-lg text-sm transition duration-200 shadow-sm"
          >
            Log In
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-[#5c7cfa] font-medium hover:underline focus:outline-none"
          >
            Signup now
          </button>
        </p>
      </div>
    </div>
  );
}
