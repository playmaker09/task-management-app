import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillLeftCircle } from "react-icons/ai";
import axiosInstance from "../../utils/axiosInstance";
const CreateTask = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("to-do");
    const [isDraft, setIsDraft] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("status", status);
            formData.append("is_draft", isDraft ? "1" : "0");
            if (image) formData.append("image", image);

            const token = localStorage.getItem("token");

            await axiosInstance.post("/tasks", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Task creation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-2 border-teal-700 min-h-screen max-w-1/2 mx-auto p-6">
            <button
                onClick={() => navigate("/")}
                className="mb-4 text-xl text-teal-600 hover:underline "
            >
                <span className="flex items-center cursor-pointer gap-1">
                    <AiFillLeftCircle className="text-3xl" /> Back to home
                </span>
            </button>
            <hr />
            <h2 className="text-2xl font-bold my-4">Create Task</h2>

            {error && <p className="text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        maxLength={100}
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Content</label>
                    <textarea
                        rows={4}
                        className="w-full border px-3 py-2 rounded resize-y"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Status</label>
                    <select
                        className="w-full border px-3 py-2 rounded cursor-pointer"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="to-do">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        id="isDraft"
                        checked={isDraft}
                        onChange={() => setIsDraft(!isDraft)}
                    />
                    <label htmlFor="isDraft" className="text-sm">
                        Save as Draft
                    </label>
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Attach Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-700 cursor-pointer border border-gray-300 rounded focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded font-semibold disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Create Task"}
                </button>
            </form>
        </div>
    );
};

export default CreateTask;
