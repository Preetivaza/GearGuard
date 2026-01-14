import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        requestType: '',
        priority: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const fetchRequests = async () => {
        try {
            const data = await requestService.getAll(filters);
            setRequests(data);
        } catch (error) {
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Maintenance Requests</h1>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button 
                            className="btn btn-primary"
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                padding: '9px 18px',
                                fontSize: '13px'
                            }}
                        >
                            📋 List View
                        </button>
                        <button 
                            onClick={() => navigate('/kanban')}
                            className="btn btn-secondary"
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                padding: '9px 18px',
                                fontSize: '13px'
                            }}
                        >
                            📊 Kanban Board
                        </button>
                        <button 
                            onClick={() => navigate('/calendar')}
                            className="btn btn-secondary"
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                padding: '9px 18px',
                                fontSize: '13px'
                            }}
                        >
                            📅 Calendar View
                        </button>
                    </div>
                </div>
                <Link to="/requests/new" className="btn btn-success">
                    + New Request
                </Link>
            </div>

            <Card>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <select
                        name="status"
                        className="form-control"
                        value={filters.status}
                        onChange={handleFilterChange}
                        style={{ width: 'auto' }}
                    >
                        <option value="">All Status</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Repaired">Repaired</option>
                        <option value="Scrap">Scrap</option>
                    </select>

                    <select
                        name="requestType"
                        className="form-control"
                        value={filters.requestType}
                        onChange={handleFilterChange}
                        style={{ width: 'auto' }}
                    >
                        <option value="">All Types</option>
                        <option value="Corrective">Corrective</option>
                        <option value="Preventive">Preventive</option>
                    </select>

                    <select
                        name="priority"
                        className="form-control"
                        value={filters.priority}
                        onChange={handleFilterChange}
                        style={{ width: 'auto' }}
                    >
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>

                <div style={{ overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Title</th>
                                <th style={{ padding: '12px' }}>Equipment</th>
                                <th style={{ padding: '12px' }}>Type</th>
                                <th style={{ padding: '12px' }}>Priority</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
                                        No requests found
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px', fontWeight: '600' }}>{request.title}</td>
                                        <td style={{ padding: '12px' }}>{request.equipment?.name}</td>
                                        <td style={{ padding: '12px' }}>{request.requestType}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span className={`badge badge-${request.priority.toLowerCase()}`}>
                                                {request.priority}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span className={`badge badge-${request.status.toLowerCase().replace(' ', '-')}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default RequestList;
