import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CreateTask from "./components/Home/CreateTask";
import GuestRoute from "./components/Routing/GuestRoute";
import AuthRoute from "./components/Routing/AuthRoute";
import EditTask from "./components/Home/EditTask";
import CreateSubtask from "./components/Home/CreateSubtask";

function App() {
    return (
        <div className="bg-gray-100 text-gray-800 font-sans">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <GuestRoute>
                                <Login />
                            </GuestRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <GuestRoute>
                                <Register />
                            </GuestRoute>
                        }
                    />
                    <Route
                        path="/create"
                        element={
                            <AuthRoute>
                                <CreateTask />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <AuthRoute>
                                <Home />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/edit/:id"
                        element={
                            <AuthRoute>
                                <EditTask />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/create-subtask/:id"
                        element={
                            <AuthRoute>
                                <CreateSubtask />
                            </AuthRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
