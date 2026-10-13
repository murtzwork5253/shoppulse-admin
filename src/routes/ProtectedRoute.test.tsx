import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

const mockAuth = (value: { user: object | null; checking: boolean }) =>
  vi.mocked(useAuth).mockReturnValue(value as ReturnType<typeof useAuth>);

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<div>Products page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('ProtectedRoute', () => {
  it('redirects to /login when logged out', () => {
    mockAuth({ user: null, checking: false });
    renderAt('/products');
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Products page')).not.toBeInTheDocument();
  });

  it('shows a loading state while the session is being checked', () => {
    mockAuth({ user: null, checking: true });
    renderAt('/products');
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('renders the page when logged in', () => {
    mockAuth({ user: { id: 1 }, checking: false });
    renderAt('/products');
    expect(screen.getByText('Products page')).toBeInTheDocument();
  });
});
