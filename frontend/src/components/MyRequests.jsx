import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { addConnections } from "../utils/connectionSlice";

const MyRequests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [error, setError] = useState("");

  const handleReview = async (status, requestId) => {
    try {
      setError("");
      setButtonLoading(requestId);

      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );

      dispatch(removeRequest(requestId));

      if (status === "accepted" && res.data?.newConnection) {
        dispatch(addConnections(res.data.newConnection));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setButtonLoading(null);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${BASE_URL}/user/requests`, {
          withCredentials: true,
        });

        dispatch(addRequest(res.data?.connectionRequests ?? []));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">📩 Connection Requests</h1>
        <p className="text-base-content/60 mt-2">
          Developers who want to connect with you
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* LOADING */}
        {loading && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="alert alert-error shadow-lg">
            <span>{error}</span>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && requests.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👀</div>

            <h2 className="text-2xl font-semibold">No Requests Yet</h2>

            <p className="text-base-content/60 mt-2">
              When developers send you requests, they will appear here.
            </p>
          </div>
        )}

        {/* REQUEST CARDS */}
        {!loading &&
          requests.map((request) => {
            const user = request.fromUserId;
            if (!user) return null;

            return (
              <div
                key={request._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition border border-base-300"
              >
                <div className="card-body flex-row items-center justify-between">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div className="avatar">
                      <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={
                            user.photoUrl || "https://via.placeholder.com/150"
                          }
                          alt="profile"
                        />
                      </div>
                    </div>

                    {/* User Info */}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills?.length > 0 ? (
                          user.skills.map((skill, idx) => (
                            <div key={idx} className="badge badge-outline">
                              {skill}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-base-content/50">
                            No skills added
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3">
                    <button
                      disabled={buttonLoading === request._id}
                      onClick={() => handleReview("accepted", request._id)}
                      className="btn btn-success btn-sm"
                    >
                      {buttonLoading === request._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Accept"
                      )}
                    </button>

                    <button
                      disabled={buttonLoading === request._id}
                      onClick={() => handleReview("rejected", request._id)}
                      className="btn btn-error btn-sm"
                    >
                      {buttonLoading === request._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyRequests;
