import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import axios from "axios";
import { removeConnections } from "../utils/connectionSlice";
import { removeRequest } from "../utils/requestSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(removeRequest());
      navigate("/auth/login");
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-sm px-4">
      {/* LOGO */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Dev Tinder
        </Link>
      </div>
      {/* RIGHT SIDE */}
      <div className="flex gap-3 items-center">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />

        {/* USER DROPDOWN */}
        {user ? (
          <div className="dropdown dropdown-end">
            {/* AVATAR BUTTON */}
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  src={
                    user?.photoUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?._id}`
                  }
                  alt="user"
                />
              </div>
            </div>

            {/* DROPDOWN CONTENT */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50"
            >
              <li>
                <Link to="/profile/view">
                  Profile <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/user/connections/">My Connections</Link>
              </li>
              <li>
                <Link to="/user/requests/">My Requests</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/auth/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
