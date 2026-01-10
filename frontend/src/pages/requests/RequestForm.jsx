import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { equipmentService } from '../../services/equipmentService';
import { teamService } from '../../services/teamService';
import { authService } from '../../services/authService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const RequestForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        equipment: '',
        requestType: 'Corrective',
        priority: 'Medium',
        maintenanceTeam: '',
        assignedTo: '',
        scheduledDate: '',
        estimatedCost: '',
    });

    const [equipment, setEquipment] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEquipment();
        fetchTeams();
        fetchUsers();
    }, []);

    const fetchEquipment = async () => {
        try {
            const data = await equipmentService.getAll({ status: 'Active' });
            setEquipment(data);
        } catch (error) {
            console.error('Failed to fetch equipment');
        }
    };

    const fetchTeams = async () => {
        try {
            const data = await teamService.getAll({ isActive: 'true' });
            setTeams(data);
        } catch (error) {
            console.error('Failed to fetch teams');
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await authService.getUsers();
            const technicians = data.filter((u) => u.role === 'Technician');
            setUsers(technicians);
        } catch (error) {
            console.error('Failed to fetch users');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEquipmentChange = async (e) => {
        const equipmentId = e.target.value;
        setFormData({
            ...formData,
            equipment: equipmentId,
        });

        // Auto-fill maintenance team
        if (equipmentId) {
            try {
                const selectedEquipment = equipment.find((eq) => eq._id === equipmentId);
                if (selectedEquipment?.maintenanceTeam) {
                    setFormData((prev) => ({
                        ...prev,
                        equipment: equipmentId,
                        maintenanceTeam: selectedEquipment.maintenanceTeam._id,
                    }));
                }
            } catch (error) {
                console.error('Failed to auto-fill team');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await requestService.create(formData);
            toast.success('Request created successfully');
            navigate('/requests');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>New Maintenance Request</h1>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="title">Request Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="equipment">Equipment *</label>
                            <select
                                id="equipment"
                                name="equipment"
                                className="form-control"
                                value={formData.equipment}
                                onChange={handleEquipmentChange}
                                required
                            >
                                <option value="">Select Equipment</option>
                                {equipment.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name} - {item.serialNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="requestType">Request Type *</label>
                            <select
                                id="requestType"
                                name="requestType"
                                className="form-control"
                                value={formData.requestType}
                                onChange={handleChange}
                                required
                            >
                                <option value="Corrective">Corrective (Breakdown)</option>
                                <option value="Preventive">Preventive (Scheduled)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority *</label>
                            <select
                                id="priority"
                                name="priority"
                                className="form-control"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="maintenanceTeam">Maintenance Team *</label>
                            <select
                                id="maintenanceTeam"
                                name="maintenanceTeam"
                                className="form-control"
                                value={formData.maintenanceTeam}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team._id} value={team._id}>
                                        {team.name} ({team.type})
                                    </option>
                                ))}
                            </select>
                            <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                                Auto-filled from equipment
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="assignedTo">Assign To Technician</label>
                            <select
                                id="assignedTo"
                                name="assignedTo"
                                className="form-control"
                                value={formData.assignedTo}
                                onChange={handleChange}
                            >
                                <option value="">Not Assigned</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="scheduledDate">Scheduled Date</label>
                            <input
                                type="date"
                                id="scheduledDate"
                                name="scheduledDate"
                                className="form-control"
                                value={formData.scheduledDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="estimatedCost">Estimated Cost</label>
                            <input
                                type="number"
                                id="estimatedCost"
                                name="estimatedCost"
                                className="form-control"
                                value={formData.estimatedCost}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Request'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/requests')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default RequestForm;
