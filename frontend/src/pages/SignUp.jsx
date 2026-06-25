import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    company_name: "",
    expected_orders: "",
    referral_code: "",
  });
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
      const res = await API.post("/auth/signup", formData);
      alert(res.data.message);
      setFormData({
        name: "",
        email: "",
        contact: "",
        password: "",
        company_name: "",
        expected_orders: "",
        referral_code: "",
      });
      setAgreeTerms(true);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f7fe] p-4 font-sans text-[#333333]">
      <div className="bg-white w-full max-w-[640px] rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-[#4A5568] mb-8">
          Sign up to C3POST
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#5c7cfa] placeholder:text-[#cbd5e1]"
            />
          </div>

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

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Contact
            </label>
            <div className="flex rounded-lg overflow-hidden border border-[#e2e8f0]">
              <span className="bg-[#616e88] text-white px-4 py-3 text-sm font-medium flex items-center justify-center min-w-[55px]">
                +91
              </span>
              <input
                name="contact"
                type="tel"
                placeholder="Enter contact number"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] text-sm focus:outline-none placeholder:text-[#cbd5e1]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#5c7cfa] placeholder:text-[#cbd5e1]"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Company Name
            </label>
            <input
              name="company_name"
              type="text"
              placeholder="Enter company name"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#5c7cfa] placeholder:text-[#cbd5e1]"
            />
          </div>

          {/* Expected Order */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Expected Order / month
            </label>
            <div className="relative">
              <select
                name="expected_orders"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm appearance-none focus:outline-none focus:border-[#5c7cfa] text-[#4A5568]"
              >
                <option value="">Select Expected Orders</option>
                <option value="0-50">0-50</option>
                <option value="50-200">50-200</option>
                <option value="200+">200+</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">
              Referral Code (Optional)
            </label>
            <input
              name="referral_code"
              type="text"
              placeholder="Enter referral code (optional)"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#5c7cfa] placeholder:text-[#cbd5e1]"
            />
          </div>

          {/* Terms checkbox */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white font-medium py-3 px-4 rounded-lg text-sm transition duration-200 shadow-sm"
          >
            Submit
          </button>
        </form>

        

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#5c7cfa] font-medium hover:underline focus:outline-none"
          >
            Login
          </button>
        </p>

        {/* Footer info line */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400 flex flex-wrap justify-center gap-1">
          <span>
            Support Email:{" "}
            <a
              href="mailto:support@c3post.com"
              className="text-[#5c7cfa] hover:underline"
            >
              support@c3post.com
            </a>
          </span>
          <span className="mx-2 hidden sm:inline">|</span>
          <span>
            Support Phone:{" "}
            <a
              href="tel:+918448867312"
              className="text-[#5c7cfa] hover:underline"
            >
              +91 8448867312
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
