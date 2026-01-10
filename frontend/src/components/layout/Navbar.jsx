import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/equipment', label: 'Equipment', icon: '🔧' },
        { path: '/requests', label: 'Requests', icon: '📝' },
        { path: '/kanban', label: 'Kanban Board', icon: '📋' },
        { path: '/calendar', label: 'Calendar', icon: '📅' },
        { path: '/teams', label: 'Teams', icon: '👥', roles: ['Manager'] },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    ⚙️ GearGuard
                </Link>

                <div className="navbar-nav">
                    {menuItems.map((item) => {
                        // Hide menu items based on role
                        if (item.roles && !item.roles.includes(user?.role)) {
                            return null;
                        }

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                                end={item.path === '/'}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>

                <div className="navbar-menu" ref={dropdownRef}>
                    <div className="profile-dropdown">
                        <button
                            className="profile-button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="profile-icon">👤</span>
                            <span className="profile-name">{user?.name}</span>
                            <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <div className="dropdown-user-name">{user?.name}</div>
                                    <div className="dropdown-user-email">{user?.email}</div>
                                    <div className="dropdown-user-plan">
                                        Plan: <span className="plan-badge">{user?.role || 'Free'}</span>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link
                                    to="/profile"
                                    className="dropdown-item"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <span className="dropdown-item-icon">👤</span>
                                    Profile
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button
                                    onClick={handleLogout}
                                    className="dropdown-item dropdown-item-danger"
                                >
                                    <span className="dropdown-item-icon">🚪</span>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
