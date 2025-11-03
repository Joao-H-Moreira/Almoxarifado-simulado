import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import Button from './Button';
import ProductModal from './ProductModal';
import { EditIcon, DeleteIcon, PlusIcon, SearchIcon } from './icons';

interface ProductManagementProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ products, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      onDelete(productId);
    }
  };

  const handleModalSave = (product: Product) => {
    onSave(product);
    setIsModalOpen(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-md w-full sm:w-80 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button onClick={handleAddNew}>
          <PlusIcon className="w-5 h-5" />
          Adicionar Produto
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Material</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Estoque Atual</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Estoque Mínimo</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-slate-500 max-w-xs truncate">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.material}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{product.minStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductManagement;
