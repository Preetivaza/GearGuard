import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Dashboard
import Dashboard from './pages/Dashboard';

// Profile
import Profile from './pages/Profile';

// Equipment Pages
import EquipmentList from './pages/equipment/EquipmentList';
import EquipmentForm from './pages/equipment/EquipmentForm';
import EquipmentDetail from './pages/equipment/EquipmentDetail';

// Request Pages
import RequestList from './pages/requests/RequestList';
import RequestForm from './pages/requests/RequestForm';
import KanbanBoard from './pages/requests/KanbanBoard';
import CalendarView from './pages/requests/CalendarView';

// Team Pages
import TeamList from './pages/teams/TeamList';
import TeamForm from './pages/teams/TeamForm';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Profile Route */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Profile />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Equipment Routes */}
                    <Route
                        path="/equipment"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <EquipmentList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/equipment/new"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <EquipmentForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/equipment/edit/:id"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <EquipmentForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/equipment/:id"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <EquipmentDetail />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Request Routes */}
                    <Route
                        path="/requests"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <RequestList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/requests/new"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <RequestForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/kanban"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <KanbanBoard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/calendar"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <CalendarView />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Team Routes (Manager Only) */}
                    <Route
                        path="/teams"
                        element={
                            <ProtectedRoute roles={['Manager']}>
                                <Layout>
                                    <TeamList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/new"
                        element={
                            <ProtectedRoute roles={['Manager']}>
                                <Layout>
                                    <TeamForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/edit/:id"
                        element={
                            <ProtectedRoute roles={['Manager']}>
                                <Layout>
                                    <TeamForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
