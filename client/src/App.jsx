import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import VehicleListPage from './pages/VehicleListPage.jsx';
import VehicleDetailsPage from './pages/VehicleDetailsPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<VehicleListPage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
