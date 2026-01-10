import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { getDashboardStats, getRecentActivities } from '../services/statsService';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEquipment: 0,
        activeRequests: 0,
        completedRequests: 0,
        totalTeams: 0
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activitiesLoading, setActivitiesLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getDashboardStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchActivities = async () => {
            try {
                setActivitiesLoading(true);
                const response = await getRecentActivities();
                if (response.success) {
                    setActivities(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch recent activities:', error);
            } finally {
                setActivitiesLoading(false);
            }
        };

        fetchStats();
        fetchActivities();
    }, []);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '700', color: 'var(--text)' }}>
                Welcome, {user?.name}! 👋
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <Card style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    borderColor: '#bfdbfe'
                }}>
                    <div style={{ fontSize: '14px', color: '#1e40af', marginBottom: '8px', fontWeight: '500' }}>
                        Total Equipment
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#1d4ed8' }}>
                        {loading ? '...' : stats.totalEquipment}
                    </div>
                </Card>

                <Card style={{
                    background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                    borderColor: '#a5b4fc'
                }}>
                    <div style={{ fontSize: '14px', color: '#4338ca', marginBottom: '8px', fontWeight: '500' }}>
                        Active Requests
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#4338ca' }}>
                        {loading ? '...' : stats.activeRequests}
                    </div>
                </Card>

                <Card style={{
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    borderColor: '#6ee7b7'
                }}>
                    <div style={{ fontSize: '14px', color: '#065f46', marginBottom: '8px', fontWeight: '500' }}>
                        Completed
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#059669' }}>
                        {loading ? '...' : stats.completedRequests}
                    </div>
                </Card>

                <Card style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderColor: '#fcd34d'
                }}>
                    <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px', fontWeight: '500' }}>
                        Maintenance Teams
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#d97706' }}>
                        {loading ? '...' : stats.totalTeams}
                    </div>
                </Card>
            </div>

            <Card title="Recent Activity">
                {activitiesLoading ? (
                    <div style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px 0' }}>
                        Loading activities...
                    </div>
                ) : activities.length === 0 ? (
                    <div style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px 0' }}>
                        No recent activity
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '16px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                    border: '1px solid #bae6fd',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span style={{ fontSize: '24px', lineHeight: '1' }}>{activity.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '4px', fontWeight: '500' }}>
                                        {activity.description}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#075985' }}>
                                        {formatTimestamp(activity.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
