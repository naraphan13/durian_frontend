import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function PackingHistoryPage() {
  const [packings, setPackings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/packing`)
      .then(res => res.json())
      .then(data => setPackings(data))
      .catch(err => console.error('Error loading packings:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบรายการนี้?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/v1/packing/${id}`, {
        method: 'DELETE',
      });
      setPackings(packings.filter(p => p.id !== id));
      alert('ลบสำเร็จ');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handlePrintPDF = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/packing/${id}/pdf`, {
        method: 'POST',
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `packing-${id}.pdf`;
      link.click();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการพิมพ์ PDF');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">ประวัติการแพ็คทุเรียน</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>กล่องใหญ่</th>
              <th>กล่องเล็ก</th>
              <th>ราคารวมก่อนหัก</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {packings.map(packing => (
              <tr key={packing.id}>
                <td>{packing.date}</td>
                <td>{packing.bigBoxQuantity} กล่อง</td>
                <td>{packing.smallBoxQuantity} กล่อง</td>
                <td>
                  {packing.totalBeforeDeduction?.toLocaleString('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                    minimumFractionDigits: 2,
                  }) ?? '-'}
                </td>
                <td className="flex gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handlePrintPDF(packing.id)}
                  >
                    พิมพ์ PDF
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate(`/packing?id=${packing.id}`)}
                  >
                    ดู/แก้ไข
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(packing.id)}
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
