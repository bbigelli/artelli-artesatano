import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AboutContact from './pages/AboutContact';
import AdminPanel from './pages/Admin/AdminPanel';
import { PrivateRoute } from './components/PrivateRoute';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart"         element={<Cart />} />
          <Route path="/auth"         element={<Auth />} />
          <Route path="/about"        element={<AboutContact />} />
          <Route path="/profile"      element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin"        element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
