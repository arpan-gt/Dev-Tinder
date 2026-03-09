import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate, useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${action}/${userId}`,
        {},
        { withCredentials: true },
      );

      navigate("/user/feed");
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/profile/${userId}`, {
          withCredentials: true,
        });

        setUser(res.data?.user);
      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 py-14 px-6">
      {error && (
        <div className="alert alert-error max-w-xl mx-auto mb-8">
          <span>{error}</span>
        </div>
      )}

      {user && (
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-2xl border border-base-300">
            {/* COVER */}
            <div className="h-40 bg-gradient-to-r from-primary to-secondary rounded-t-xl"></div>

            {/* PROFILE BODY */}
            <div className="card-body items-center text-center">
              {/* AVATAR */}
              <div className="-mt-24 avatar">
                <div className="w-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                  <img
                    src={
                      user.photoUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`
                    }
                    alt="profile"
                  />
                </div>
              </div>

              {/* NAME */}
              <h1 className="text-3xl font-bold mt-4">
                {user.firstName} {user.lastName}
              </h1>

              {/* DETAILS */}
              <p className="text-base-content/60">
                {user.age} • {user.gender}
              </p>

              <p className="text-base-content/50 text-sm">{user.email}</p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => handleAction("ignore", user._id)}
                  className="btn btn-error btn-sm"
                >
                  Ignore
                </button>

                <button
                  onClick={() => handleAction("interested", user._id)}
                  className="btn btn-success btn-sm"
                >
                  Interested
                </button>
              </div>

              {/* ABOUT */}
              {user.description && (
                <div className="mt-8 max-w-xl">
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-base-content/70 text-sm">
                    {user.description}
                  </p>
                </div>
              )}

              {/* SKILLS */}
              {user.skills?.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Skills</h2>

                  <div className="flex flex-wrap justify-center gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge badge-primary badge-outline"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
