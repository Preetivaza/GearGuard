import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getTestActivity, deleteTestActivity } from '../../services/testActivityService';
import { 
    ArrowLeft, 
    FlaskConical, 
    Calendar, 
    User, 
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Trash2,
    Edit
} from 'lucide-react';
import './TestActivities.css';

const TestActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [testActivity, setTestActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestActivity();
    }, [id]);

    const fetchTestActivity = async () => {
        try {
            setLoading(true);
            const response = await getTestActivity(id);
            if (response.success) {
                setTestActivity(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch test activity:', error);
            alert('Failed to load test activity');
            navigate('/test-activities');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this test activity?')) {
            try {
                await deleteTestActivity(id);
                navigate('/test-activities');
            } catch (error) {
                console.error('Failed to delete test activity:', error);
                alert('Failed to delete test activity');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': '#f59e0b',
            'In Progress': '#3b82f6',
            'Passed': '#10b981',
            'Failed': '#ef4444',
            'Skipped': '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const getResultColor = (result) => {
        const colors = {
            'Pass': '#10b981',
            'Fail': '#ef4444',
            'Partial': '#f59e0b',
            'N/A': '#6b7280'
        };
        return colors[result] || '#6b7280';
    };

    if (loading) {
        return (
            <div className="test-activity-detail">
                <div className="loading-state">Loading test activity details...</div>
            </div>
        );
    }

    if (!testActivity) {
        return (
            <div className="test-activity-detail">
                <div className="empty-state">
                    <h3>Test Activity Not Found</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="test-activity-detail">
            {/* Header */}
            <div className="detail-header">
                <Button 
                    onClick={() => navigate('/test-activities')}
                    className="btn-back"
                >
                    <ArrowLeft size={20} />
                    Back to List
                </Button>
                <div className="detail-actions">
                    <Button className="btn-secondary">
                        <Edit size={18} />
                        Edit
                    </Button>
                    <Button 
                        onClick={handleDelete}
                        className="btn-danger"
                    >
                        <Trash2 size={18} />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Title Section */}
            <Card className="detail-title-card">
                <div className="detail-title-content">
                    <div className="title-icon">
                        <FlaskConical size={40} />
                    </div>
                    <div className="title-info">
                        <h1>{testActivity.testName}</h1>
                        <p className="title-description">{testActivity.testDescription || 'No description provided'}</p>
                        <div className="title-meta">
                            <span className={`status-badge ${testActivity.status?.toLowerCase().replace(' ', '-')}`}
                                  style={{ background: `linear-gradient(135deg, ${getStatusColor(testActivity.status)}20 0%, ${getStatusColor(testActivity.status)}40 100%)`, color: getStatusColor(testActivity.status) }}>
                                {testActivity.status}
                            </span>
                            <span className={`result-badge ${testActivity.result?.toLowerCase()}`}
                                  style={{ background: `linear-gradient(135deg, ${getResultColor(testActivity.result)}20 0%, ${getResultColor(testActivity.result)}40 100%)`, color: getResultColor(testActivity.result) }}>
                                {testActivity.result}
                            </span>
                            <span className={`type-badge ${testActivity.testType?.toLowerCase()}`}>
                                {testActivity.testType}
                            </span>
                            {testActivity.priority && (
                                <span className={`priority-badge priority-${testActivity.priority?.toLowerCase()}`}>
                                    Priority: {testActivity.priority}
                                </span>
                            )}
                        </div>
                    </div>
                    {testActivity.score !== undefined && testActivity.score !== null && (
                        <div className="score-circle">
                            <div className={`score-value ${testActivity.score >= 70 ? 'pass' : 'fail'}`}>
                                {testActivity.score}%
                            </div>
                            <div className="score-label">Score</div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Info Grid */}
            <div className="detail-grid">
                <Card className="info-card">
                    <div className="info-card-header">
                        <Calendar size={20} />
                        <h3>Test Information</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Equipment</span>
                            <span className="info-value">
                                {testActivity.equipment?.name || 'N/A'}
                                {testActivity.equipment?.serialNumber && (
                                    <small> ({testActivity.equipment.serialNumber})</small>
                                )}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Test Date</span>
                            <span className="info-value">
                                {new Date(testActivity.testDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tested By</span>
                            <span className="info-value">
                                {testActivity.testedBy?.name || 'N/A'}
                                {testActivity.testedBy?.email && (
                                    <small> ({testActivity.testedBy.email})</small>
                                )}
                            </span>
                        </div>
                        {testActivity.nextTestDue && (
                            <div className="info-item">
                                <span className="info-label">Next Test Due</span>
                                <span className="info-value">
                                    {new Date(testActivity.nextTestDue).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="info-card">
                    <div className="info-card-header">
                        <User size={20} />
                        <h3>Audit Information</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Created By</span>
                            <span className="info-value">{testActivity.createdBy?.name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Created At</span>
                            <span className="info-value">
                                {new Date(testActivity.createdAt).toLocaleString()}
                            </span>
                        </div>
                        {testActivity.updatedBy && (
                            <>
                                <div className="info-item">
                                    <span className="info-label">Updated By</span>
                                    <span className="info-value">{testActivity.updatedBy.name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Updated At</span>
                                    <span className="info-value">
                                        {new Date(testActivity.updatedAt).toLocaleString()}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            {/* Test Parameters */}
            {testActivity.parameters && testActivity.parameters.length > 0 && (
                <Card className="parameters-card">
                    <div className="section-header">
                        <FileText size={20} />
                        <h3>Test Parameters</h3>
                    </div>
                    <div className="parameters-table-wrapper">
                        <table className="parameters-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Expected Value</th>
                                    <th>Actual Value</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testActivity.parameters.map((param, index) => (
                                    <tr key={index}>
                                        <td className="param-name">{param.name}</td>
                                        <td className="param-expected">{param.expectedValue}</td>
                                        <td className="param-actual">{param.actualValue}</td>
                                        <td>
                                            <div className="param-result">
                                                {param.result === 'Pass' ? (
                                                    <CheckCircle2 size={18} className="icon-pass" />
                                                ) : (
                                                    <XCircle size={18} className="icon-fail" />
                                                )}
                                                <span className={param.result === 'Pass' ? 'text-pass' : 'text-fail'}>
                                                    {param.result}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Observations and Recommendations */}
            <div className="observations-grid">
                {testActivity.observations && (
                    <Card className="observation-card">
                        <div className="section-header">
                            <AlertCircle size={20} />
                            <h3>Observations</h3>
                        </div>
                        <p className="observation-text">{testActivity.observations}</p>
                    </Card>
                )}

                {testActivity.recommendations && (
                    <Card className="recommendation-card">
                        <div className="section-header">
                            <CheckCircle2 size={20} />
                            <h3>Recommendations</h3>
                        </div>
                        <p className="recommendation-text">{testActivity.recommendations}</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TestActivityDetail;
