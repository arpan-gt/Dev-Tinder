import { Link } from "react-router-dom";

const UserCard = ({ user, onAction }) => {
  return (
    <div className="card w-[360px] bg-base-100 shadow-xl hover:shadow-2xl transition duration-300 border border-base-300">
      {/* COVER */}
      <figure className="relative h-40 bg-gradient-to-r from-primary to-secondary">
        <img
          src={
            user.photoUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`
          }
          alt="cover"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      </figure>

      {/* CARD BODY */}
      <div className="card-body items-center text-center relative">
        {/* AVATAR */}
        <Link to={`/profile/${user._id}`} className="-mt-20 avatar">
          <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
            <img
              src={
                user.photoUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`
              }
              alt="avatar"
            />
          </div>
        </Link>

        {/* NAME */}
        <h2 className="card-title text-xl">
          {user.firstName} {user.lastName}
        </h2>

        {/* AGE + GENDER */}
        <p className="text-base-content/60 text-sm">
          {user.age} • {user.gender}
        </p>

        {/* DESCRIPTION */}
        {user.description && (
          <p className="text-sm text-base-content/70 line-clamp-2 mt-2">
            {user.description}
          </p>
        )}

        {/* SKILLS */}
        {user.skills?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {user.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="badge badge-primary badge-outline">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-6 mt-5">
          <button
            onClick={() => onAction("ignore", user._id)}
            className="btn btn-circle btn-outline btn-error hover:scale-110 transition"
          >
            ✕
          </button>

          <button
            onClick={() => onAction("interested", user._id)}
            className="btn btn-circle btn-primary hover:scale-110 transition"
          >
            ❤
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
