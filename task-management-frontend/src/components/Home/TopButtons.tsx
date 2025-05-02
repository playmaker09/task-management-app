import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";

const TopButtons = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <div className="flex gap-2">
                <button
                    onClick={() => navigate("/create")}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold shadow cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <FaPlus />
                        Create Task
                    </span>
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold shadow cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <GrLogout />
                        Logout
                    </span>
                </button>
            </div>
        </>
    );
};

export default TopButtons;
