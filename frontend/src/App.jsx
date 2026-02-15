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

// Spare Parts Pages
import SparePartsList from './pages/spareParts/SparePartsList';
import SparePartsDetail from './pages/spareParts/SparePartsDetail';
import SparePartsForm from './pages/spareParts/SparePartsForm';

// Test Activities Pages
import TestActivitiesList from './pages/testActivities/TestActivitiesList';
import TestActivityDetail from './pages/testActivities/TestActivityDetail';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster 
                    position="top-right"
                    reverseOrder={false}
                    gutter={8}
                    toastOptions={{
                        duration: 5000,
                        style: {
                            background: '#fff',
                            color: '#333',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            borderRadius: '10px',
                            padding: '16px',
                        },
                        success: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
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

                    {/* Spare Parts Routes (Technician & Manager) */}
                    <Route
                        path="/spare-parts"
                        element={
                            <ProtectedRoute roles={['Technician', 'Manager']}>
                                <Layout>
                                    <SparePartsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/spare-parts/new"
                        element={
                            <ProtectedRoute roles={['Technician', 'Manager']}>
                                <Layout>
                                    <SparePartsForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/spare-parts/:id"
                        element={
                            <ProtectedRoute roles={['Technician', 'Manager']}>
                                <Layout>
                                    <SparePartsDetail />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/spare-parts/:id/edit"
                        element={
                            <ProtectedRoute roles={['Technician', 'Manager']}>
                                <Layout>
                                    <SparePartsForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Test Activities Routes */}
                    <Route
                        path="/test-activities"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <TestActivitiesList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/test-activities/:id"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <TestActivityDetail />
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
