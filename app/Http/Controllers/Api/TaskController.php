<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Task::where('user_id', $user->id);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortField = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_order', 'desc');

        $perPage = $request->get('per_page', 5);

        // Check if per_page is set in the request
        if ($request->has('per_page')) {
            $perPage = $request->get('per_page', $request->per_page);
        }

        return response()->json(
            $query->orderBy($sortField, $sortDirection)->paginate($perPage)
        );
    }

    /**
     * Store a newly created task in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100|unique:tasks,title',
            'content' => 'required|string',
            'status' => 'required|in:to-do,in-progress,done',
            'is_draft' => 'nullable|in:true,false,1,0',
            'image' => 'nullable|mimes:jpg,jpeg,png,bmp,gif,webp|max:4096'
        ]);

        $user = Auth::user();

        $task = new Task();
        $task->user_id = $user->id;
        $task->title = $validated['title'];
        $task->content = $validated['content'];
        $task->status = $validated['status'];
        $task->is_draft = $validated['is_draft'] === 'true' ? true : false;

        // Handle image upload
        if ($request->hasFile('image')) {
            $task->image_path = $request->file('image')->store('task_images', 'public');
        }

        $task->save();

        return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
    }

    /**
     * Toggle the draft status of a task.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleDraft($id)
    {
        $task = Task::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $task->is_draft = !$task->is_draft;
        $task->updated_at = now();
        $task->save();

        return response()->json([
            'message' => 'Draft status toggled successfully',
            'task' => $task
        ]);
    }

    /**
     * Update the status of a task.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:to-do,in-progress,done',
        ]);

        $task = Task::findOrFail($id);
        $task->status = $validated['status'];
        $task->updated_at = now();
        $task->save();

        return response()->json(['message' => 'Status updated successfully', 'task' => $task]);
    }

    /**
     * Update the specified task in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:100|unique:tasks,title,' . $id,
            'content' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:to-do,in-progress,done',
            'is_draft' => 'sometimes|in:true,false,1,0',
            'image' => 'nullable|mimes:jpg,jpeg,png,bmp,gif,webp|max:4096',
        ]);

        $task->fill($validated);

        if ($request->has('is_draft')) {
            $task->is_draft = filter_var($request->input('is_draft'), FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($task->image_path) {
                Storage::disk('public')->delete($task->image_path);
            }

            $task->image_path = $request->file('image')->store('task_images', 'public');
        }

        $task->save();

        return response()->json(['message' => 'Task updated successfully', 'task' => $task]);
    }

    /**
     * Remove the specified task from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);

        // Delete the image if it exists
        if ($task->image_path) {
            Storage::disk('public')->delete($task->image_path);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    /**
     * Display the specified task.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = auth()->user();

        $task = Task::where('user_id', $user->id)->findOrFail($id);

        return response()->json([
            'data' => $task,
        ]);
    }
}
