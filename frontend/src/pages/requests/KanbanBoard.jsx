import { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import Card from '../../components/common/Card';
import './KanbanBoard.css';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
    const [kanbanData, setKanbanData] = useState({
        New: [],
        'In Progress': [],
        Repaired: [],
        Scrap: [],
    });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { id: 'New', title: 'New', color: '#3b82f6' },
        { id: 'In Progress', title: 'In Progress', color: '#f59e0b' },
        { id: 'Repaired', title: 'Repaired', color: '#10b981' },
        { id: 'Scrap', title: 'Scrap', color: '#ef4444' }
    ];

    useEffect(() => {
        fetchKanbanData();
    }, []);

    const fetchKanbanData = async () => {
        try {
            const data = await requestService.getKanbanData();
            setKanbanData(data);
        } catch (error) {
            toast.error('Failed to fetch kanban data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await requestService.update(requestId, { status: newStatus });
            toast.success('Status updated successfully');
            fetchKanbanData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>Kanban Board</h1>

            <div className="kanban-board">
                {Object.keys(kanbanData).map((status) => (
                    <div key={status} className="kanban-column">
                        <div className="kanban-column-header">
                            <h3>{status}</h3>
                            <span className="kanban-count">{kanbanData[status].length}</span>
                        </div>
                        <div className="kanban-column-content">
                            {kanbanData[status].map((request) => (
                                <div key={request._id} className="kanban-card">
                                    <div className="kanban-card-title">{request.title}</div>
                                    <div className="kanban-card-equipment">
                                        📦 {request.equipment?.name}
                                    </div>
                                    <div className="kanban-card-footer">
                                        <span className={`badge badge-${request.priority.toLowerCase()}`}>
                                            {request.priority}
                                        </span>
                                        <span className="kanban-card-type">{request.requestType}</span>
                                    </div>
                                    <div className="kanban-card-actions">
                                        <select
                                            value={status}
                                            onChange={(e) => handleStatusChange(request._id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="New">New</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Repaired">Repaired</option>
                                            <option value="Scrap">Scrap</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                            {kanbanData[status].length === 0 && (
                                <div className="kanban-empty">No requests</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
