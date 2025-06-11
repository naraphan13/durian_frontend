import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function PayrollHistoryPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/payroll`)
      .then((res) => res.json())
      .then((data) => setPayrolls(data))
      .catch((err) => console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", err))
      .finally(() => setLoading(false));
  }, []);

  const calculateNetPay = (item) => {
    const totalPay =
      item.payType === "รายวัน" || item.payType === "รายตู้"
        ? (item.workDays || 0) * (item.pricePerDay || 0)
        : (item.monthlySalary || 0) * (item.months || 0);

    const totalDeductions = Array.isArray(item.deductions)
      ? item.deductions.reduce((sum, d) => sum + (d.amount || 0), 0)
      : 0;

    return totalPay - totalDeductions;
  };

  const handleDelete = async (id) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบ?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/v1/payroll/${id}`, {
        method: "DELETE",
      });
      setPayrolls(payrolls.filter((p) => p.id !== id));
    } catch (err) {
      console.error("ลบไม่สำเร็จ", err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const openPdf = (id) => {
    window.open(`${import.meta.env.VITE_API_URL}/v1/payroll/${id}/pdf`, "_blank");
  };

  const handleEdit = (id) => {
    navigate(`/payroll/${id}/edit`);
  };

  if (loading) return <div className="p-4">กำลังโหลด...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ประวัติการจ่ายเงินเดือน</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อพนักงาน</th>
              <th>วันที่</th>
              <th>ประเภท</th>
              <th>วิธีจ่าย</th>
              <th>ยอดสุทธิ</th>
              <th>งวด</th>
              <th>PDF</th>
              <th>แก้ไข</th>
              <th>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.employeeName}</td>
                <td>{new Date(item.date).toLocaleDateString("th-TH")}</td>
                <td>{item.payType}</td>
                <td>{item.method || "-"}</td>
                <td>{calculateNetPay(item).toLocaleString()} บาท</td>
                <td>{item.period || "-"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => openPdf(item.id)}
                  >
                    PDF
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning text-white"
                    onClick={() => handleEdit(item.id)}
                  >
                    แก้ไข
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleDelete(item.id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
