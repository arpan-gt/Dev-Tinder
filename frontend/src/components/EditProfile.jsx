import { X } from "lucide-react";

const EditProfile = ({ onCancel, user, onSave, setFetchedUser }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "skills") {
      setFetchedUser((prev) => ({
        ...prev,
        skills: value.split(",").map((s) => s.trim()),
      }));
    } else {
      setFetchedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    onSave(user);
  };

  return (
    <div className="card bg-base-100 shadow-xl w-[360px]">
      <div className="card-body">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Edit Profile</h2>

          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-3">
          <input
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="input input-bordered w-full"
            required
          />

          <input
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="input input-bordered w-full"
          />

          <input
            name="gender"
            value={user.gender}
            onChange={handleChange}
            placeholder="Gender"
            className="input input-bordered w-full"
            required
          />

          <input
            name="age"
            type="number"
            value={user.age}
            onChange={handleChange}
            placeholder="Age"
            className="input input-bordered w-full"
            required
          />

          <input
            name="photoUrl"
            value={user.photoUrl}
            onChange={handleChange}
            placeholder="Photo URL"
            className="input input-bordered w-full"
            required
          />
          <textarea
            name="description"
            value={user.description}
            onChange={handleChange}
            placeholder="description"
            className="input input-bordered w-full"
          ></textarea>

          <input
            name="skills"
            value={user.skills?.join(", ")}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="input input-bordered w-full"
          />

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onCancel} className="btn btn-ghost">
              Cancel
            </button>

            <button onClick={handleSubmit} className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
