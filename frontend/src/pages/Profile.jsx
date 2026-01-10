import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/userService';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        phone: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getProfile();
            if (response.success) {
                setProfile(response.data);
                setFormData({
                    name: response.data.name || '',
                    department: response.data.department || '',
                    phone: response.data.phone || ''
                });
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            const response = await updateProfile(formData);
            if (response.success) {
                setProfile(response.data);
                updateUser(response.data);
                setIsEditing(false);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: profile.name || '',
            department: profile.department || '',
            phone: profile.phone || ''
        });
        setIsEditing(false);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading profile...
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', margin: 0 }}>
                    {isEditing ? 'Edit Profile' : 'Profile'}
                </h1>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                )}
            </div>

            <Card>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                                    Name <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                                    Department
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Name
                            </label>
                            <div style={{ fontSize: '16px', color: 'var(--text)' }}>
                                {profile?.name || 'Not specified'}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Email
                            </label>
                            <div style={{ fontSize: '16px', color: 'var(--text)' }}>
                                {profile?.email || 'Not specified'}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Role
                            </label>
                            <div style={{ fontSize: '16px', color: 'var(--text)' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '4px',
                                    backgroundColor: profile?.role === 'Manager' ? '#eff6ff' : '#fef3c7',
                                    color: profile?.role === 'Manager' ? 'var(--primary)' : '#d97706',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    {profile?.role || 'Not specified'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Department
                            </label>
                            <div style={{ fontSize: '16px', color: 'var(--text)' }}>
                                {profile?.department || 'Not specified'}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Phone
                            </label>
                            <div style={{ fontSize: '16px', color: 'var(--text)' }}>
                                {profile?.phone || 'Not specified'}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>
                                Member Since
                            </label>
                            <div style={{ fontSize: '16px', color: 'var(--text)' }}>
                                {profile?.createdAt ? formatDate(profile.createdAt) : 'Not specified'}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Profile;
