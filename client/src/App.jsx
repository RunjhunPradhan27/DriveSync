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
import CreateCustomerPage from './pages/CreateCustomerPage.jsx';
import EditCustomerPage from './pages/EditCustomerPage.jsx';
import SalesListPage from './pages/SalesListPage.jsx';
import SaleDetailsPage from './pages/SaleDetailsPage.jsx';
import CreateSalePage from './pages/CreateSalePage.jsx';
import EditSalePage from './pages/EditSalePage.jsx';
import InventoryListPage from './pages/InventoryListPage.jsx';
import InventoryDetailsPage from './pages/InventoryDetailsPage.jsx';
import CreateInventoryPage from './pages/CreateInventoryPage.jsx';
import EditInventoryPage from './pages/EditInventoryPage.jsx';
import SparePartsListPage from './pages/SparePartsListPage.jsx';
import SparePartDetailsPage from './pages/SparePartDetailsPage.jsx';
import CreateSparePartPage from './pages/CreateSparePartPage.jsx';
import EditSparePartPage from './pages/EditSparePartPage.jsx';
import ServiceBookingsListPage from './pages/ServiceBookingsListPage.jsx';
import ServiceBookingDetailsPage from './pages/ServiceBookingDetailsPage.jsx';
import CreateServiceBookingPage from './pages/CreateServiceBookingPage.jsx';
import EditServiceBookingPage from './pages/EditServiceBookingPage.jsx';
import ServiceRecordsListPage from './pages/ServiceRecordsListPage.jsx';
import ServiceRecordDetailsPage from './pages/ServiceRecordDetailsPage.jsx';
import CreateServiceRecordPage from './pages/CreateServiceRecordPage.jsx';
import EditServiceRecordPage from './pages/EditServiceRecordPage.jsx';
import EmployeeListPage from './pages/EmployeeListPage.jsx';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage.jsx';
import CreateEmployeePage from './pages/CreateEmployeePage.jsx';
import EditEmployeePage from './pages/EditEmployeePage.jsx';

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
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/employees/new" element={<CreateEmployeePage />} />
            <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
            <Route path="/employees/:id/edit" element={<EditEmployeePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Sales Executive']} />}>
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/customers/new" element={<CreateCustomerPage />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            <Route path="/customers/:id/edit" element={<EditCustomerPage />} />

            <Route path="/sales" element={<SalesListPage />} />
            <Route path="/sales/new" element={<CreateSalePage />} />
            <Route path="/sales/:id" element={<SaleDetailsPage />} />
            <Route path="/sales/:id/edit" element={<EditSalePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']} />}>
            <Route path="/inventory" element={<InventoryListPage />} />
            <Route path="/inventory/new" element={<CreateInventoryPage />} />
            <Route path="/inventory/:id" element={<InventoryDetailsPage />} />
            <Route path="/inventory/:id/edit" element={<EditInventoryPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Inventory Manager', 'Technician']} />}>
            <Route path="/spare-parts" element={<SparePartsListPage />} />
            <Route path="/spare-parts/:id" element={<SparePartDetailsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']} />}>
            <Route path="/spare-parts/new" element={<CreateSparePartPage />} />
            <Route path="/spare-parts/:id/edit" element={<EditSparePartPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Technician', 'Sales Executive']} />}>
            <Route path="/service-bookings" element={<ServiceBookingsListPage />} />
            <Route path="/service-bookings/:id" element={<ServiceBookingDetailsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Sales Executive']} />}>
            <Route path="/service-bookings/new" element={<CreateServiceBookingPage />} />
            <Route path="/service-bookings/:id/edit" element={<EditServiceBookingPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Technician']} />}>
            <Route path="/service-records" element={<ServiceRecordsListPage />} />
            <Route path="/service-records/new" element={<CreateServiceRecordPage />} />
            <Route path="/service-records/:id" element={<ServiceRecordDetailsPage />} />
            <Route path="/service-records/:id/edit" element={<EditServiceRecordPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
