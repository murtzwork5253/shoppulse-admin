import { createBrowserRouter } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Customers from '../pages/Customers';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

// `handle.title` feeds the top bar heading and the browser tab title (see AppLayout).
export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard />, handle: { title: 'Dashboard' } },
          { path: 'products', element: <Products />, handle: { title: 'Products' } },
          {
            path: 'products/:id',
            element: <ProductDetail />,
            handle: { title: 'Product details' },
          },
          { path: 'orders', element: <Orders />, handle: { title: 'Orders' } },
          { path: 'orders/:id', element: <OrderDetail />, handle: { title: 'Order details' } },
          { path: 'customers', element: <Customers />, handle: { title: 'Customers' } },
          { path: 'settings', element: <Settings />, handle: { title: 'Settings' } },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
