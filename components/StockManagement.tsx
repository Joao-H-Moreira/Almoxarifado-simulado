import React, { useState } from 'react';
import { Product, MovementType } from '../types';
import { WarningIcon, PlusIcon, MinusIcon } from './icons';
import MovementModal from './MovementModal';

interface StockManagementProps {
  products: Product[]; // Expects sorted products
  onStockMovement: (productId: string, type: MovementType, quantity: number) => void;
}

const StockManagement: React.FC<StockManagementProps> = ({ products, onStockMovement }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementType, setMovementType] = useState<MovementType>(MovementType.IN);

  const handleOpenModal = (product: Product, type: MovementType) => {
    setSelectedProduct(product);
    setMovementType(type);
    setIsModalOpen(true);
  };

  const handleModalSave = (quantity: number) => {
    if (selectedProduct) {
      onStockMovement(selectedProduct.id, movementType, quantity);
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Estoque Atual</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Estoque Mínimo</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.map(product => {
              const isLowStock = product.quantity < product.minStock;
              return (
                <tr key={product.id} className={isLowStock ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                    <div className="text-sm text-slate-500">{product.size} / {product.material}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{product.minStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {isLowStock ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <WarningIcon className="w-4 h-4 mr-1.5" />
                        Baixo
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(product, MovementType.IN)}
                        className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                        title="Registrar Entrada"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(product, MovementType.OUT)}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                        title="Registrar Saída"
                      >
                        <MinusIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <MovementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
          product={selectedProduct}
          type={movementType}
        />
      )}
    </div>
  );
};

export default StockManagement;
