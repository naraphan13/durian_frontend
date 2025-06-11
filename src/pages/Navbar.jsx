import { Link , useNavigate } from "react-router";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-base-200 p-4 rounded-lg relative">
        <h1 className="text-xl font-bold">Durian 388 App</h1>

        {/* Hamburger Button */}
        <button
          className="btn btn-square btn-ghost"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul className="absolute top-full right-0 mt-2 w-52 bg-white shadow-lg rounded-lg z-50">
            <li><Link to="/" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>หน้าแรก</Link></li>
            <li><Link to="/register" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>สมัครสมาชิก</Link></li>
            <li><Link to="/purchase" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>ใบสั่งซื้อ</Link></li>
            <li><Link to="/bills" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>บิลย้อนหลัง</Link></li>
            <li><Link to="/summary" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>สรุปยอด</Link></li>
            <li><Link to="/export" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>ค่าตู้เอกสาร</Link></li>
            <li><Link to="/export-history" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>ประวัติเอกสาร</Link></li>
            <li><Link to="/packing" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>คำนวณค่าแพ็คทุเรียน</Link></li>
            <li><Link to="/chemicaldip" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>คำนวณค่าชุบน้ำยาทุเรียน</Link></li>
            <li><Link to="/containerloading" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>คำนวณค่าขึ้นตู้ทุเรียน</Link></li>
            <li><Link to="/cuttingbill" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>คำนวณค่าสายตัดทุเรียน</Link></li>

            <li><Link to="/sellbill" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>บิลขาย</Link></li>
            <li><Link to="/payroll" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>เงินเดือนพนักงาน</Link></li>
            <li><Link to="/grade-calculator" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>ค่าเฉลี่ย</Link></li>



            <li>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  navigate('/login');
                  setIsOpen(false); // ถ้าคุณใช้ dropdown หรือเมนู toggle
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                ออกจากระบบ
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Navbar;
