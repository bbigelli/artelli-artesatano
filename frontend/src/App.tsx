import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import { Login, Register } from './pages/Auth';
import Profile from './pages/Profile';
import { About, Contact } from './pages/AboutContact';
import AdminPanel from './pages/Admin/AdminPanel';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                borderRadius: '10px',
                background: '#fff',
                color: '#1A1A1A',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              },
            }}
          />
          <Routes>
            {/* Admin — no header/footer */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute adminOnly>
                  <AdminPanel />
                </PrivateRoute>
              }
            />

            {/* Public layout */}
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/produtos" element={<Products />} />
                    <Route path="/produtos/:slug" element={<ProductDetail />} />
                    <Route path="/carrinho" element={<Cart />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/contato" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Register />} />
                    <Route
                      path="/perfil"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
