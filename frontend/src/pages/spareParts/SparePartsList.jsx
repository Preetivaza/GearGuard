import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Search, AlertTriangle, TrendingDown } from 'lucide-react';
import { getSpareParts, getLowStockParts } from '../../services/sparePartService';
import toast from 'react-hot-toast';
import './SparePartsList.css';

const SparePartsList = () => {
    const [spareParts, setSpareParts] = useState([]);
    const [lowStockParts, setLowStockParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const categories = ['Mechanical', 'Electrical', 'Electronics', 'Consumable', 'Tool', 'Safety', 'Other'];

    useEffect(() => {
        fetchSpareParts();
        fetchLowStockParts();
    }, [categoryFilter, statusFilter]);

    const fetchSpareParts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (categoryFilter) params.category = categoryFilter;
            if (statusFilter) params.status = statusFilter;
            if (searchTerm) params.search = searchTerm;

            const data = await getSpareParts(params);
            setSpareParts(data.data);
        } catch (error) {
            toast.error('Failed to fetch spare parts');
        } finally {
            setLoading(false);
        }
    };

    const fetchLowStockParts = async () => {
        try {
            const data = await getLowStockParts();
            setLowStockParts(data.data);
        } catch (error) {
            console.error('Failed to fetch low stock parts:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSpareParts();
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            'In Stock': 'status-badge status-in-stock',
            'Low Stock': 'status-badge status-low-stock',
            'Out of Stock': 'status-badge status-out-stock',
            'Discontinued': 'status-badge status-discontinued',
        };
        return classes[status] || 'status-badge';
    };

    const getStockLevel = (part) => {
        if (part.minimumStock === 0) return 100;
        return Math.round((part.quantity / (part.minimumStock * 2)) * 100);
    };

    return (
        <div className="spare-parts-page">
            <div className="page-header">
                <div className="header-left">
                    <h1>
                        <Package size={32} />
                        Spare Parts Inventory
                    </h1>
                    <p>Manage and track spare parts inventory</p>
                </div>
                <div className="header-right">
                    <Link to="/spare-parts/new" className="btn btn-primary">
                        <Plus size={18} />
                        Add Spare Part
                    </Link>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockParts.length > 0 && (
                <div className="alert alert-warning">
                    <AlertTriangle size={20} />
                    <div>
                        <strong>{lowStockParts.length} parts</strong> are low on stock or out of stock.
                        <Link to="#" className="alert-link">View all</Link>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="filters-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-group">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-secondary">
                        Search
                    </button>
                </form>

                <div className="filter-group">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Spare Parts Table */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading spare parts...</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="spare-parts-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Part Name</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Stock Level</th>
                                <th>Unit Price</th>
                                <th>Total Value</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spareParts.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="no-data">
                                        <Package size={48} />
                                        <p>No spare parts found</p>
                                    </td>
                                </tr>
                            ) : (
                                spareParts.map((part) => (
                                    <tr key={part._id}>
                                        <td className="sku-cell">{part.sku}</td>
                                        <td className="name-cell">
                                            <strong>{part.name}</strong>
                                            {part.description && (
                                                <span className="part-description">{part.description}</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="category-badge">{part.category}</span>
                                        </td>
                                        <td>
                                            <strong>{part.quantity}</strong> {part.unit}
                                        </td>
                                        <td>
                                            <div className="stock-level-container">
                                                <div className="stock-level-bar">
                                                    <div
                                                        className={`stock-level-fill ${
                                                            getStockLevel(part) < 30
                                                                ? 'stock-critical'
                                                                : getStockLevel(part) < 60
                                                                ? 'stock-warning'
                                                                : 'stock-good'
                                                        }`}
                                                        style={{ width: `${getStockLevel(part)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="stock-percentage">
                                                    {getStockLevel(part)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td>₹{part.unitPrice.toFixed(2)}</td>
                                        <td className="total-value">₹{(part.quantity * part.unitPrice).toFixed(2)}</td>
                                        <td>
                                            <span className={getStatusBadgeClass(part.status)}>
                                                {part.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <Link to={`/spare-parts/${part._id}`} className="btn-icon">
                                                👁️
                                            </Link>
                                            <Link to={`/spare-parts/${part._id}/edit`} className="btn-icon">
                                                ✏️
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Summary Stats */}
            <div className="summary-section">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Parts</div>
                        <div className="stat-value">{spareParts.length}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Inventory Value</div>
                        <div className="stat-value">
                            ₹{spareParts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0).toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-content">
                        <div className="stat-label">Low/Out of Stock</div>
                        <div className="stat-value">{lowStockParts.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SparePartsList;
