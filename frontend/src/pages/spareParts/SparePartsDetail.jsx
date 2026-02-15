import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, ArrowLeft, Edit, Trash2, Calendar, DollarSign, Box } from 'lucide-react';
import { getSparePart, deleteSparePart } from '../../services/sparePartService';
import toast from 'react-hot-toast';
import './SparePartsList.css';

const SparePartsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sparePart, setSparePart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSparePart();
    }, [id]);

    const fetchSparePart = async () => {
        try {
            setLoading(true);
            const data = await getSparePart(id);
            setSparePart(data.data);
        } catch (error) {
            toast.error('Failed to load spare part');
            navigate('/spare-parts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this spare part?')) {
            try {
                await deleteSparePart(id);
                toast.success('Spare part deleted successfully');
                navigate('/spare-parts');
            } catch (error) {
                toast.error('Failed to delete spare part');
            }
        }
    };

    const getStockLevel = () => {
        if (!sparePart || sparePart.minimumStock === 0) return 100;
        return Math.round((sparePart.quantity / (sparePart.minimumStock * 2)) * 100);
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

    if (loading) {
        return (
            <div className="spare-parts-detail">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading spare part details...</p>
                </div>
            </div>
        );
    }

    if (!sparePart) {
        return (
            <div className="spare-parts-detail">
                <div className="empty-state">
                    <Package size={64} />
                    <h3>Spare Part Not Found</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="spare-parts-detail">
            {/* Header */}
            <div className="detail-header">
                <button 
                    onClick={() => navigate('/spare-parts')}
                    className="btn-back"
                >
                    <ArrowLeft size={20} />
                    Back to Inventory
                </button>
                <div className="detail-actions">
                    <Link to={`/spare-parts/${id}/edit`} className="btn btn-secondary">
                        <Edit size={18} />
                        Edit
                    </Link>
                    <button 
                        onClick={handleDelete}
                        className="btn btn-danger"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Title Card */}
            <div className="detail-card title-card">
                <div className="detail-title-content">
                    <div className="title-icon">
                        <Package size={40} />
                    </div>
                    <div className="title-info">
                        <h1>{sparePart.name}</h1>
                        <p className="sku-text">SKU: {sparePart.sku}</p>
                        {sparePart.description && (
                            <p className="description-text">{sparePart.description}</p>
                        )}
                        <div className="title-meta">
                            <span className="category-badge">{sparePart.category}</span>
                            <span className={getStatusBadgeClass(sparePart.status)}>
                                {sparePart.status}
                            </span>
                        </div>
                    </div>
                    <div className="quantity-display">
                        <div className="quantity-value">{sparePart.quantity}</div>
                        <div className="quantity-label">{sparePart.unit}</div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="detail-grid">
                {/* Inventory Info */}
                <div className="detail-card">
                    <div className="card-header">
                        <Box size={20} />
                        <h3>Inventory Information</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Current Quantity</span>
                            <span className="info-value">
                                <strong>{sparePart.quantity}</strong> {sparePart.unit}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Minimum Stock</span>
                            <span className="info-value">{sparePart.minimumStock} {sparePart.unit}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Reorder Point</span>
                            <span className="info-value">{sparePart.reorderPoint || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Stock Level</span>
                            <span className="info-value">
                                <div className="stock-level-container">
                                    <div className="stock-level-bar">
                                        <div
                                            className={`stock-level-fill ${
                                                getStockLevel() < 30
                                                    ? 'stock-critical'
                                                    : getStockLevel() < 60
                                                    ? 'stock-warning'
                                                    : 'stock-good'
                                            }`}
                                            style={{ width: `${getStockLevel()}%` }}
                                        ></div>
                                    </div>
                                    <span className="stock-percentage">{getStockLevel()}%</span>
                                </div>
                            </span>
                        </div>
                        {sparePart.location && (
                            <div className="info-item">
                                <span className="info-label">Location</span>
                                <span className="info-value">{sparePart.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Info */}
                <div className="detail-card">
                    <div className="card-header">
                        <DollarSign size={20} />
                        <h3>Pricing Information</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Unit Price</span>
                            <span className="info-value price-value">
                                ₹{sparePart.unitPrice ? sparePart.unitPrice.toFixed(2) : '0.00'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Total Value</span>
                            <span className="info-value price-value">
                                <strong>₹{sparePart.unitPrice && sparePart.quantity ? (sparePart.unitPrice * sparePart.quantity).toFixed(2) : '0.00'}</strong>
                            </span>
                        </div>
                        {sparePart.supplier && (
                            <>
                                <div className="info-item">
                                    <span className="info-label">Supplier</span>
                                    <span className="info-value">
                                        {typeof sparePart.supplier === 'object' ? sparePart.supplier.name : sparePart.supplier}
                                    </span>
                                </div>
                                {sparePart.supplierPartNumber && (
                                    <div className="info-item">
                                        <span className="info-label">Supplier Part #</span>
                                        <span className="info-value">{sparePart.supplierPartNumber}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="detail-card">
                    <div className="card-header">
                        <Calendar size={20} />
                        <h3>Additional Information</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Created</span>
                            <span className="info-value">
                                {new Date(sparePart.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Last Updated</span>
                            <span className="info-value">
                                {new Date(sparePart.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                        {sparePart.lastRestocked && (
                            <div className="info-item">
                                <span className="info-label">Last Restocked</span>
                                <span className="info-value">
                                    {new Date(sparePart.lastRestocked).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        {sparePart.leadTime && (
                            <div className="info-item">
                                <span className="info-label">Lead Time</span>
                                <span className="info-value">{sparePart.leadTime} days</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            {sparePart.notes && (
                <div className="detail-card">
                    <div className="card-header">
                        <Calendar size={20} />
                        <h3>Notes</h3>
                    </div>
                    <p className="notes-text">{sparePart.notes}</p>
                </div>
            )}
        </div>
    );
};

export default SparePartsDetail;
