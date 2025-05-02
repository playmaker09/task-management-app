import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/register", {
                name: name,
                email: email,
                password: password,
                password_confirmation: confirmPassword,
            });

            if (response.data.is_success) {
                alert(response.data.message);
                navigate("/login");
            }
        } catch (err: any) {
            setError(
                err.response.data.message || "An unexpected error occurred."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
            >
                <FaUserCircle className="text-6xl mx-auto text-teal-600" />
                <h1 className="text-2xl text-center font-bold">
                    Register an account
                </h1>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <div>
                    <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        type="name"
                        autoComplete="off"
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="off"
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="password"
                    >
                        Retype Password
                    </label>
                    <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        id="showPassword"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="showPassword" className="text-sm">
                        {" "}
                        Show password
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded font-medium 
                    cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Register"}
                </button>
                <p className="text-sm text-center">
                    Already registered?{" "}
                    <Link
                        to="/login"
                        className="text-teal-600 font-medium cursor-pointer"
                    >
                        Log in here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
