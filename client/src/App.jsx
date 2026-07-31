import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx';
import VehicleListPage from './pages/VehicleListPage.jsx';
import VehicleDetailsPage from './pages/VehicleDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import AdminAreaPage from './pages/AdminAreaPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CustomerListPage from './pages/CustomerListPage.jsx';
import CustomerDetailsPage from './pages/CustomerDetailsPage.jsx';
import AddCustomerPage from './pages/AddCustomerPage.jsx';
import EditCustomerPage from './pages/EditCustomerPage.jsx';
import SalesListPage from './pages/SalesListPage.jsx';
import SaleDetailsPage from './pages/SaleDetailsPage.jsx';
import CreateSalePage from './pages/CreateSalePage.jsx';
import EditSalePage from './pages/EditSalePage.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<VehicleListPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminAreaPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Sales Executive']} />}>
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/customers/new" element={<AddCustomerPage />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            <Route path="/customers/:id/edit" element={<EditCustomerPage />} />

            <Route path="/sales" element={<SalesListPage />} />
            <Route path="/sales/new" element={<CreateSalePage />} />
            <Route path="/sales/:id" element={<SaleDetailsPage />} />
            <Route path="/sales/:id/edit" element={<EditSalePage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
