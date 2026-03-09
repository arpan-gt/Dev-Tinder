import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const MyConnections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllConnections = async () => {
      setError("");
      setLoading(true);
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });

        dispatch(addConnections(res.data?.data ?? []));
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAllConnections();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200 py-12 px-6">
      {/* HEADER */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold">🤝 My Dev Connections</h1>
        <p className="text-base-content/70 mt-2">
          Developers who are connected with you
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="alert alert-error max-w-lg mx-auto shadow-lg">
          <span>{error}</span>
        </div>
      )}

      {/* CONNECTIONS GRID */}
      {!loading && !error && connections.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {connections.map((conn) => (
            <div
              key={conn._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition duration-300 border border-base-300"
            >
              {/* IMAGE */}
              <figure className="px-6 pt-6">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={conn.photoUrl || "https://via.placeholder.com/300"}
                      alt="user"
                    />
                  </div>
                </div>
              </figure>

              {/* CARD BODY */}
              <div className="card-body items-center text-center">
                <h2 className="card-title text-lg">
                  {conn.firstName} {conn.lastName}
                </h2>

                <p className="text-sm text-base-content/60">
                  {conn.age} • {conn.gender}
                </p>

                {/* DESCRIPTION */}
                {conn.description && (
                  <p className="text-sm text-base-content/70 line-clamp-3">
                    {conn.description}
                  </p>
                )}

                {/* SKILLS */}
                {conn.skills?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {conn.skills.map((skill, index) => (
                      <div key={index} className="badge badge-outline">
                        {skill}
                      </div>
                    ))}
                  </div>
                )}

                {/* ACTION BUTTON */}
                <div className="card-actions mt-4">
                  <Link
                    to={`/user/connection/profile/${conn._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && connections.length === 0 && (
        <div className="flex flex-col items-center mt-20 text-center">
          <div className="text-6xl mb-4">😔</div>

          <h2 className="text-2xl font-semibold">No Connections Yet</h2>

          <p className="text-base-content/60 mt-2">
            Start connecting with developers from the feed.
          </p>

          <Link to="/feed" className="btn btn-primary mt-6">
            Explore Developers
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyConnections;
