import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    skills: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((s) => s !== "");

      const payload = {
        ...formData,
        age: Number(formData.age),
        skills: skillsArray,
      };

      const res = await axios.post(BASE_URL + "/auth/signup", payload, {
        withCredentials: true,
      });

      console.log("REGISTER SUCCESS:", res.data);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        age: "",
        skills: "",
      });

      navigate("/auth/login");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="card bg-base-100 w-96 shadow-xl mx-auto mt-10"
    >
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl font-bold">
          Create Account
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleOnChange}
            placeholder="First Name"
            className="input input-bordered"
            required
          />

          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleOnChange}
            placeholder="Last Name"
            className="input input-bordered"
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleOnChange}
            placeholder="Email"
            className="input input-bordered"
            required
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleOnChange}
            placeholder="Password"
            className="input input-bordered"
            required
          />

          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleOnChange}
            placeholder="Age"
            className="input input-bordered"
            required
            min="18"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleOnChange}
            className="select select-bordered"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            name="skills"
            value={formData.skills}
            onChange={handleOnChange}
            placeholder="Skills (comma separated)"
            className="input input-bordered"
            required
          />
        </div>

        <div className="card-actions justify-center mt-4">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>
        <div className="flex flex-col justify-center items-center mb-3">
          <p className="text-gray-500">
            Already a user{"  "}
            <Link className="text-gray-600 underline" to="/auth/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Register;
