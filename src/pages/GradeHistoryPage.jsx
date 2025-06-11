import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function GradeHistoryPage() {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/calculate`)
      .then((res) => res.json())
      .then((data) => setHistories(data))
      .catch((err) => console.error("โหลดข้อมูลล้มเหลว:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/v1/calculate/${id}`, {
        method: "DELETE",
      });
      setHistories(histories.filter((item) => item.id !== id));
    } catch (err) {
      console.error("ลบไม่สำเร็จ:", err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleEdit = (id) => {
    navigate(`/grade-history/${id}/edit`);
  };

  const handleView = (id) => {
    navigate(`/grade-history/${id}`);
  };

  if (loading) return <div className="p-4">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ประวัติการคำนวณราคาเบอร์</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อสวน</th>
              <th>วันที่</th>
              <th>น้ำหนักรวม</th>
              <th>ราคาหลัก</th>
              <th>ราคาหลังหัก</th>
              <th>รายละเอียด</th>
              <th>แก้ไข</th>
              <th>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.farmName}</td>
                <td>{new Date(item.date).toLocaleDateString("th-TH")}</td>
                <td>{item.totalWeight} กก.</td>
                <td>{item.basePrice} บาท</td>
                <td>{item.finalPrice?.toFixed(2)} บาท/กก.</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleView(item.id)}
                  >
                    ดู
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
            {histories.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
