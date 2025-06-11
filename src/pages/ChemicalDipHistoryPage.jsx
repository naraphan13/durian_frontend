import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function ChemicalDipHistoryPage() {
  const [dips, setDips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/chemicaldip`)
      .then(res => res.json())
      .then(data => setDips(data))
      .catch(err => console.error('Error loading chemical dips:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/v1/chemicaldip/${id}`, {
        method: 'DELETE',
      });
      setDips(dips.filter(d => d.id !== id));
      alert('ลบสำเร็จ');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handlePrintPDF = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/chemicaldip/${id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chemical-dip-${id}.pdf`;
      link.click();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการพิมพ์ PDF');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">ประวัติการชุบน้ำยาทุเรียน</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>น้ำหนัก (ตัน)</th>
              <th>ราคาต่อตัน</th>
              <th>รวมเงิน</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {dips.map(dip => {
              const total = dip.weight * dip.pricePerKg;
              return (
                <tr key={dip.id}>
                  <td>{dip.date}</td>
                  <td>{dip.weight}</td>
                  <td>{dip.pricePerKg.toLocaleString()} บาท</td>
                  <td>{total.toLocaleString()} บาท</td>
                  <td className="flex gap-2 flex-wrap">
                    <button className="btn btn-sm btn-info" onClick={() => handlePrintPDF(dip.id)}>พิมพ์ PDF</button>
                    <button className="btn btn-sm btn-outline" onClick={() => navigate(`/chemicaldip?id=${dip.id}`)}>ดู/แก้ไข</button>
                    <button className="btn btn-sm btn-error" onClick={() => handleDelete(dip.id)}>ลบ</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
