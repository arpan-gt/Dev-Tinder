import React, { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Body from "./components/Body.jsx";
import MyConnections from "./components/MyConnections.jsx";
import Feed from "./components/Feed.jsx";
import Profile from "./components/Profile.jsx";
import MyRequests from "./components/MyRequests.jsx";
import UserProfile from "./components/UserProfile.jsx";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "./utils/constants.js";
import { addUser } from "./utils/userSlice.js";
import UserDetailProfile from "./components/UserDetailProfile.jsx";
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data.user));
      } catch (error) {
        dispatch(addUser(null));
        console.log(error.response?.data.message);
      }
    }
    fetchUser();
  }, [dispatch]);

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Feed />} />
            <Route path="/auth/signup" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />

            <Route path="/user/feed" element={<Feed />} />
            <Route path="/user/requests" element={<MyRequests />} />
            <Route path="/user/connections" element={<MyConnections />} />
            <Route
              path="/user/connection/profile/:userId"
              element={<UserDetailProfile />}
            />

            <Route path="/profile/view" element={<Profile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
