import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function CuttingBillHistoryPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/cuttingbills`);
      setBills(res.data);
    } catch (err) {
      console.error("โหลดบิลไม่สำเร็จ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("คุณต้องการลบบิลนี้ใช่หรือไม่?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/v1/cuttingbills/${id}`);
        setBills(bills.filter((b) => b.id !== id));
      } catch (err) {
        alert("ลบไม่สำเร็จ");
        console.error("ลบไม่สำเร็จ:", err);
      }
    }
  };

  const openPDF = (id) => {
    window.open(`${import.meta.env.VITE_API_URL}/v1/cuttingbills/${id}/pdf`, "_blank");
  };

  // ✅ แก้ปัญหาเรื่อง timezone ให้แสดงวันที่แบบไทย
  const formatDate = (str) => {
    const date = new Date(str);
    const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return localDate.toLocaleDateString("th-TH");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">ประวัติบิลค่าตัดทุเรียน</h1>

      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-green-700 font-semibold">กำลังโหลด...</span>
        </div>
      ) : bills.length === 0 ? (
        <p className="text-gray-500 text-center">ยังไม่มีบิล</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ชื่อสายตัด</th>
                <th>วันที่</th>
                <th>ยอดสุทธิ</th>
                <th>ตัวเลือก</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => {
                const mainTotal =
                  bill.mainItems && bill.mainItems.length > 0
                    ? bill.mainItems.reduce((sum, item) => {
                        const weight = item.weight ?? 0;
                        const price = item.price ?? 0;
                        return sum + (weight ? weight * price : price);
                      }, 0)
                    : bill.mainWeight * bill.mainPrice;

                const deductTotal = bill.deductItems.reduce(
                  (sum, item) => sum + (item.actualAmount ?? item.qty * item.unitPrice),
                  0
                );

                const extraTotal = bill.extraDeductions.reduce(
                  (sum, item) => sum + item.amount,
                  0
                );

                const netTotal = mainTotal - deductTotal - extraTotal;

                return (
                  <tr key={bill.id}>
                    <td>{bill.id}</td>
                    <td>{bill.cutterName}</td>
                    <td>{formatDate(bill.date)}</td>
                    <td>{netTotal.toLocaleString()} บาท</td>
                    <td className="flex gap-2 flex-wrap">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => navigate(`/cuttingbill/edit/${bill.id}`)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(bill.id)}
                      >
                        ลบ
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => openPDF(bill.id)}
                      >
                        ปริ้น
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
