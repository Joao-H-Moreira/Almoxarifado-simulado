import React, { useState, useCallback, useMemo } from 'react';
import { User, Product, Movement, MovementType, Page } from './types';
import LoginScreen from './components/LoginScreen';
import MainLayout from './components/MainLayout';
import ProductManagement from './components/ProductManagement';
import StockManagement from './components/StockManagement';

// Mock initial data
const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Martelo de Unha', description: 'Martelo com cabeça de aço forjado e cabo de madeira.', size: '27mm', weight: 0.75, material: 'Aço/Madeira', quantity: 50, minStock: 20 },
  { id: 'prod-2', name: 'Chave de Fenda Phillips', description: 'Chave com ponta magnetizada para parafusos Phillips.', size: 'PH2x100mm', weight: 0.15, material: 'Cromo-vanádio', quantity: 120, minStock: 50 },
  { id: 'prod-3', name: 'Alicate Universal', description: 'Alicate para cortar, prender e dobrar.', size: '8 polegadas', weight: 0.3, material: 'Aço Carbono', quantity: 15, minStock: 30 },
  { id: 'prod-4', name: 'Serrote de Poda', description: 'Serrote com lâmina de aço temperado para jardinagem.', size: '12 polegadas', weight: 0.4, material: 'Aço/Plástico', quantity: 45, minStock: 15 },
];

const INITIAL_MOVEMENTS: Movement[] = [
    { id: 'mov-1', productId: 'prod-1', productName: 'Martelo de Unha', type: MovementType.IN, quantity: 50, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'mov-2', productId: 'prod-2', productName: 'Chave de Fenda Phillips', type: MovementType.IN, quantity: 150, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'mov-3', productId: 'prod-2', productName: 'Chave de Fenda Phillips', type: MovementType.OUT, quantity: 30, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'mov-4', productId: 'prod-3', productName: 'Alicate Universal', type: MovementType.IN, quantity: 45, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'mov-5', productId: 'prod-3', productName: 'Alicate Universal', type: MovementType.OUT, quantity: 30, date: new Date().toISOString() },
];


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('stock');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [movements, setMovements] = useState<Movement[]>(INITIAL_MOVEMENTS);

  const handleLogin = useCallback((username: string, password: string) => {
    // Mock authentication
    if (username === 'admin' && password === 'admin') {
      setUser({ id: 1, name: 'Administrador', username: 'admin' });
      setLoginError(null);
    } else {
      setLoginError('Usuário ou senha inválidos.');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  const handleSaveProduct = useCallback((product: Product) => {
    setProducts(prevProducts => {
      const existingIndex = prevProducts.findIndex(p => p.id === product.id);
      if (existingIndex > -1) {
        const newProducts = [...prevProducts];
        newProducts[existingIndex] = product;
        return newProducts;
      } else {
        return [...prevProducts, { ...product, id: `prod-${Date.now()}` }];
      }
    });
  }, []);

  const handleDeleteProduct = useCallback((productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    // Optional: Also delete related movements
    setMovements(prevMovements => prevMovements.filter(m => m.productId !== productId));
  }, []);

  const handleStockMovement = useCallback((productId: string, type: MovementType, quantity: number) => {
      setProducts(prevProducts => {
          const newProducts = [...prevProducts];
          const productIndex = newProducts.findIndex(p => p.id === productId);
          if (productIndex === -1) return prevProducts;

          const product = newProducts[productIndex];
          const newQuantity = type === MovementType.IN ? product.quantity + quantity : product.quantity - quantity;

          if (newQuantity < 0) {
              alert('Erro: A saída resultaria em estoque negativo.');
              return prevProducts;
          }

          newProducts[productIndex] = { ...product, quantity: newQuantity };

          const newMovement: Movement = {
              id: `mov-${Date.now()}`,
              productId,
              productName: product.name,
              type,
              quantity,
              date: new Date().toISOString(),
          };
          setMovements(prev => [newMovement, ...prev]);

          return newProducts;
      });
  }, []);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  if (!user) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  return (
    <MainLayout user={user} onLogout={handleLogout} currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'products' && (
        <ProductManagement
          products={products}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}
      {currentPage === 'stock' && (
        <StockManagement
          products={sortedProducts}
          onStockMovement={handleStockMovement}
        />
      )}
    </MainLayout>
  );
};

export default App;
