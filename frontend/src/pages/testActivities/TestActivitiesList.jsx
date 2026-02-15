import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getTestActivities, deleteTestActivity } from '../../services/testActivityService';
import { FlaskConical, Plus, Trash2, Eye, Filter } from 'lucide-react';
import './TestActivities.css';

const TestActivitiesList = () => {
    const navigate = useNavigate();
    const [testActivities, setTestActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        result: '',
        testType: ''
    });

    useEffect(() => {
        fetchTestActivities();
    }, [filters]);

    const fetchTestActivities = async () => {
        try {
            setLoading(true);
            const response = await getTestActivities(filters);
            if (response.success) {
                setTestActivities(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch test activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this test activity?')) {
            try {
                await deleteTestActivity(id);
                fetchTestActivities();
            } catch (error) {
                console.error('Failed to delete test activity:', error);
                alert('Failed to delete test activity');
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'Pending': 'warning',
            'In Progress': 'info',
            'Passed': 'success',
            'Failed': 'danger',
            'Skipped': 'secondary'
        };
        return statusColors[status] || 'secondary';
    };

    const getResultBadge = (result) => {
        const resultColors = {
            'Pass': 'success',
            'Fail': 'danger',
            'Partial': 'warning',
            'N/A': 'secondary'
        };
        return resultColors[result] || 'secondary';
    };

    return (
        <div className="test-activities-page">
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <FlaskConical size={32} />
                    </div>
                    <div>
                        <h1>Test Activities</h1>
                        <p>Track equipment testing and quality checks</p>
                    </div>
                </div>
                <Button
                    onClick={() => navigate('/test-activities/new')}
                    className="btn-primary"
                >
                    <Plus size={20} />
                    New Test Activity
                </Button>
            </div>

            <Card className="filters-card">
                <div className="filters-section">
                    <div className="filter-icon">
                        <Filter size={18} />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Passed">Passed</option>
                        <option value="Failed">Failed</option>
                        <option value="Skipped">Skipped</option>
                    </select>

                    <select
                        value={filters.result}
                        onChange={(e) => setFilters({ ...filters, result: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Results</option>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                        <option value="Partial">Partial</option>
                        <option value="N/A">N/A</option>
                    </select>

                    <select
                        value={filters.testType}
                        onChange={(e) => setFilters({ ...filters, testType: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Types</option>
                        <option value="Functional">Functional</option>
                        <option value="Performance">Performance</option>
                        <option value="Safety">Safety</option>
                        <option value="Quality">Quality</option>
                        <option value="Operational">Operational</option>
                        <option value="Pre-Delivery">Pre-Delivery</option>
                    </select>
                </div>
            </Card>

            <Card className="test-activities-card">
                {loading ? (
                    <div className="loading-state">Loading test activities...</div>
                ) : testActivities.length === 0 ? (
                    <div className="empty-state">
                        <FlaskConical size={64} />
                        <h3>No Test Activities Found</h3>
                        <p>Start by creating your first test activity</p>
                        <Button onClick={() => navigate('/test-activities/new')}>
                            <Plus size={18} />
                            Create Test Activity
                        </Button>
                    </div>
                ) : (
                    <div className="test-activities-table-wrapper">
                        <table className="test-activities-table">
                            <thead>
                                <tr>
                                    <th>Test Name</th>
                                    <th>Equipment</th>
                                    <th>Type</th>
                                    <th>Tested By</th>
                                    <th>Test Date</th>
                                    <th>Status</th>
                                    <th>Result</th>
                                    <th>Score</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testActivities.map((activity) => (
                                    <tr key={activity._id}>
                                        <td className="test-name-cell">
                                            <div className="test-name">{activity.testName}</div>
                                            {activity.testDescription && (
                                                <div className="test-desc">{activity.testDescription}</div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="equipment-info">
                                                <div>{activity.equipment?.name || 'N/A'}</div>
                                                <small>{activity.equipment?.serialNumber || ''}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`type-badge ${activity.testType?.toLowerCase()}`}>
                                                {activity.testType}
                                            </span>
                                        </td>
                                        <td>{activity.testedBy?.name || 'N/A'}</td>
                                        <td>{new Date(activity.testDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadge(activity.status)}`}>
                                                {activity.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`result-badge ${getResultBadge(activity.result)}`}>
                                                {activity.result}
                                            </span>
                                        </td>
                                        <td>
                                            {activity.score !== undefined && activity.score !== null ? (
                                                <div className="score-cell">
                                                    <span className={`score ${activity.score >= 70 ? 'pass' : 'fail'}`}>
                                                        {activity.score}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-icon btn-view"
                                                    onClick={() => navigate(`/test-activities/${activity._id}`)}
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className="btn-icon btn-delete"
                                                    onClick={() => handleDelete(activity._id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
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

export default TestActivitiesList;
