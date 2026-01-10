import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teamService } from '../../services/teamService';
import { authService } from '../../services/authService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

// Mapping of team types to department names for filtering
const TEAM_TYPE_TO_DEPARTMENT = {
    'Mechanics': 'Mechanical',
    'Electricians': 'Electrical',
    'IT Support': 'IT',
    'HVAC': 'HVAC',
    'Plumbing': 'Plumbing',
    'General': null, // Shows all
    'Other': null, // Shows all
};

const TeamForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        type: 'Mechanics',
        description: '',
        teamLead: '',
        members: [],
        specialization: '',
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
        if (isEdit) {
            fetchTeam();
        }
    }, [id]);

    const fetchTeam = async () => {
        try {
            const data = await teamService.getById(id);
            setFormData({
                name: data.name,
                type: data.type,
                description: data.description || '',
                teamLead: data.teamLead?._id || '',
                members: data.members?.map((m) => m._id) || [],
                specialization: data.specialization?.join(', ') || '',
            });
        } catch (error) {
            toast.error('Failed to fetch team');
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await authService.getUsers();
            const technicians = data.filter((u) => u.role === 'Technician' || u.role === 'Manager');
            setUsers(technicians);
        } catch (error) {
            console.error('Failed to fetch users');
        }
    };

    // Filter users based on selected team type
    const getFilteredUsers = () => {
        const targetDepartment = TEAM_TYPE_TO_DEPARTMENT[formData.type];
        
        // If no specific department (General/Other), show all users
        if (!targetDepartment) {
            return users;
        }
        
        // Filter users by department
        return users.filter(user => 
            user.department && user.department.toLowerCase().includes(targetDepartment.toLowerCase())
        );
    };

    const filteredUsers = getFilteredUsers();

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // If team type changes, reset member selection
        if (name === 'type') {
            setFormData({
                ...formData,
                [name]: value,
                members: [], // Reset members when team type changes
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleMemberToggle = (userId) => {
        setFormData(prev => {
            const isSelected = prev.members.includes(userId);
            return {
                ...prev,
                members: isSelected
                    ? prev.members.filter(id => id !== userId)
                    : [...prev.members, userId]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const submitData = {
            ...formData,
            specialization: formData.specialization
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s),
        };

        try {
            if (isEdit) {
                await teamService.update(id, submitData);
                toast.success('Team updated successfully');
            } else {
                await teamService.create(submitData);
                toast.success('Team created successfully');
            }
            navigate('/teams');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>
                {isEdit ? 'Edit Team' : 'Add New Team'}
            </h1>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="name">Team Name *</label>
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
                            <label htmlFor="type">Team Type *</label>
                            <select
                                id="type"
                                name="type"
                                className="form-control"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="Mechanics">Mechanics</option>
                                <option value="Electricians">Electricians</option>
                                <option value="IT Support">IT Support</option>
                                <option value="HVAC">HVAC</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="General">General</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="teamLead">Team Lead</label>
                            <select
                                id="teamLead"
                                name="teamLead"
                                className="form-control"
                                value={formData.teamLead}
                                onChange={handleChange}
                            >
                                <option value="">No Lead</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="specialization">Specializations (comma-separated)</label>
                            <input
                                type="text"
                                id="specialization"
                                name="specialization"
                                className="form-control"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="e.g., Welding, AC Repair, Network Setup"
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
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <label style={{ marginBottom: 0 }}>Team Members</label>
                            {formData.members.length > 0 && (
                                <span className="selection-count">
                                    {formData.members.length} member{formData.members.length !== 1 ? 's' : ''} selected
                                </span>
                            )}
                        </div>
                        
                        <div className="member-selection-container">
                            {filteredUsers.length === 0 ? (
                                <div style={{ 
                                    padding: '20px', 
                                    textAlign: 'center', 
                                    color: 'var(--text-light)',
                                    background: 'var(--light)',
                                    borderRadius: '6px'
                                }}>
                                    No technicians available for this team type
                                </div>
                            ) : (
                                filteredUsers.map((user) => (
                                    <div 
                                        key={user._id} 
                                        className="member-checkbox-item"
                                        onClick={() => handleMemberToggle(user._id)}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`member-${user._id}`}
                                            checked={formData.members.includes(user._id)}
                                            onChange={() => handleMemberToggle(user._id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <label htmlFor={`member-${user._id}`} className="checkbox-label">
                                            <div className="member-info">
                                                <div style={{ fontWeight: '600', color: 'var(--text)' }}>
                                                    {user.name}
                                                </div>
                                                <div className="member-details">
                                                    <span className="badge badge-low">{user.role}</span>
                                                    <span>{user.department || 'No Dept'}</span>
                                                    {user.phone && <span>📞 {user.phone}</span>}
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Team' : 'Create Team'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/teams')}
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

export default TeamForm;
