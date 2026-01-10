import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        department: '',
        category: '',
    });

    useEffect(() => {
        fetchEquipment();
    }, [filters]);

    const fetchEquipment = async () => {
        try {
            const data = await equipmentService.getAll(filters);
            setEquipment(data);
        } catch (error) {
            toast.error('Failed to fetch equipment');
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

    const handleScrap = async (id) => {
        if (window.confirm('Are you sure you want to scrap this equipment?')) {
            try {
                await equipmentService.scrap(id);
                toast.success('Equipment marked as scrapped');
                fetchEquipment();
            } catch (error) {
                toast.error('Failed to scrap equipment');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px' }}>Equipment</h1>
                <Link to="/equipment/new" className="btn btn-primary">
                    + Add Equipment
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
                        <option value="Active">Active</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                        <option value="Scrapped">Scrapped</option>
                    </select>

                    <select
                        name="category"
                        className="form-control"
                        value={filters.category}
                        onChange={handleFilterChange}
                        style={{ width: 'auto' }}
                    >
                        <option value="">All Categories</option>
                        <option value="Machinery">Machinery</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Tools">Tools</option>
                        <option value="IT Equipment">IT Equipment</option>
                    </select>
                </div>

                <div style={{ overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Serial Number</th>
                                <th style={{ padding: '12px' }}>Category</th>
                                <th style={{ padding: '12px' }}>Department</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
                                        No equipment found
                                    </td>
                                </tr>
                            ) : (
                                equipment.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px' }}>{item.name}</td>
                                        <td style={{ padding: '12px' }}>{item.serialNumber}</td>
                                        <td style={{ padding: '12px' }}>{item.category}</td>
                                        <td style={{ padding: '12px' }}>{item.department}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span
                                                className={`badge ${item.status === 'Active' ? 'badge-repaired' :
                                                        item.status === 'Under Maintenance' ? 'badge-in-progress' :
                                                            'badge-scrap'
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link
                                                    to={`/equipment/${item._id}`}
                                                    className="btn btn-secondary"
                                                    style={{ fontSize: '12px', padding: '6px 12px' }}
                                                >
                                                    View
                                                </Link>
                                                {item.status !== 'Scrapped' && (
                                                    <button
                                                        onClick={() => handleScrap(item._id)}
                                                        className="btn btn-danger"
                                                        style={{ fontSize: '12px', padding: '6px 12px' }}
                                                    >
                                                        Scrap
                                                    </button>
                                                )}
                                            </div>
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

export default EquipmentList;
