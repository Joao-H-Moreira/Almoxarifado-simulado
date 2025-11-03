import React, { useState } from 'react';
import { Product, MovementType } from '../types';
import Modal from './Modal';
import Button from './Button';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quantity: number) => void;
  product: Product;
  type: MovementType;
}

const MovementModal: React.FC<MovementModalProps> = ({ isOpen, onClose, onSave, product, type }) => {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      alert("A quantidade deve ser maior que zero.");
      return;
    }
    onSave(quantity);
    setQuantity(1); // Reset for next time
  };

  const isEntry = type === MovementType.IN;
  const title = isEntry ? 'Registrar Entrada' : 'Registrar Saída';
  const buttonVariant = isEntry ? 'success' : 'primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-500">Estoque atual: {product.quantity}</p>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantidade</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
            required
            autoFocus
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end pt-4 gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant={buttonVariant}>
            Confirmar {isEntry ? 'Entrada' : 'Saída'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MovementModal;
