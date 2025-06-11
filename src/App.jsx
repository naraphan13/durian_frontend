import { Routes, Route, Link } from 'react-router';
import PurchasePage from './pages/PurchasePage';
import BillHistoryPage from './pages/BillHistoryPage';
import SummaryPage from './pages/SummaryPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Navbar from './pages/Navbar';
import EditBillPage from './pages/EditBillPage';
import ExportContainerPage from './pages/ExportContainerPage';
import ExportHistoryPage from './pages/ExportHistoryPage';
import PackingCostPage from './pages/PackingCostPage';
import ChemicalDipCostPage from './pages/ChemicalDipCostPage';
import ContainerLoadingCostPage from './pages/ContainerLoadingCostPage';
import PackingHistoryPage from './pages/PackingHistoryPage';
import ChemicalDipHistoryPage from './pages/ChemicalDipHistoryPage';
import ContainerLoadingHistoryPage from './pages/ContainerLoadingHistoryPage';
import CuttingBillPage from './pages/CuttingBillPage';
import CuttingBillHistoryPage from './pages/CuttingBillHistoryPage';
import EditCuttingBillPage from './pages/EditCuttingBillPage';
import SellBillPage from './pages/SellBillPage';
import SellBillHistoryPage from './pages/SellBillHistoryPage';
import EditSellBillPage from './pages/EditSellBillPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminRoute from './components/AdminRoute';
import PayrollPage from './pages/PayrollPage';
import PayrollHistoryPage from './pages/PayrollHistoryPage';
import GradeCalculatorPage from './pages/GradeCalculatorPage';
import GradeHistoryPage from './pages/GradeHistoryPage';
import GradeDetailPage from './pages/GradeDetailPage';
import GradeEditPage from './pages/GradeEditPage';

// import ContainerCostPage from './pages/ContainerCostPage';
// import LaborCostPage from './pages/LaborCostPage';
// import SummaryPage from './pages/SummaryPage';

function App() {














  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SURIYA 388 App</h1>

      <Navbar />



      <Routes>
      <Route path="/" element={<HomePage />} /> {/* เพิ่มหน้านี้ */}
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* <Route path="/edit/:id" element={<EditBillPage />} /> ✅ เพิ่มอันนี้ */}


      <Route
        path="/purchase"
        element={
          <ProtectedRoute>
            <PurchasePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <SummaryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bills"
        element={
          <ProtectedRoute>
            <BillHistoryPage />
          </ProtectedRoute>
        }
      />


<Route
        path="/sell-history"
        element={
          <ProtectedRoute>
            <SellBillHistoryPage />
          </ProtectedRoute>
        }
      />



<Route
  path="/export"
  element={
    <ProtectedRoute>
      <ExportContainerPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/export-history"
  element={
    <AdminRoute>
      <ExportHistoryPage />
    </AdminRoute>
  }
/>



<Route
  path="/register"
  element={
    <AdminRoute>
      <RegisterPage />
    </AdminRoute>
  }
/>


<Route
  path="/packing"
  element={
    <ProtectedRoute>
      <PackingCostPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/chemicaldip"
  element={
    <ProtectedRoute>
      <ChemicalDipCostPage />
    </ProtectedRoute>
  }
/>



<Route
  path="/chemicaldip-history"
  element={
    <ProtectedRoute>
      <ChemicalDipHistoryPage />
    </ProtectedRoute>
  }
/>



<Route
  path="/containerloading-history"
  element={
    <ProtectedRoute>
      <ContainerLoadingHistoryPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/containerloading"
  element={
    <ProtectedRoute>
      <ContainerLoadingCostPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/packing-history"
  element={
    <ProtectedRoute>
      <PackingHistoryPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/cuttingbill"
  element={
    <ProtectedRoute>
      <CuttingBillPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/cuttingbill/history"
  element={
    <ProtectedRoute>
      <CuttingBillHistoryPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/cuttingbill/edit/:id"
  element={
    <ProtectedRoute>
      <EditCuttingBillPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/sellbill"
  element={
    <ProtectedRoute>
      <SellBillPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/edit-sell/:id"
  element={
    <ProtectedRoute>
      <EditSellBillPage />
    </ProtectedRoute>
  }
/>



<Route
  path="/edit/:id"
  element={
    <ProtectedRoute>
      <EditBillPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/payroll"
  element={
    <ProtectedRoute>
      <PayrollPage/>
    </ProtectedRoute>
  }
/>
<Route
  path="/payroll/:id/edit"
  element={
    <ProtectedRoute>
      <PayrollPage/>
    </ProtectedRoute>
  }
/>
<Route
  path="/payroll-history"
  element={
    <ProtectedRoute>
      <PayrollHistoryPage/>
    </ProtectedRoute>
  }
/>

<Route
  path="/grade-history"
  element={
    <ProtectedRoute>
      <GradeHistoryPage/>
    </ProtectedRoute>
  }
/>


<Route
  path="/grade-calculator"
  element={
    <ProtectedRoute>
      <GradeCalculatorPage/>
    </ProtectedRoute>
  }
/>

<Route
  path="/grade-history/:id"
  element={
    <ProtectedRoute>
      <GradeDetailPage/>
    </ProtectedRoute>
  }
/>

<Route
  path="/grade-history/:id/edit"
  element={
    <ProtectedRoute>
      <GradeEditPage/>
    </ProtectedRoute>
  }
/>




    </Routes>
    </div>
  );
}

export default App;