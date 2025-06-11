import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function PayrollPage() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    payType: "รายวัน",
    workDays: "",
    pricePerDay: "",
    monthlySalary: "",
    months: "1",
    bonus: "", // ✅ เพิ่มช่องพิเศษ
    deductions: [{ name: "", amount: "" }],
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/v1/payroll/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            name: data.employeeName,
            date: data.date.slice(0, 10),
            payType: data.payType,
            workDays: data.workDays?.toString() ?? "",
            pricePerDay: data.pricePerDay?.toString() ?? "",
            monthlySalary: data.monthlySalary?.toString() ?? "",
            months: data.months?.toString() ?? "1",
            bonus: data.bonus?.toString() ?? "", // ✅ รับข้อมูลพิเศษ
            deductions: data.deductions?.map(d => ({
              name: d.name,
              amount: d.amount.toString()
            })) ?? [],
          });
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDeductionChange = (index, field, value) => {
    const newDeductions = [...form.deductions];
    newDeductions[index][field] = value;
    setForm({ ...form, deductions: newDeductions });
  };

  const addDeduction = () => {
    setForm({ ...form, deductions: [...form.deductions, { name: "", amount: "" }] });
  };

  const calculateTotal = () => {
    let gross = 0;
    if (form.payType === "รายวัน" || form.payType === "รายตู้") {
      gross = parseFloat(form.workDays || 0) * parseFloat(form.pricePerDay || 0);
    } else if (form.payType === "รายเดือน") {
      gross = parseFloat(form.monthlySalary || 0) * parseFloat(form.months || 0);
    }
    gross += parseFloat(form.bonus || 0); // ✅ รวมพิเศษ
    const totalDeductions = form.deductions.reduce(
      (sum, d) => sum + (parseFloat(d.amount) || 0),
      0
    );
    const net = gross - totalDeductions;
    return { gross, totalDeductions, net };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const methodType = id ? "PUT" : "POST";
    const url = id
      ? `${import.meta.env.VITE_API_URL}/v1/payroll/${id}`
      : `${import.meta.env.VITE_API_URL}/v1/payroll`;

    const payload = {
      name: form.name,
      date: form.date,
      payType: form.payType,
      workDays: parseFloat(form.workDays) || 0,
      pricePerDay: parseFloat(form.pricePerDay) || 0,
      monthlySalary: parseFloat(form.monthlySalary) || 0,
      months: parseFloat(form.months) || 0,
      bonus: parseFloat(form.bonus) || 0, // ✅ ส่งพิเศษไป backend
      deductions: form.deductions.map((d) => ({
        name: d.name,
        amount: parseFloat(d.amount) || 0,
      })),
    };

    try {
      const res = await fetch(url, {
        method: methodType,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success && result.id) {
        alert("บันทึกข้อมูลสำเร็จ!");
        window.open(`${import.meta.env.VITE_API_URL}/v1/payroll/${result.id}/pdf`, "_blank");
        navigate("/payroll-history");
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      console.error("สร้าง/แก้ไข PDF ไม่สำเร็จ", err);
      alert("ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  const { gross, totalDeductions, net } = calculateTotal();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {id ? "แก้ไขข้อมูลเงินเดือน" : "สร้างใบจ่ายเงินเดือน"}
      </h1>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="ชื่อพนักงาน"
        className="input input-bordered w-full"
      />

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="input input-bordered w-full"
      />

      <select
        name="payType"
        value={form.payType}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="รายวัน">รายวัน</option>
        <option value="รายเดือน">รายเดือน</option>
        <option value="รายตู้">รายตู้</option>
      </select>

      {(form.payType === "รายวัน" || form.payType === "รายตู้") && (
        <>
          <input
            name="workDays"
            type="number"
            step="any"
            placeholder={form.payType === "รายตู้" ? "จำนวนตู้ที่ทำ" : "จำนวนวันทำงาน"}
            value={form.workDays}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            name="pricePerDay"
            type="number"
            step="any"
            placeholder={form.payType === "รายตู้" ? "ค่าจ้างต่อตู้" : "ค่าจ้างต่อวัน"}
            value={form.pricePerDay}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </>
      )}

      {form.payType === "รายเดือน" && (
        <>
          <input
            name="monthlySalary"
            type="number"
            step="any"
            placeholder="เงินเดือนต่อเดือน"
            value={form.monthlySalary}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            name="months"
            type="number"
            step="any"
            placeholder="จำนวนเดือนที่จ่าย"
            value={form.months}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </>
      )}

      <input
        name="bonus"
        type="number"
        step="any"
        placeholder="พิเศษ (เช่น โบนัส)"
        value={form.bonus}
        onChange={handleChange}
        className="input input-bordered w-full"
      />

      <div className="mt-4">
        <h2 className="font-semibold">รายการหัก</h2>
        {form.deductions.map((item, i) => (
          <div key={i} className="flex space-x-2 mb-2">
            <input
              className="input input-bordered w-1/2"
              placeholder="ชื่อรายการหัก"
              value={item.name}
              onChange={(e) => handleDeductionChange(i, "name", e.target.value)}
            />
            <input
              className="input input-bordered w-1/2"
              placeholder="จำนวนเงิน"
              type="number"
              step="any"
              value={item.amount}
              onChange={(e) => handleDeductionChange(i, "amount", e.target.value)}
            />
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addDeduction}>
          + เพิ่มรายการหัก
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg space-y-1">
        <p><strong>ยอดรวมก่อนหัก:</strong> {gross.toLocaleString()} บาท</p>
        <p><strong>ยอดรวมรายการหัก:</strong> {totalDeductions.toLocaleString()} บาท</p>
        <p><strong>ยอดสุทธิ:</strong> {net.toLocaleString()} บาท</p>
      </div>

      <div className="flex gap-4">
        <button onClick={handleSubmit} className="btn btn-primary">
          {id ? "อัปเดตและพิมพ์ PDF" : "สร้าง PDF"}
        </button>
        <button onClick={() => navigate("/payroll-history")} className="btn btn-secondary">
          ไปหน้าประวัติ
        </button>
      </div>
    </div>
  );
}
