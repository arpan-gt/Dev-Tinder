import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "../components/UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleAction = async (status, userId) => {
    try {
      setError("");

      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );

      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (feed.length > 0) return;

    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${BASE_URL}/user/feed`, {
          withCredentials: true,
        });

        dispatch(addFeed(res.data?.data));
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 py-12 px-6">
      {/* TITLE */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">🚀 Discover Developers</h1>
        <p className="text-base-content/60 mt-2">
          Connect with amazing developers around you
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="alert alert-error max-w-lg mx-auto">
          <span>{error}</span>
        </div>
      )}

      {/* EMPTY */}
      {!loading && feed?.length === 0 && (
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold">No more developers 😅</h2>
          <p className="text-base-content/60 mt-2">
            Come back later for more connections.
          </p>
        </div>
      )}

      {/* FEED GRID */}
      <div className="flex flex-wrap justify-center gap-10 mt-10">
        {!loading &&
          feed?.map((user) => (
            <UserCard key={user._id} user={user} onAction={handleAction} />
          ))}
      </div>
    </div>
  );
};

export default Feed;
