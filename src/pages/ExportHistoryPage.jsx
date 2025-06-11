import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function ExportHistoryPage() {
  const [exports, setExports] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/export`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExports(data);

          const total = data.reduce((sum, item) => {
            const durianTotal = item.durianItems?.reduce((dSum, d) => {
              return dSum + (d.boxes * d.weightPerBox * d.pricePerKg);
            }, 0) || 0;

            const handlingCost = Object.values(item.handlingCosts || {}).reduce((sumH, h) => {
              return sumH + ((h.weight || 0) * (h.costPerKg || 0));
            }, 0);

            const boxCost = Object.values(item.boxCosts || {}).reduce((sumB, b) => {
              return sumB + ((b.quantity || 0) * (b.unitCost || 0));
            }, 0);

            const freightCost = item.freightItems?.reduce((sumF, f) => {
              return sumF + (f.weight * f.pricePerKg);
            }, 0) || 0;

            return sum + durianTotal + handlingCost + boxCost + freightCost + (item.inspectionFee || 0);
          }, 0);

          setTotalCost(total);
        } else {
          console.error('คาดว่าจะได้ array แต่ได้:', data);
          setExports([]);
        }
      })
      .catch(err => console.error('Error fetching exports:', err))
      .finally(() => setLoading(false));
  }, []);

  const calculateExportTotal = (item) => {
    const durianTotal = item.durianItems?.reduce((dSum, d) => {
      return dSum + (d.boxes * d.weightPerBox * d.pricePerKg);
    }, 0) || 0;

    const handlingCost = Object.values(item.handlingCosts || {}).reduce((sumH, h) => {
      return sumH + ((h.weight || 0) * (h.costPerKg || 0));
    }, 0);

    const boxCost = Object.values(item.boxCosts || {}).reduce((sumB, b) => {
      return sumB + ((b.quantity || 0) * (b.unitCost || 0));
    }, 0);

    const freightCost = item.freightItems?.reduce((sumF, f) => {
      return sumF + (f.weight * f.pricePerKg);
    }, 0) || 0;

    return durianTotal + handlingCost + boxCost + freightCost + (item.inspectionFee || 0);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('คุณแน่ใจหรือว่าต้องการลบเอกสารนี้?');
    if (!confirm) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/v1/export/${id}`, {
        method: 'DELETE',
      });
      setExports(exports.filter(item => item.id !== id));
      alert('ลบสำเร็จ');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handlePrintPDF = async (item) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/export/exportpdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export-${item.date}.pdf`;
      link.click();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการพิมพ์ PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-green-700 font-semibold text-lg">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ประวัติการส่งออกตู้ทุเรียน</h1>

      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ตู้</th>
              <th>รหัสตู้</th>
              <th>เมือง</th>
              <th>ยอดรวม</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {exports.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.containerInfo}</td>
                <td>{item.containerCode}</td>
                <td>{item.city}</td>
                <td>{calculateExportTotal(item).toLocaleString()} บาท</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-outline" onClick={() => navigate(`/export?id=${item.id}`)}>ดู/แก้ไข</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(item.id)}>ลบ</button>
                  <button className="btn btn-sm btn-primary" onClick={() => handlePrintPDF(item)}>📄 PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {exports.map(item => (
          <div key={item.id} className="p-4 border rounded-lg shadow">
            <div><strong>📅 วันที่:</strong> {item.date}</div>
            <div><strong>🚛 ตู้:</strong> {item.containerInfo}</div>
            <div><strong>📦 รหัสตู้:</strong> {item.containerCode}</div>
            <div><strong>📝 เมือง:</strong> {item.city}</div>
            <div><strong>💰 ยอดรวม:</strong> {calculateExportTotal(item).toLocaleString()} บาท</div>
            <div className="mt-2 flex gap-2">
              <button className="btn btn-sm btn-outline w-full" onClick={() => navigate(`/export?id=${item.id}`)}>ดู/แก้ไข</button>
              <button className="btn btn-sm btn-error w-full" onClick={() => handleDelete(item.id)}>ลบ</button>
              <button className="btn btn-sm btn-primary w-full" onClick={() => handlePrintPDF(item)}>📄 PDF</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right font-bold text-lg space-y-1">
        <div>รวมทั้งหมด: {exports.length} ตู้</div>
        <div>รวมยอดทั้งหมด: {totalCost.toLocaleString()} บาท</div>
      </div>
    </div>
  );
}
