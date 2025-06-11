// 📁 src/pages/GradeEditPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function GradeEditPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/calculate/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => {
        console.error("โหลดข้อมูลล้มเหลว", err);
        alert("ไม่พบข้อมูล");
        navigate("/grade-history");
      });
  }, [id]);

  const handleChange = (e, index, field) => {
    if (["name", "weight", "price"].includes(field)) {
      const newGrades = [...form.grades];
      newGrades[index][field] = e.target.value;
      setForm((prev) => ({ ...prev, grades: newGrades }));
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/calculate/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        alert("อัปเดตเรียบร้อย");
        navigate("/grade-history");
      } else {
        alert("ไม่สามารถอัปเดตได้");
      }
    } catch (err) {
      console.error("อัปเดตล้มเหลว", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  if (!form) return <div className="p-4">กำลังโหลด...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">แก้ไขการคำนวณราคา</h1>

      <input
        type="text"
        name="farmName"
        placeholder="ชื่อสวน"
        className="input input-bordered w-full"
        value={form.farmName}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        className="input input-bordered w-full"
        value={form.date?.slice(0, 10)}
        onChange={handleChange}
      />
      <input
        type="number"
        name="totalWeight"
        placeholder="น้ำหนักรวม"
        className="input input-bordered w-full"
        value={form.totalWeight}
        onChange={handleChange}
      />
      <input
        type="number"
        name="basePrice"
        placeholder="ราคาหลัก"
        className="input input-bordered w-full"
        value={form.basePrice}
        onChange={handleChange}
      />

      <h2 className="font-semibold">เบอร์</h2>
      {form.grades.map((grade, i) => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <input
            className="input input-bordered"
            placeholder="เบอร์"
            value={grade.name}
            onChange={(e) => handleChange(e, i, "name")}
          />
          <input
            className="input input-bordered"
            placeholder="น้ำหนัก"
            type="number"
            value={grade.weight}
            onChange={(e) => handleChange(e, i, "weight")}
          />
          <input
            className="input input-bordered"
            placeholder="ราคา"
            type="number"
            value={grade.price}
            onChange={(e) => handleChange(e, i, "price")}
          />
        </div>
      ))}

      <div className="flex gap-2">
        <button className="btn btn-primary w-full" onClick={handleSave}>
          💾 บันทึกการแก้ไข
        </button>
        <button className="btn btn-secondary w-full" onClick={() => navigate("/grade-history")}>
          🔙 กลับ
        </button>
      </div>
    </div>
  );
}
