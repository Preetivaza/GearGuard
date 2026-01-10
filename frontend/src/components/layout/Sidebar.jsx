import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { user } = useAuth();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/equipment', label: 'Equipment', icon: '🔧' },
        { path: '/requests', label: 'Requests', icon: '📝' },
        { path: '/kanban', label: 'Kanban Board', icon: '📋' },
        { path: '/calendar', label: 'Calendar', icon: '📅' },
        { path: '/teams', label: 'Teams', icon: '👥', roles: ['Manager'] },
    ];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
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
                                isActive ? 'sidebar-link active' : 'sidebar-link'
                            }
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
