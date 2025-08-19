import React, { useState, useEffect } from 'react';
import { productService, Product } from '../../services/product.service';
import Button from '../common/Button';
import Modal from './common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import NotificationModal from '../common/NotificationModal';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
  });
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    sku: string;
    stockQuantity: number;
    category: string;
    status: 'active' | 'inactive' | 'out_of_stock';
  }>({
    name: '',
    description: '',
    price: 0,
    sku: '',
    stockQuantity: 0,
    category: '',
    status: 'active'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAdminProducts();
      setProducts(response.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price || 0,
        sku: product.sku,
        stockQuantity: product.stockQuantity || 0,
        category: product.category || '',
        status: product.status
      });
      setShowEditModal(true);
    }
  };

  const handleAddProduct = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      sku: '',
      stockQuantity: 0,
      category: '',
      status: 'active' as 'active' | 'inactive' | 'out_of_stock'
    });
    setActiveTab('info');
    setShowAddModal(true);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id ? { ...p, ...formData } : p
      ));
      setShowEditModal(false);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
        isFeatured: false,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        categoryId: 'cat-1'
      };
      setProducts(prev => [...prev, newProduct]);
      setShowAddModal(false);
    }
    setSelectedProduct(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product?.name}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: () => {
        setProducts(prev => prev.filter(product => product.id !== id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setNotificationModal({
          isOpen: true,
          title: 'Success',
          message: 'Product deleted successfully',
          type: 'success'
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Products Management</h2>
        <Button variant="primary" className="flex items-center" onClick={handleAddProduct}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-[#2d2d2d] shadow overflow-hidden sm:rounded-md border border-[#404040]">
        <table className="min-w-full divide-y divide-[#404040]">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-md object-cover"
                      src={product.image || '/images/placeholder-food.svg'}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-food.svg';
                      }}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{product.name}</div>
                      <div className="text-sm text-[#cccccc]">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  €{product.price?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {product.stockQuantity || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editProduct(product.id)}
                      className="flex items-center px-3 py-2 text-white border border-[#404040] hover:text-[#ff6b35] hover:border-[#ff6b35] hover:bg-[#2d2d2d] rounded-md transition-colors duration-200 text-sm"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="flex items-center px-3 py-2 text-white border border-[#404040] hover:text-[#ef4444] hover:border-[#ef4444] hover:bg-[#2d2d2d] rounded-md transition-colors duration-200 text-sm"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
        size="xl"
      >
        <div className="p-6">
          <div className="flex border-b border-[#404040] mb-6">
            {['info', 'pricing', 'images', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'text-[#ff6b35] border-b-2 border-[#ff6b35]'
                    : 'text-[#cccccc] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Current Image Preview */}
              {selectedProduct && selectedProduct.image && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Current Image</h3>
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={selectedProduct.image || selectedProduct.featuredImage || '/images/placeholder-food.svg'}
                        alt={selectedProduct.name}
                        className="w-32 h-32 object-cover rounded-lg border border-[#404040]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-food.svg';
                        }}
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        onClick={() => {
                          // Handle image removal
                          console.log('Remove current image');
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#cccccc] mb-2">Current product image</p>
                      <p className="text-xs text-[#888888]">
                        Image URL: {selectedProduct.image || selectedProduct.featuredImage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Upload New Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  {selectedProduct ? 'Replace Image' : 'Add Product Image'}
                </h3>
                <div className="border-2 border-dashed border-[#404040] rounded-lg p-8 text-center hover:border-[#ff6b35] transition-colors">
                  <PhotoIcon className="h-12 w-12 text-[#cccccc] mx-auto mb-4" />
                  <p className="text-[#cccccc] mb-2">Drag and drop images here, or click to browse</p>
                  <p className="text-xs text-[#888888] mb-4">Supports: JPG, PNG, WebP (Max 5MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Handle file upload
                        console.log('File selected:', file);
                      }
                    }}
                  />
                  <label htmlFor="image-upload">
                    <Button variant="secondary" size="small" className="cursor-pointer">
                      Choose Files
                    </Button>
                  </label>
                </div>
              </div>
              
              {/* Image URL Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#cccccc]">Or enter image URL</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                    onChange={(e) => {
                      // Handle URL input
                      console.log('Image URL:', e.target.value);
                    }}
                  />
                  <Button variant="secondary" size="small">
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="Curry Bases">Curry Bases</option>
                  <option value="Gravies">Gravies</option>
                  <option value="Spice Mixes">Spice Mixes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-[#404040]">
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedProduct(null);
            }}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveProduct}>
              {selectedProduct ? 'Save Changes' : 'Save Product'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        loading={loading}
      />

      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
      />
    </div>
  );
};

export default ProductsManagement;