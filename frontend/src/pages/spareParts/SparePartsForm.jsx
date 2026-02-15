import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getSparePart, createSparePart, updateSparePart } from '../../services/sparePartService';
import toast from 'react-hot-toast';
import './SparePartsList.css';

const SparePartsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
   const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        category: 'Mechanical',
        quantity: 0,
        unit: 'pcs',
        minimumStock: 0,
        reorderPoint: 0,
        unitPrice: 0,
        location: '',
        supplier: '',
        supplierPartNumber: '',
        leadTime: 0,
        notes: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchSparePart();
        }
    }, [id]);

    const fetchSparePart = async () => {
        try {
            setLoading(true);
            const data = await getSparePart(id);
            const part = data.data;
            
            // Handle supplier object - extract name if it's an object
            if (part.supplier && typeof part.supplier === 'object') {
                part.supplier = part.supplier.name || '';
            }
            
            setFormData(part);
        } catch (error) {
            toast.error('Failed to load spare part');
            navigate('/spare-parts');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            // Prepare data - remove fields that shouldn't be updated
            const updateData = {
                sku: formData.sku,
                name: formData.name,
                description: formData.description,
                category: formData.category,
                quantity: Number(formData.quantity),
                unit: formData.unit,
                minimumStock: Number(formData.minimumStock),
                reorderPoint: Number(formData.reorderPoint),
                unitPrice: Number(formData.unitPrice),
                location: formData.location,
                supplier: formData.supplier,
                supplierPartNumber: formData.supplierPartNumber,
                leadTime: Number(formData.leadTime),
                notes: formData.notes
            };
            
            if (isEditMode) {
                await updateSparePart(id, updateData);
                toast.success('Spare part updated successfully');
            } else {
                await createSparePart(updateData);
                toast.success('Spare part created successfully');
            }
            navigate('/spare-parts');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} spare part: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Mechanical', 'Electrical', 'Electronics', 'Consumable', 'Tool', 'Safety', 'Other'];
    const units = ['pcs', 'kg', 'lbs', 'liters', 'gallons', 'meters', 'feet', 'boxes', 'rolls'];

    return (
        <div className="spare-parts-form-page">
            <div className="form-header">
                <button 
                    onClick={() => navigate('/spare-parts')}
                    className="btn-back"
                >
                    <ArrowLeft size={20} />
                    Back to Inventory
                </button>
                <h1>{isEditMode ? 'Edit Spare Part' : 'Add New Spare Part'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="spare-parts-form">
                <div className="form-card">
                    <h3>Basic Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="sku">SKU *</label>
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                placeholder="e.g., CNC-BRG-456"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Part Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., CNC Spindle Bearings"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Enter part description..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="unit">Unit *</label>
                            <select
                                id="unit"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                required
                            >
                                {units.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-card">
                    <h3>Inventory</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="quantity">Current Quantity *</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="minimumStock">Minimum Stock *</label>
                            <input
                                type="number"
                                id="minimumStock"
                                name="minimumStock"
                                value={formData.minimumStock}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reorderPoint">Reorder Point</label>
                            <input
                                type="number"
                                id="reorderPoint"
                                name="reorderPoint"
                                value={formData.reorderPoint}
                                onChange={handleChange}
                                min="0"
                                step="1"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Storage Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Warehouse A, Shelf 3"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-card">
                    <h3>Pricing & Supplier</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="unitPrice">Unit Price (₹) *</label>
                            <input
                                type="number"
                                id="unitPrice"
                                name="unitPrice"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="supplier">Supplier</label>
                            <input
                                type="text"
                                id="supplier"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                placeholder="e.g., ABC Industrial Supplies"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="supplierPartNumber">Supplier Part Number</label>
                            <input
                                type="text"
                                id="supplierPartNumber"
                                name="supplierPartNumber"
                                value={formData.supplierPartNumber}
                                onChange={handleChange}
                                placeholder="e.g., SUP-12345"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="leadTime">Lead Time (days)</label>
                            <input
                                type="number"
                                id="leadTime"
                                name="leadTime"
                                value={formData.leadTime}
                                onChange={handleChange}
                                min="0"
                                step="1"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-card">
                    <h3>Additional Notes</h3>
                    <div className="form-group full-width">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Add any additional notes or specifications..."
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/spare-parts')}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            'Saving...'
                        ) : (
                            <>
                                <Save size={18} />
                                {isEditMode ? 'Update Part' : 'Create Part'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SparePartsForm;
