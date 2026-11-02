import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosInstance';
import { X, Plus, Trash2, Upload, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Laptops & Computers',
  'Cameras & Photography',
  'Drones',
  'Gaming Consoles',
  'Audio Equipment',
  'Projectors',
  'Printers',
  'Other Electronics',
];

const EquipmentFormModal = ({ equipment, isOpen, onClose, onSaveSuccess }) => {
  const { addToast } = useToast();
  const isEditing = !!equipment?._id;

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: CATEGORIES[0],
    modelNumber: '',
    dailyPrice: '',
    securityDeposit: '',
    condition: 'Like New',
    location: 'Central Tech Hub',
    description: '',
    featured: false,
    isAvailable: true,
  });

  const [images, setImages] = useState(['']);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        brand: equipment.brand || '',
        category: equipment.category || CATEGORIES[0],
        modelNumber: equipment.modelNumber || '',
        dailyPrice: equipment.dailyPrice || '',
        securityDeposit: equipment.securityDeposit || '',
        condition: equipment.condition || 'Like New',
        location: equipment.location || 'Central Tech Hub',
        description: equipment.description || '',
        featured: Boolean(equipment.featured),
        isAvailable: equipment.isAvailable !== undefined ? equipment.isAvailable : true,
      });
      setImages(equipment.images && equipment.images.length > 0 ? equipment.images : ['']);
      setSpecifications(
        equipment.specifications && equipment.specifications.length > 0
          ? equipment.specifications
          : [{ key: '', value: '' }]
      );
    } else {
      setFormData({
        name: '',
        brand: '',
        category: CATEGORIES[0],
        modelNumber: '',
        dailyPrice: '',
        securityDeposit: '',
        condition: 'Like New',
        location: 'Central Tech Hub',
        description: '',
        featured: false,
        isAvailable: true,
      });
      setImages(['']);
      setSpecifications([{ key: '', value: '' }]);
    }
  }, [equipment, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addSpecRow = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecRow = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        addToast('Image uploaded successfully!', 'success');
        setImages((prev) => [res.data.url, ...prev.filter(Boolean)]);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredImages = images.filter((img) => img && img.trim());
    if (filteredImages.length === 0) {
      addToast('Please provide at least one image URL or upload an image.', 'warning');
      return;
    }

    const filteredSpecs = specifications.filter((s) => s.key && s.key.trim() && s.value && s.value.trim());

    const payload = {
      ...formData,
      dailyPrice: Number(formData.dailyPrice),
      securityDeposit: Number(formData.securityDeposit || 0),
      images: filteredImages,
      specifications: filteredSpecs,
    };

    setSubmitting(true);
    try {
      let res;
      if (isEditing) {
        res = await api.put(`/equipment/${equipment._id}`, payload);
        addToast('Equipment updated successfully!', 'success');
      } else {
        res = await api.post('/equipment', payload);
        addToast('New equipment added to catalog!', 'success');
      }

      if (onSaveSuccess) onSaveSuccess(res.data.data);
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#22160f] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#3b271a] text-white">
        <div className="flex items-center justify-between p-6 border-b border-[#3b271a] sticky top-0 bg-[#22160f]/95 backdrop-blur z-10">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Equipment Item' : 'Add New Equipment'}
            </h2>
            <p className="text-xs text-amber-200/70">Configure catalog specs, pricing, and availability</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#2c1d14] transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/70">Basic Information</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-200 mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sony Alpha A7 IV Full-Frame Camera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Sony, Apple, DJI"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Model / Serial Number</label>
                <input
                  type="text"
                  value={formData.modelNumber}
                  onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                  placeholder="e.g. ILCE-7M4-KIT"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Physical Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none cursor-pointer"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Deposit */}
          <div className="space-y-4 pt-2 border-t border-[#3b271a]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/70">Rental Rates & Location</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Daily Rental Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.dailyPrice}
                  onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })}
                  placeholder="1500"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  placeholder="8000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">Hub Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Central Tech Hub"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-200">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-[#9c5221] bg-[#180f0a] rounded border-[#422d1f] focus:ring-[#9c5221] cursor-pointer"
                />
                <span>Available for Rent</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-200">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#9c5221] bg-[#180f0a] rounded border-[#422d1f] focus:ring-[#9c5221] cursor-pointer"
                />
                <span>Show in Featured Section</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3 pt-2 border-t border-[#3b271a]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/70">Equipment Images</h4>
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2c1d14] border border-[#422d1f] hover:bg-[#382619] text-stone-200 text-xs font-semibold cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-[#e0a96d]" />
                {uploadingImage ? 'Uploading...' : 'Upload File'}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-xl cursor-pointer transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addImageField}
              className="text-xs font-semibold text-[#e0a96d] hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Image URL
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2 border-t border-[#3b271a]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/70">Description</h4>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe equipment performance, condition, inclusions, accessories..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
            />
          </div>

          {/* Specifications Key-Value */}
          <div className="space-y-3 pt-2 border-t border-[#3b271a]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/70">
                Technical Specifications
              </h4>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-xs font-semibold text-[#e0a96d] hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Spec
              </button>
            </div>

            {specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. Sensor, RAM)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 33MP Full-Frame, 32GB DDR5)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221]"
                />
                {specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecRow(idx)}
                    className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-xl cursor-pointer transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#3b271a]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#422d1f] text-xs font-semibold text-stone-300 hover:bg-[#2c1d14] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#9c5221] hover:bg-[#b86328] text-white text-xs font-bold shadow-md shadow-[#9c5221]/30 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Publish to Catalog'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentFormModal;
