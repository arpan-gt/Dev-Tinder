import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        BASE_URL + "/auth/login",
        { email, password },
        { withCredentials: true },
      );

      dispatch(addUser(res.data.user));
      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center ">Login</h2>

          {/* 🔴 Error Alert */}
          {error && (
            <div className="alert alert-error mt-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
            {/* Button */}
            <button
              type="submit"
              className={`btn btn-primary mt-4 ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center justify-center mb-3">
          <p className="text-gray-500">
            Create account here{" "}
            <Link className="text-gray-600 underline" to="/auth/signup">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
