import { createBrowserRouter } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';

// Minimal router for Session 3; the full route table and AppLayout arrive in Session 4.
export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <Products /> },
    ],
  },
]);
