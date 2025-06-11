import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function ContainerLoadingHistoryPage() {
  const [loads, setLoads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/containerloading`)
      .then(res => res.json())
      .then(data => setLoads(data))
      .catch(err => console.error('Error loading container loadings:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/v1/containerloading/${id}`, {
        method: 'DELETE',
      });
      setLoads(loads.filter(l => l.id !== id));
      alert('ลบสำเร็จ');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handlePrintPDF = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/containerloading/${id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `container-loading-${id}.pdf`;
      link.click();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการพิมพ์ PDF');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">ประวัติค่าขึ้นตู้ทุเรียน</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>จำนวนตู้</th>
              <th>ยอดรวม</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loads.map(load => {
              const total = (load.containers || []).reduce((sum, c) => sum + c.price, 0);
              return (
                <React.Fragment key={load.id}>
                  <tr className="bg-base-100">
                    <td>{load.date}</td>
                    <td>{load.containers.length} ตู้</td>
                    <td>{total.toLocaleString()} บาท</td>
                    <td className="flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-info" onClick={() => handlePrintPDF(load.id)}>พิมพ์ PDF</button>
                      <button className="btn btn-sm btn-outline" onClick={() => navigate(`/containerloading?id=${load.id}`)}>ดู/แก้ไข</button>
                      <button className="btn btn-sm btn-error" onClick={() => handleDelete(load.id)}>ลบ</button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="bg-base-200">
                      <div className="overflow-x-auto">
                        <table className="table table-sm w-full mt-2 border">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>ลำดับตู้</th>
                              <th>เลขตู้</th>
                              <th>ราคาค่าขึ้น</th>
                            </tr>
                          </thead>
                          <tbody>
                            {load.containers.map((c, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{c.label || '-'}</td>
                                <td>{c.containerCode || '-'}</td>
                                <td>{(c.price || 0).toLocaleString()} บาท</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
