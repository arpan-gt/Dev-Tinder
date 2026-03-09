import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useParams } from "react-router-dom";

const UserDetailProfile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setError("");
      setLoading(true);

      try {
        const res = await axios.get(`${BASE_URL}/profile/${userId}`, {
          withCredentials: true,
        });

        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
      {loading && (
        <span className="loading loading-spinner loading-lg text-primary"></span>
      )}

      {error && (
        <div className="alert alert-error shadow-lg">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && user && (
        <div className="w-full max-w-2xl">
          {/* Cover */}
          <div className="h-40 rounded-t-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"></div>

          {/* Card */}
          <div className="bg-base-100 backdrop-blur-lg shadow-2xl rounded-b-3xl p-8 text-center relative">
            {/* Avatar */}
            <div className="avatar absolute -top-16 left-1/2 -translate-x-1/2">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-xl">
                <img src={user.photoUrl} alt="profile" />
              </div>
            </div>

            {/* Name */}
            <h2 className="text-3xl font-bold mt-20">
              {user.firstName} {user.lastName}
            </h2>

            {/* Info */}
            <p className="opacity-70 mt-1">
              {user.age} • {user.gender}
            </p>

            {/* Email */}
            <p className="text-sm mt-1 opacity-60">{user.email}</p>

            <div className="divider my-6">Skills</div>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-3">
              {user.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-primary badge-lg shadow-md"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="opacity-60">No skills listed</span>
              )}
            </div>

            <div className="divider my-6"></div>

            {/* Joined Date */}
            <p className="text-xs opacity-50 mt-6">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailProfile;
