import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function SellBillHistoryPage() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/sellbills`);
        const data = await res.json();
        setBills(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBills();
  }, []);

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.weight * item.pricePerKg, 0);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/sellbills/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");
      alert("ลบสำเร็จ");
      setBills(bills.filter((b) => b.id !== id));
      setBillToDelete(null);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">ประวัติบิลขาย</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ลูกค้า</th>
              <th>จำนวนรายการ</th>
              <th>รวมเงิน (บาท)</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.date.split("T")[0]}</td>
                <td>{bill.customer}</td>
                <td>{bill.items.length} รายการ</td>
                <td>{calculateTotal(bill.items).toLocaleString()}</td>
                <td className="flex flex-wrap gap-1">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setSelectedBill(bill)}
                  >
                    ดูรายละเอียด
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => navigate(`/edit-sell/${bill.id}`)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => setBillToDelete(bill)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBill && (
        <dialog id="billDetailModal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-2">
              รายละเอียดบิล {selectedBill.id}
            </h3>
            <p>ลูกค้า: {selectedBill.customer}</p>
            <p>วันที่: {selectedBill.date.split("T")[0]}</p>

            <div className="overflow-x-auto mt-4">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>พันธุ์</th>
                    <th>เกรด</th>
                    <th>น้ำหนัก (กก.)</th>
                    <th>ราคา/กก.</th>
                    <th>รวม (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.variety}</td>
                      <td>{item.grade}</td>
                      <td>{item.weight}</td>
                      <td>{item.pricePerKg}</td>
                      <td>{(item.weight * item.pricePerKg).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-action">
              <a
                href={`${import.meta.env.VITE_API_URL}/v1/sellbills/${selectedBill.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                พิมพ์ PDF
              </a>
              <button className="btn" onClick={() => setSelectedBill(null)}>
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}

      {billToDelete && (
        <dialog id="confirmDeleteModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">ยืนยันการลบ</h3>
            <p>
              คุณต้องการลบบิล <strong>{billToDelete.id}</strong> ใช่หรือไม่?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => handleDelete(billToDelete.id)}
              >
                ยืนยันลบ
              </button>
              <button className="btn" onClick={() => setBillToDelete(null)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}