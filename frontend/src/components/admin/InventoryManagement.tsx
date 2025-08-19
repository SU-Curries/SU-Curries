import React, { useState, useEffect } from 'react';
import { productService, Product } from '../../services/product.service';
import Button from '../common/Button';
import Input from '../common/Input';
import { ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline';

const InventoryManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);

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

  const updateStock = async (productId: string, newStock: number) => {
    try {
      await productService.updateProduct(productId, { stockQuantity: newStock });
      await loadProducts();
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = !lowStockFilter || (product.stockQuantity || 0) < 10;
    return matchesSearch && matchesLowStock;
  });

  const lowStockCount = products.filter(p => (p.stockQuantity || 0) < 10).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
        <div className="flex items-center space-x-4">
          {lowStockCount > 0 && (
            <div className="flex items-center text-red-600">
              <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">{lowStockCount} low stock items</span>
            </div>
          )}
          <Button variant="primary" className="flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={lowStockFilter}
            onChange={(e) => setLowStockFilter(e.target.checked)}
            className="mr-2"
          />
          Show low stock only
        </label>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#2d2d2d] shadow overflow-hidden sm:rounded-md border border-[#404040]">
        <table className="min-w-full divide-y divide-[#404040]">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#2d2d2d] divide-y divide-[#404040]">
            {filteredProducts.map((product) => (
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
                      <div className="text-sm text-[#cccccc]">€{product.price?.toFixed(2)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={product.stockQuantity || 0}
                      onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-[#404040] rounded text-sm bg-[#1a1a1a] text-white"
                      min="0"
                    />
                    {(product.stockQuantity || 0) < 10 && (
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-500 ml-2" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    (product.stockQuantity || 0) > 10 
                      ? 'bg-green-100 text-green-800' 
                      : (product.stockQuantity || 0) > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(product.stockQuantity || 0) > 10 ? 'In Stock' : 
                     (product.stockQuantity || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="secondary" size="small">
                    Reorder
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;