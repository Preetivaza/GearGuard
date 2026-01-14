import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import toast from 'react-hot-toast';
import './NotificationCenter.css';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications({ limit: 10 });
            setNotifications(data.data);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(
                notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setLoading(true);
            await markAllAsRead();
            setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'blue',
            medium: 'yellow',
            high: 'orange',
            critical: 'red',
        };
        return colors[priority] || 'gray';
    };

    const getTypeIcon = (type) => {
        const icons = {
            request_created: '📝',
            request_assigned: '👤',
            request_updated: '🔄',
            request_completed: '✅',
            equipment_added: '🔧',
            sla_warning: '⚠️',
            sla_breached: '🚨',
            low_stock: '📦',
            budget_alert: '💰',
        };
        return icons[type] || '🔔';
    };

    return (
        <div className="notification-center">
            <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                                className="mark-all-read-btn"
                            >
                                <Check size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                <Bell size={40} style={{ opacity: 0.3 }} />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`notification-item ${
                                        !notification.isRead ? 'unread' : ''
                                    }`}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                                >
                                    <div className="notification-icon">
                                        <span>{getTypeIcon(notification.type)}</span>
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            {notification.title}
                                            <span
                                                className={`priority-badge priority-${getPriorityColor(
                                                    notification.priority
                                                )}`}
                                            >
                                                {notification.priority}
                                            </span>
                                        </div>
                                        <p className="notification-message">{notification.message}</p>
                                        <span className="notification-time">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="unread-indicator"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
