// 📁 src/pages/GradeDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function GradeDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/calculate/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.error("โหลดรายละเอียดล้มเหลว", err);
        alert("ไม่พบข้อมูล");
        navigate("/grade-history");
      });
  }, [id]);

  if (!data) return <div className="p-4">กำลังโหลด...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">รายละเอียดการคำนวณ</h1>
      <p>ชื่อสวน: {data.farmName}</p>
      <p>วันที่: {new Date(data.date).toLocaleDateString("th-TH")}</p>
      <p>น้ำหนักรวม: {data.totalWeight} กก.</p>
      <p>ราคาหลัก: {data.basePrice} บาท/กก.</p>
      <p>น้ำหนักที่เหลือ: {data.remainingWeight} กก.</p>
      <p>ราคาสุทธิ: {data.netAmount.toLocaleString()} บาท</p>
      <p>ราคาต่อกก.หลังหัก: {data.finalPrice.toFixed(2)} บาท/กก.</p>

      <h2 className="font-semibold mt-4">รายการเบอร์</h2>
      <div className="space-y-2">
        {data.grades.map((g, i) => (
          <div key={i} className="border rounded p-2">
            <p>เบอร์: {g.name}</p>
            <p>น้ำหนัก: {g.weight} กก.</p>
            <p>ราคา: {g.price} บาท/กก.</p>
          </div>
        ))}
      </div>

      <button className="btn btn-secondary mt-4" onClick={() => navigate("/grade-history")}>
        🔙 กลับหน้ารายการ
      </button>
    </div>
  );
}
