import { useState } from "react";

import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/login", {
                email,
                password,
            });

            if (response.data.is_success) {
                localStorage.setItem("token", response.data.token);
                navigate("/");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message || "An unexpected error occurred."
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
                    Login your account
                </h1>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
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
                        type="password"
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded font-medium disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-sm text-center">
                    Not yet registered?{" "}
                    <Link to="/register" className="text-teal-600 font-medium">
                        Sign up here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
