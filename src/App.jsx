import { Routes, Route, Link } from 'react-router';
import PurchasePage from './pages/PurchasePage';
import BillHistoryPage from './pages/BillHistoryPage';
import SummaryPage from './pages/SummaryPage';

// import ContainerCostPage from './pages/ContainerCostPage';
// import LaborCostPage from './pages/LaborCostPage';
// import SummaryPage from './pages/SummaryPage';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Durian Panel App</h1>

      {/* ปุ่มเมนูนำทาง */}
      <div className="flex gap-2 mb-4">
        <Link to="/" className="btn btn-primary">สรุป</Link>
        <Link to="/purchase" className="btn btn-primary">ใบสั่งซื้อ</Link>
        <Link to="/bills" className="btn btn-primary">บิลย้อนหลัง</Link>
        <Link to="/summary" className="btn btn-secondary">สรุปยอด</Link>
        {/* <Link to="/container-cost" className="btn btn-secondary">ค่าตู้</Link>
        <Link to="/labor-cost" className="btn btn-secondary">ค่าแรง</Link> */}
      </div>



      <Routes>
        {/* <Route path="/" element={<SummaryPage />} /> */}
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/bills" element={<BillHistoryPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        {/* <Route path="/container-cost" element={<ContainerCostPage />} />
        <Route path="/labor-cost" element={<LaborCostPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;