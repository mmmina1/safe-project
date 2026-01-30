import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/Footer';

function AdminLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f1224',
      }}
    >
      <AdminHeader />

      <main
        style={{
          padding: '100px 60px 40px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default AdminLayout;