import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Modal from './Modal';
import Button from './Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'quantity'>>({
    name: '',
    description: '',
    size: '',
    weight: 0,
    material: '',
    minStock: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        size: product.size,
        weight: product.weight,
        material: product.material,
        minStock: product.minStock,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        size: '',
        weight: 0,
        material: '',
        minStock: 10,
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'weight' || name === 'minStock' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("O nome do produto é obrigatório.");
      return;
    }
    onSave({
      ...formData,
      id: product?.id || '',
      quantity: product?.quantity || 0,
    });
  };
  
  const renderInputField = (label: string, name: keyof typeof formData, type: string, required: boolean = false) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={String(formData[name])}
            onChange={handleChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Editar Produto' : 'Adicionar Produto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderInputField('Nome do Produto', 'name', 'text', true)}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInputField('Tamanho', 'size', 'text')}
            {renderInputField('Peso (kg)', 'weight', 'number')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInputField('Material', 'material', 'text')}
            {renderInputField('Estoque Mínimo', 'minStock', 'number', true)}
        </div>
        <div className="flex justify-end pt-4 gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
