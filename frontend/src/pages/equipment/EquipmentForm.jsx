import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { teamService } from '../../services/teamService';
import { authService } from '../../services/authService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const EquipmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        category: 'Machinery',
        department: '',
        assignedTo: '',
        maintenanceTeam: '',
        location: '',
        warrantyExpiry: '',
        purchaseDate: '',
        cost: '',
        description: '',
    });
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTeams();
        fetchUsers();
        if (isEdit) {
            fetchEquipment();
        }
    }, [id]);

    const fetchEquipment = async () => {
        try {
            const data = await equipmentService.getById(id);
            setFormData({
                name: data.name,
                serialNumber: data.serialNumber,
                category: data.category,
                department: data.department,
                assignedTo: data.assignedTo?._id || '',
                maintenanceTeam: data.maintenanceTeam?._id || '',
                location: data.location,
                warrantyExpiry: data.warrantyExpiry ? data.warrantyExpiry.split('T')[0] : '',
                purchaseDate: data.purchaseDate ? data.purchaseDate.split('T')[0] : '',
                cost: data.cost || '',
                description: data.description || '',
            });
        } catch (error) {
            toast.error('Failed to fetch equipment');
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
            setUsers(data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await equipmentService.update(id, formData);
                toast.success('Equipment updated successfully');
            } else {
                await equipmentService.create(formData);
                toast.success('Equipment created successfully');
            }
            navigate('/equipment');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>
                {isEdit ? 'Edit Equipment' : 'Add New Equipment'}
            </h1>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="name">Equipment Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="serialNumber">Serial Number *</label>
                            <input
                                type="text"
                                id="serialNumber"
                                name="serialNumber"
                                className="form-control"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="Machinery">Machinery</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Vehicles">Vehicles</option>
                                <option value="Tools">Tools</option>
                                <option value="IT Equipment">IT Equipment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department *</label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                className="form-control"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location *</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                className="form-control"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="assignedTo">Assigned To</label>
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
                                        {user.name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="purchaseDate">Purchase Date *</label>
                            <input
                                type="date"
                                id="purchaseDate"
                                name="purchaseDate"
                                className="form-control"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="warrantyExpiry">Warranty Expiry</label>
                            <input
                                type="date"
                                id="warrantyExpiry"
                                name="warrantyExpiry"
                                className="form-control"
                                value={formData.warrantyExpiry}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cost">Cost</label>
                            <input
                                type="number"
                                id="cost"
                                name="cost"
                                className="form-control"
                                value={formData.cost}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Equipment' : 'Create Equipment'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/equipment')}
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

export default EquipmentForm;
