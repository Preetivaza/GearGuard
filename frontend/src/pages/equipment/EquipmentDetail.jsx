import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const EquipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEquipment();
        fetchRequests();
    }, [id]);

    const fetchEquipment = async () => {
        try {
            const data = await equipmentService.getById(id);
            setEquipment(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch equipment details');
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const data = await equipmentService.getRequests(id);
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!equipment) return <div>Equipment not found</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px' }}>{equipment.name}</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate(`/equipment/edit/${id}`)}
                        className="btn btn-primary"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => navigate('/equipment')}
                        className="btn btn-secondary"
                    >
                        Back
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <Card title="Equipment Information">
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Serial Number
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                {equipment.serialNumber}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Category
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                {equipment.category}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Department
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                {equipment.department}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Location
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                {equipment.location}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Status
                            </div>
                            <span
                                className={`badge ${equipment.status === 'Active' ? 'badge-repaired' :
                                        equipment.status === 'Under Maintenance' ? 'badge-in-progress' :
                                            'badge-scrap'
                                    }`}
                            >
                                {equipment.status}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card title="Assignment & Maintenance">
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Assigned To
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                {equipment.assignedTo?.name || 'Not Assigned'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Maintenance Team
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                {equipment.maintenanceTeam?.name} ({equipment.maintenanceTeam?.type})
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Purchase Date
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                {new Date(equipment.purchaseDate).toLocaleDateString()}
                            </div>
                        </div>
                        {equipment.warrantyExpiry && (
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                    Warranty Expiry
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                    {new Date(equipment.warrantyExpiry).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <Card title={`Related Maintenance Requests (${requests.length})`}>
                {requests.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px 0' }}>
                        No maintenance requests found
                    </div>
                ) : (
                    <div style={{ overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Title</th>
                                    <th style={{ padding: '12px' }}>Type</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                    <th style={{ padding: '12px' }}>Priority</th>
                                    <th style={{ padding: '12px' }}>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px' }}>{request.title}</td>
                                        <td style={{ padding: '12px' }}>{request.requestType}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span className={`badge badge-${request.status.toLowerCase().replace(' ', '-')}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span className={`badge badge-${request.priority.toLowerCase()}`}>
                                                {request.priority}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {new Date(request.createdAt).toLocaleDateString()}
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

export default EquipmentDetail;
