import { useState } from "react";
import { useNavigate } from "react-router";

export default function GradeCalculatorPage() {
  const [form, setForm] = useState({
    farmName: "",
    date: "",
    totalWeight: "",
    basePrice: "",
    grades: [{ name: "B", weight: "", price: "" }],
  });

  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const addGrade = () => {
    setForm((prev) => ({
      ...prev,
      grades: [...prev.grades, { name: "", weight: "", price: "" }],
    }));
  };

  const handleChange = (e, index, field) => {
    if (["name", "weight", "price"].includes(field)) {
      const newGrades = [...form.grades];
      newGrades[index][field] = e.target.value;
      setForm((prev) => ({ ...prev, grades: newGrades }));
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const calculate = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data);
  };

  const saveResult = async () => {
    if (!result) {
      alert("กรุณาคำนวณก่อนบันทึก");
      return;
    }

    const payload = {
      ...form,
      netAmount: result.netAmount,
      finalPrice: result.finalPrice,
      remainingWeight: result.remainingWeight,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/calculate/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        alert("บันทึกเรียบร้อย");
        navigate("/grade-history");
      } else {
        alert("บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (

    <div className="p-4 max-w-xl mx-auto space-y-4">
      <button
              className="btn btn-secondary w-full"
              onClick={() => navigate("/grade-history")}
            >
              📜 ดูประวัติ
            </button>
      <h1 className="text-xl font-bold">คำนวณราคาหลังหักเบอร์</h1>

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
        value={form.date}
        onChange={handleChange}
      />

      <input
        type="number"
        name="totalWeight"
        placeholder="น้ำหนักรวม (กก.)"
        className="input input-bordered w-full"
        value={form.totalWeight}
        onChange={handleChange}
      />

      <input
        type="number"
        name="basePrice"
        placeholder="ราคาหลัก (บาท/กก.)"
        className="input input-bordered w-full"
        value={form.basePrice}
        onChange={handleChange}
      />

      <div className="space-y-2">
        {form.grades.map((grade, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="เบอร์ (เช่น C)"
              className="input input-bordered"
              value={grade.name}
              onChange={(e) => handleChange(e, idx, "name")}
            />
            <input
              type="number"
              placeholder="น้ำหนัก"
              className="input input-bordered"
              value={grade.weight}
              onChange={(e) => handleChange(e, idx, "weight")}
            />
            <input
              type="number"
              placeholder="ราคา/กก."
              className="input input-bordered"
              value={grade.price}
              onChange={(e) => handleChange(e, idx, "price")}
            />
          </div>
        ))}
        <button className="btn btn-sm btn-outline" onClick={addGrade}>
          + เพิ่มเบอร์
        </button>
      </div>

      <button className="btn btn-primary w-full" onClick={calculate}>
        คำนวณ
      </button>

      {result && (
        <div className="p-4 bg-base-200 rounded space-y-1">
          <p>ราคาสุทธิ: {result.netAmount.toLocaleString()} บาท</p>
          <p>น้ำหนักที่เหลือ: {result.remainingWeight} กก.</p>
          <p className="font-bold">
            ราคาต่อกก.หลังหัก: {result.finalPrice.toFixed(2)} บาท/กก.
          </p>

          <div className="flex gap-2 mt-2">
            <button className="btn btn-success w-full" onClick={saveResult}>
              💾 บันทึกผลลัพธ์
            </button>
            <button
              className="btn btn-secondary w-full"
              onClick={() => navigate("/grade-history")}
            >
              📜 ดูประวัติ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
