import axios from "axios";
import { useEffect, useState } from "react";
import { PencilIcon } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import EditProfile from "./EditProfile";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Profile = () => {
  const [fetchedUser, setFetchedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });

        setFetchedUser(res.data?.user);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (formData) => {
    setError("");

    try {
      const allowedFields = [
        "firstName",
        "lastName",
        "gender",
        "age",
        "description",
        "photoUrl",
        "skills",
      ];

      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => allowedFields.includes(key)),
      );

      const res = await axios.patch(`${BASE_URL}/profile/edit`, filteredData, {
        withCredentials: true,
      });

      setFetchedUser(res.data.user);
      dispatch(addUser(res.data.user));
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">👤 My Profile</h1>
          <p className="text-base-content/60 mt-2">
            Manage your developer profile
          </p>
        </div>

        {error && (
          <div className="alert alert-error max-w-xl mx-auto mb-8">
            <span>{error}</span>
          </div>
        )}

        {/* CENTERED PROFILE WHEN NOT EDITING */}
        {!editMode && fetchedUser && (
          <div className="flex justify-center">
            <ProfileCard user={fetchedUser} onEdit={() => setEditMode(true)} />
          </div>
        )}

        {/* EDIT MODE LAYOUT */}
        {editMode && fetchedUser && (
          <div className="grid lg:grid-cols-2 gap-10">
            {/* EDIT FORM */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <EditProfile
                  user={fetchedUser}
                  onCancel={() => setEditMode(false)}
                  onSave={handleSave}
                  setFetchedUser={setFetchedUser}
                />
              </div>
            </div>

            {/* PROFILE PREVIEW */}
            <div className="flex justify-center">
              <ProfileCard
                user={fetchedUser}
                onEdit={() => setEditMode(true)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileCard = ({ user, onEdit }) => {
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      {/* COVER */}
      <div className="h-32 bg-gradient-to-r from-primary to-secondary rounded-t-xl"></div>

      <div className="card-body items-center text-center relative">
        {/* EDIT BUTTON */}
        <button
          className="btn btn-circle btn-sm absolute top-4 right-4"
          onClick={onEdit}
        >
          <PencilIcon size={16} />
        </button>

        {/* AVATAR */}
        <div className="-mt-20 avatar">
          <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
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
        <h2 className="text-2xl font-bold mt-4">
          {user.firstName} {user.lastName}
        </h2>

        {/* DETAILS */}
        <p className="text-base-content/60">
          {user.gender} • {user.age} years
        </p>

        {/* DESCRIPTION */}
        {user.description && (
          <p className="text-sm mt-3 text-base-content/70 max-w-sm">
            {user.description}
          </p>
        )}

        {/* SKILLS */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {user.skills?.length > 0 ? (
            user.skills.map((skill, i) => (
              <span key={i} className="badge badge-primary badge-outline">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-base-content/50">
              No skills added
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
