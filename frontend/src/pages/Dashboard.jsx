import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { getDashboardStats, getRecentActivities } from '../services/statsService';
import { 
    Wrench, 
    AlertCircle, 
    CheckCircle2, 
    Users, 
    TrendingUp, 
    TrendingDown,
    Clock,
    Package,
    Activity,
    Calendar
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEquipment: 0,
        activeRequests: 0,
        completedRequests: 0,
        totalTeams: 0,
        pendingRequests: 0,
        inProgressRequests: 0,
        overdueRequests: 0,
        avgCompletionTime: 0
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

    const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
        <Card className="stat-card">
            <div className="stat-card-content">
                <div className="stat-info">
                    <div className="stat-label">{title}</div>
                    <div className="stat-value">{loading ? '...' : value}</div>
                    {trend && (
                        <div className={`stat-trend ${trend}`}>
                            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                <div className={`stat-icon ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
        </Card>
    );

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome back, {user?.name}! 👋</h1>
                    <p className="dashboard-subtitle">Here's what's happening with your maintenance operations today</p>
                </div>
                <div className="dashboard-date">
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Equipment"
                    value={stats.totalEquipment}
                    icon={Package}
                    color="blue"
                />
                <StatCard
                    title="Active Requests"
                    value={stats.activeRequests}
                    icon={Activity}
                    color="purple"
                />
                <StatCard
                    title="Completed Requests"
                    value={stats.completedRequests}
                    icon={CheckCircle2}
                    color="green"
                />
                <StatCard
                    title="Maintenance Teams"
                    value={stats.totalTeams}
                    icon={Users}
                    color="orange"
                />
            </div>

            {/* Secondary Stats */}
            <div className="secondary-stats-grid">
                <Card className="mini-stat pending">
                    <Clock size={20} />
                    <div className="mini-stat-content">
                        <div className="mini-stat-value">{loading ? '...' : stats.pendingRequests || 0}</div>
                        <div className="mini-stat-label">Pending</div>
                    </div>
                </Card>
                <Card className="mini-stat in-progress">
                    <Wrench size={20} />
                    <div className="mini-stat-content">
                        <div className="mini-stat-value">{loading ? '...' : stats.inProgressRequests || 0}</div>
                        <div className="mini-stat-label">In Progress</div>
                    </div>
                </Card>
                <Card className="mini-stat overdue">
                    <AlertCircle size={20} />
                    <div className="mini-stat-content">
                        <div className="mini-stat-value">{loading ? '...' : stats.overdueRequests || 0}</div>
                        <div className="mini-stat-label">Overdue</div>
                    </div>
                </Card>
                <Card className="mini-stat avg-time">
                    <TrendingUp size={20} />
                    <div className="mini-stat-content">
                        <div className="mini-stat-value">{loading ? '...' : stats.avgCompletionTime || '0'}h</div>
                        <div className="mini-stat-label">Avg Completion</div>
                    </div>
                </Card>
            </div>

            {/* Charts & Tables Row */}
            <div className="dashboard-row">
                {/* Priority Breakdown */}
                <Card title="Request Priority Breakdown" className="chart-card">
                    <div className="priority-breakdown">
                        <div className="priority-item critical">
                            <div className="priority-header">
                                <div className="priority-label">
                                    <div className="priority-badge critical">Critical</div>
                                    <span className="priority-count">{loading ? '...' : Math.floor(stats.activeRequests * 0.15)}</span>
                                </div>
                            </div>
                            <div className="priority-bar">
                                <div className="priority-fill critical" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                        <div className="priority-item high">
                            <div className="priority-header">
                                <div className="priority-label">
                                    <div className="priority-badge high">High</div>
                                    <span className="priority-count">{loading ? '...' : Math.floor(stats.activeRequests * 0.30)}</span>
                                </div>
                            </div>
                            <div className="priority-bar">
                                <div className="priority-fill high" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                        <div className="priority-item medium">
                            <div className="priority-header">
                                <div className="priority-label">
                                    <div className="priority-badge medium">Medium</div>
                                    <span className="priority-count">{loading ? '...' : Math.floor(stats.activeRequests * 0.35)}</span>
                                </div>
                            </div>
                            <div className="priority-bar">
                                <div className="priority-fill medium" style={{ width: '35%' }}></div>
                            </div>
                        </div>
                        <div className="priority-item low">
                            <div className="priority-header">
                                <div className="priority-label">
                                    <div className="priority-badge low">Low</div>
                                    <span className="priority-count">{loading ? '...' : Math.floor(stats.activeRequests * 0.20)}</span>
                                </div>
                            </div>
                            <div className="priority-bar">
                                <div className="priority-fill low" style={{ width: '20%' }}></div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Equipment Status */}
                <Card title="Equipment Status Overview" className="chart-card">
                    <div className="equipment-status">
                        <div className="status-item">
                            <div className="status-indicator operational"></div>
                            <div className="status-info">
                                <div className="status-label">Operational</div>
                                <div className="status-value">{loading ? '...' : Math.floor(stats.totalEquipment * 0.75)}</div>
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator maintenance"></div>
                            <div className="status-info">
                                <div className="status-label">Under Maintenance</div>
                                <div className="status-value">{loading ? '...' : Math.floor(stats.totalEquipment * 0.18)}</div>
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator faulty"></div>
                            <div className="status-info">
                                <div className="status-label">Faulty</div>
                                <div className="status-value">{loading ? '...' : Math.floor(stats.totalEquipment * 0.05)}</div>
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator offline"></div>
                            <div className="status-info">
                                <div className="status-label">Offline</div>
                                <div className="status-value">{loading ? '...' : Math.floor(stats.totalEquipment * 0.02)}</div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity Table */}
            <Card title="Recent Activity" className="activity-card">
                {activitiesLoading ? (
                    <div className="loading-state">Loading activities...</div>
                ) : activities.length === 0 ? (
                    <div className="empty-state">
                        <Activity size={48} />
                        <p>No recent activity</p>
                    </div>
                ) : (
                    <div className="activity-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Activity</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.slice(0, 8).map((activity, index) => (
                                    <tr key={index} className="activity-row">
                                        <td>
                                            <div className="activity-main">
                                                <span className="activity-icon">{activity.icon}</span>
                                                <span className="activity-desc">{activity.description}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="activity-type">{activity.type || 'Maintenance'}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${activity.status?.toLowerCase() || 'pending'}`}>
                                                {activity.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="activity-time">{formatTimestamp(activity.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
