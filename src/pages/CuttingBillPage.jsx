// 📁 src/pages/CuttingBillPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function CuttingBillPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cutterName: "",
    date: new Date().toISOString().substring(0, 10),
    mainItems: [{ label: "", weight: "", price: "" }],
    deductItems: [],
    extraDeductions: [],
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // เพิ่ม/แก้/ลบ mainItems
  const addMainItem = () => {
    setForm((prev) => ({
      ...prev,
      mainItems: [...prev.mainItems, { label: "", weight: "", price: "" }],
    }));
  };

  const updateMainItem = (index, field, value) => {
    const updated = [...form.mainItems];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, mainItems: updated }));
  };

  const removeMainItem = (index) => {
    const updated = form.mainItems.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, mainItems: updated }));
  };

  // หักรายการปกติ
  const addDeductItem = () => {
    setForm((prev) => ({
      ...prev,
      deductItems: [
        ...prev.deductItems,
        { label: "", qty: "", unitPrice: "", actualAmount: "" },
      ],
    }));
  };

  const updateDeductItem = (index, field, value) => {
    const updated = [...form.deductItems];
    updated[index][field] = value;
    setForm({ ...form, deductItems: updated });
  };

  const removeDeductItem = (index) => {
    const updated = form.deductItems.filter((_, i) => i !== index);
    setForm({ ...form, deductItems: updated });
  };

  // หักเพิ่มเติม
  const addExtraDeduction = () => {
    setForm((prev) => ({
      ...prev,
      extraDeductions: [...prev.extraDeductions, { label: "", amount: "" }],
    }));
  };

  const updateExtraDeduction = (index, field, value) => {
    const updated = [...form.extraDeductions];
    updated[index][field] = value;
    setForm({ ...form, extraDeductions: updated });
  };

  const removeExtraDeduction = (index) => {
    const updated = form.extraDeductions.filter((_, i) => i !== index);
    setForm({ ...form, extraDeductions: updated });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        cutterName: form.cutterName,
        date: form.date,
        mainItems: form.mainItems.map((item) => ({
          label: item.label || null,
          weight: item.weight !== "" ? parseFloat(item.weight) : null,
          price: parseFloat(item.price),
        })),
        deductItems: form.deductItems.map((item) => ({
          label: item.label,
          qty: parseFloat(item.qty),
          unitPrice: parseFloat(item.unitPrice),
          actualAmount:
            item.actualAmount !== "" ? parseFloat(item.actualAmount) : null,
        })),
        extraDeductions: form.extraDeductions.map((item) => ({
          label: item.label,
          amount: parseFloat(item.amount),
        })),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/v1/cuttingbills`, payload);
      navigate("/cuttingbill/history");
    } catch (err) {
      console.error("บันทึกไม่สำเร็จ:", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  // สรุปยอดรวม
  const mainTotal = form.mainItems.reduce((sum, item) => {
    const w = parseFloat(item.weight);
    const p = parseFloat(item.price);
    return sum + (isNaN(w) ? (isNaN(p) ? 0 : p) : w * p);
  }, 0);

  const deductTotal = form.deductItems.reduce((sum, item) => {
    const amt =
      item.actualAmount !== ""
        ? parseFloat(item.actualAmount)
        : parseFloat(item.qty) * parseFloat(item.unitPrice);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  const extraTotal = form.extraDeductions.reduce((sum, item) => {
    const amt = parseFloat(item.amount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  const netTotal = mainTotal - deductTotal - extraTotal;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        className="btn btn-outline btn-sm"
        onClick={() => navigate("/cuttingbill/history")}
      >
        ดูประวัติสายตัด
      </button>
      <h1 className="text-2xl font-bold mb-4 text-center">สร้างบิลค่าตัดทุเรียน</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="ชื่อสายตัด"
          className="input input-bordered w-full"
          value={form.cutterName}
          onChange={(e) => handleChange("cutterName", e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered w-full"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>

      {/* mainItems */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">รายการน้ำหนัก × ราคา (หรือใส่แค่ราคา)</h2>
          <button onClick={addMainItem} className="btn btn-sm btn-outline">
            + เพิ่มรายการ
          </button>
        </div>
        {form.mainItems.map((item, i) => (
          <div key={i} className="grid grid-cols-6 gap-2 mt-2">
            <input
              className="input input-sm input-bordered"
              placeholder="ชื่อรายการ (ถ้ามี)"
              value={item.label}
              onChange={(e) => updateMainItem(i, "label", e.target.value)}
            />
            <input
              type="number"
              className="input input-sm input-bordered"
              placeholder="น้ำหนัก (กก.)"
              value={item.weight}
              onChange={(e) => updateMainItem(i, "weight", e.target.value)}
            />
            <input
              type="number"
              className="input input-sm input-bordered"
              placeholder="ราคา (รวม หรือ ต่อกก.)"
              value={item.price}
              onChange={(e) => updateMainItem(i, "price", e.target.value)}
            />
            <div className="flex items-center col-span-2">
              รวม:{" "}
              <span className="ml-1 font-bold">
                {(item.weight
                  ? item.weight * item.price
                  : parseFloat(item.price || 0)
                ).toLocaleString()}{" "}
                บาท
              </span>
            </div>
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => removeMainItem(i)}
            >
              ลบ
            </button>
          </div>
        ))}
      </div>

      {/* รายการหัก */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">รายการหัก</h2>
          <button onClick={addDeductItem} className="btn btn-sm btn-outline">
            + เพิ่มรายการ
          </button>
        </div>
        {form.deductItems.map((item, i) => (
          <div key={i} className="grid grid-cols-6 gap-2 mt-2">
            <input
              className="input input-sm input-bordered col-span-2"
              placeholder="รายการ"
              value={item.label}
              onChange={(e) => updateDeductItem(i, "label", e.target.value)}
            />
            <input
              type="number"
              className="input input-sm input-bordered"
              placeholder="จำนวน"
              value={item.qty}
              onChange={(e) => updateDeductItem(i, "qty", e.target.value)}
            />
            <input
              type="number"
              className="input input-sm input-bordered"
              placeholder="ราคาต่อหน่วย"
              value={item.unitPrice}
              onChange={(e) => updateDeductItem(i, "unitPrice", e.target.value)}
            />
            <input
              type="number"
              className="input input-sm input-bordered"
              placeholder="จำนวนเงินหักจริง (ถ้ามี)"
              value={item.actualAmount}
              onChange={(e) => updateDeductItem(i, "actualAmount", e.target.value)}
            />
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => removeDeductItem(i)}
            >
              ลบ
            </button>
          </div>
        ))}
      </div>

      {/* หักเพิ่มเติม */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">รายการหักเพิ่มเติม</h2>
          <button onClick={addExtraDeduction} className="btn btn-sm btn-outline">
            + เพิ่มรายการ
          </button>
        </div>
        {form.extraDeductions.map((item, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 mt-2">
            <input
              className="input input-sm input-bordered col-span-3"
              placeholder="รายการ"
              value={item.label}
              onChange={(e) => updateExtraDeduction(i, "label", e.target.value)}
            />
            <input
              type="number"
              className="input input-sm input-bordered"
              placeholder="จำนวนเงิน"
              value={item.amount}
              onChange={(e) => updateExtraDeduction(i, "amount", e.target.value)}
            />
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => removeExtraDeduction(i)}
            >
              ลบ
            </button>
          </div>
        ))}
      </div>

      {/* สรุปยอด */}
      <div className="mt-6 text-right space-y-1">
        <div>รวมค่าตัด: <b>{mainTotal.toLocaleString()} บาท</b></div>
        <div>รวมรายการหัก: <b>{deductTotal.toLocaleString()} บาท</b></div>
        <div>หักเพิ่มเติม: <b>{extraTotal.toLocaleString()} บาท</b></div>
        <div className="text-green-600 text-xl">จ่ายสุทธิ: <b>{netTotal.toLocaleString()} บาท</b></div>
      </div>

      {/* บันทึก */}
      <div className="mt-8 flex justify-center">
        <button className="btn btn-primary" onClick={handleSubmit}>
          บันทึกบิล
        </button>
      </div>
    </div>
  );
}
