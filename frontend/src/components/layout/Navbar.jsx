import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from './NotificationCenter';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

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

    const navLinks = [
        { to: '/', label: 'Dashboard', roles: null },
        { to: '/equipment', label: 'Equipment', roles: null },
        { to: '/requests', label: 'Requests', roles: null },
        { to: '/test-activities', label: 'Test Activities', roles: null },
        { to: '/spare-parts', label: 'Spare Parts', roles: ['Technician', 'Manager'] },
        { to: '/teams', label: 'Teams', roles: ['Manager'] },
    ];

    const hasAccess = (roles) => {
        if (!roles) return true;
        return roles.includes(user?.role);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    ⚙️ GearGuard
                </Link>

                <div className="navbar-menu">
                    {navLinks.filter(link => hasAccess(link.roles)).map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => 
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="navbar-actions">
                    <NotificationCenter />

                    <div className="profile-dropdown" ref={profileRef}>
                        <button 
                            className="profile-button"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="profile-avatar">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </div>
                            <span className="profile-name">
                                {user?.firstName} {user?.lastName}
                            </span>
                        </button>

                        {isProfileOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <div className="dropdown-name">
                                        {user?.firstName} {user?.lastName}
                                    </div>
                                    <div className="dropdown-email">{user?.email}</div>
                                    <div className="dropdown-role">{user?.role}</div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item" onClick={handleLogout}>
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
