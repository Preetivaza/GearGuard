import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Search, Bell, User, LogOut, Settings } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Header = ({ toggleSidebar, isSidebarCollapsed }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {/* Sidebar Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-gray-900"
                    aria-label="Toggle Sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Notification Center */}
                <NotificationCenter />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-gray-200">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="hidden md:block text-left">
                            <div className="text-sm font-medium text-gray-900">
                                {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{user?.role}</div>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="text-sm font-medium text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{user?.email}</div>
                            </div>

                            <button
                                onClick={() => {
                                    navigate('/profile');
                                    setIsProfileOpen(false);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                            >
                                <Settings className="h-4 w-4 text-gray-500" />
                                Profile Settings
                            </button>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
