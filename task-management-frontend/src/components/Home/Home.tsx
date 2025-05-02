import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

import TopButtons from "./TopButtons";
import TableFilters from "./Datatable/TableFilters";
import TablePerPage from "./Datatable/TablePerPage";
import TablePrevNextButtons from "./Datatable/TablePrevNextButtons";
import axiosInstance from "../../utils/axiosInstance";
interface Task {
    id: number;
    user_id: number;
    title: string;
    content: string;
    status: string;
    image_path: string;
    is_draft: number;
    created_at: string;
    updated_at: string;
}

interface TableInfo {
    from: number;
    to: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

const Home = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [tableInfo, setTableInfo] = useState<TableInfo>({
        from: 0,
        to: 0,
        total: 0,
        next_page_url: null,
        prev_page_url: null,
    });

    const imageUrl =
        window.location.origin ===
        "https://task-management-app-iox9.onrender.com"
            ? "https://task-management-app-iox9.onrender.com"
            : "http://localhost:8000";

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/tasks", {
                ...authHeader,
                params: {
                    page,
                    search: search,
                    sort_by: sortBy,
                    per_page: perPage,
                    ...(statusFilter && { status: statusFilter }),
                },
            });
            const records = response.data;
            setTasks(records.data);
            setTableInfo({
                from: records.from,
                to: records.to,
                total: records.total,
                next_page_url: records.next_page_url,
                prev_page_url: records.prev_page_url,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch tasks.");
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter, sortBy, perPage]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await axiosInstance.delete(`/tasks/${id}`, authHeader);
            setTasks((prev) => prev.filter((task) => task.id !== id));
            toast.success("Task deleted successfully.");
        } catch {
            toast.error("Failed to delete task.");
        }
    };

    const toggleDraftStatus = async (task: Task) => {
        try {
            const response = await axiosInstance.patch(
                `/tasks/${task.id}/toggle-draft`
            );
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === task.id
                        ? { ...t, is_draft: task.is_draft ? 0 : 1 }
                        : t
                )
            );
            toast.success(response.data.message);
        } catch {
            toast.error("Failed to toggle draft status.");
        }
    };

    const updateStatus = async (task: Task, newStatus: string) => {
        try {
            const response = await axios.patch(
                `/tasks/${task.id}/update-status`,
                { status: newStatus },
                authHeader
            );
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === task.id ? { ...t, status: newStatus } : t
                )
            );
            toast.success(response.data.message);
        } catch {
            toast.error("Failed to update task status.");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-12">
            <Toaster position="top-right" />
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Task Management</h1>
                    <TopButtons />
                </div>
                <div className="border-2 border-teal-700 bg-white p-6 rounded shadow-md mb-6">
                    <div className="flex flex-wrap mb-1 justify-between">
                        <TablePerPage setPerPage={setPerPage} />
                        <TableFilters
                            search={search}
                            setSearch={setSearch}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                        />
                    </div>
                    {loading ? (
                        <p className="text-gray-500">Loading tasks...</p>
                    ) : error ? (
                        <p className="text-rose-600">{error}</p>
                    ) : tasks.length === 0 ? (
                        <p className="text-gray-700">No tasks found.</p>
                    ) : (
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 shadow-md hover:shadow-lg transition bg-teal-600 rounded-lg flex gap-4"
                                >
                                    {task.image_path && (
                                        <img
                                            src={`${imageUrl}/storage/${task.image_path}`}
                                            alt="Task"
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex flex-col justify-between w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="font-bold text-lg text-white">
                                                    {task.title}
                                                </h2>
                                                <p className="font-light text-sm text-white mt-1">
                                                    {task.content}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end text-xs font-semibold">
                                                <button
                                                    aria-label="Toggle Draft"
                                                    onClick={() =>
                                                        toggleDraftStatus(task)
                                                    }
                                                    className={`px-2 py-1 rounded cursor-pointer ${
                                                        task.is_draft
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                                >
                                                    {task.is_draft
                                                        ? "DRAFT"
                                                        : "PUBLISHED"}
                                                </button>
                                                <select
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            task,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="bg-gray-100 text-green-700 px-2 py-1 rounded cursor-pointer"
                                                >
                                                    <option value="to-do">
                                                        TO DO
                                                    </option>
                                                    <option value="in-progress">
                                                        IN PROGRESS
                                                    </option>
                                                    <option value="done">
                                                        DONE
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-start mt-3 gap-3">
                                            <button
                                                aria-label="Edit Task"
                                                onClick={() =>
                                                    navigate(`/edit/${task.id}`)
                                                }
                                                className="bg-white text-teal-600 hover:bg-gray-100 px-3 py-1 rounded text-lg cursor-pointer"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                aria-label="Delete Task"
                                                onClick={() =>
                                                    handleDelete(task.id)
                                                }
                                                className="bg-white text-teal-600 hover:bg-gray-100 px-3 py-1 rounded text-lg cursor-pointer"
                                            >
                                                <BiTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <TablePrevNextButtons
                        tableInfo={tableInfo}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
