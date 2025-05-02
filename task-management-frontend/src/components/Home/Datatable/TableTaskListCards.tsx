import axios from "axios";
import toast from "react-hot-toast";
import { BiTrash } from "react-icons/bi";

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

interface TableTaskListProps {
    tasks: Task[];
    setTasks: (value: string) => void;
}

const TableTaskListCards: React.FC<TableTaskListProps> = ({
    tasks,
    authHeader,
}) => {
    const updateStatus = async (task: Task, newStatus: string) => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/api/tasks/${task.id}/update-status`,
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

    const toggleDraftStatus = async (task: Task) => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/api/tasks/${task.id}/toggle-draft`,
                {},
                authHeader
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

    return (
        <>
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="p-4 shadow-md hover:shadow-lg transition bg-teal-600 rounded-lg flex gap-4"
                >
                    {task.image_path && (
                        <img
                            src={`http://localhost:8000/storage/${task.image_path}`}
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
                                    onClick={() => toggleDraftStatus(task)}
                                    className={`px-2 py-1 rounded cursor-pointer ${
                                        task.is_draft
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                                >
                                    {task.is_draft ? "DRAFT" : "PUBLISHED"}
                                </button>
                                <select
                                    value={task.status}
                                    onChange={(e) =>
                                        updateStatus(task, e.target.value)
                                    }
                                    className="bg-gray-100 text-green-700 px-2 py-1 rounded cursor-pointer"
                                >
                                    <option value="to-do">TO DO</option>
                                    <option value="in-progress">
                                        IN PROGRESS
                                    </option>
                                    <option value="done">DONE</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-start mt-3 gap-3">
                            <button
                                aria-label="Edit Task"
                                onClick={() => navigate(`/edit/${task.id}`)}
                                className="bg-white text-teal-600 hover:bg-gray-100 px-3 py-1 rounded text-lg cursor-pointer"
                            >
                                <FaEdit />
                            </button>
                            <button
                                aria-label="Delete Task"
                                onClick={() => handleDelete(task.id)}
                                className="bg-white text-teal-600 hover:bg-gray-100 px-3 py-1 rounded text-lg cursor-pointer"
                            >
                                <BiTrash />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default TableTaskListCards;
