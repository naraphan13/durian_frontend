import React, { useState } from 'react';

function PurchasePage() {
  const [seller, setSeller] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  });

  const [items, setItems] = useState([
    {
      variety: '',
      grade: '',
      weight: '',
      pricePerKg: ''
    }
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const getTotalWeight = (item) => parseFloat(item.weight || 0);

  const addItem = () => {
    setItems([
      ...items,
      {
        variety: '',
        grade: '',
        weight: '',
        pricePerKg: ''
      }
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const localDate = new Date(date);
    const utcDate = new Date(localDate.getTime());

    const payloadItems = items.map((item) => ({
      variety: item.variety,
      grade: item.grade,
      weight: getTotalWeight(item),
      pricePerKg: parseFloat(item.pricePerKg)
    }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller, date: utcDate.toISOString(), items: payloadItems }),
      });
      if (!res.ok) throw new Error('Error saving bill');
      alert('บันทึกบิลสำเร็จ');
      setSeller('');
      const resetNow = new Date();
      resetNow.setMinutes(resetNow.getMinutes() - resetNow.getTimezoneOffset());
      setDate(resetNow.toISOString().slice(0, 16));
      setItems([
        {
          variety: '',
          grade: '',
          weight: '',
          pricePerKg: ''
        }
      ]);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">คิดบิลหน้าแผง (น้ำหนักรวม)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="ชื่อผู้ขาย"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
          required
        />

        {items.map((item, i) => (
          <div key={i} className="border rounded p-3 bg-gray-50 relative space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                className="select select-bordered w-full"
                value={item.variety}
                onChange={(e) => handleItemChange(i, 'variety', e.target.value)}
              >
                <option value="">-- เลือกพันธุ์ --</option>
                <option value="หมอนทอง">หมอนทอง</option>
                <option value="ก้านยาว">ก้านยาว</option>
                <option value="ชะนี">ชะนี</option>
                <option value="กระดุม">กระดุม</option>
                <option value="พวงมณี">พวงมณี</option>
              </select>

              <select
                className="select select-bordered w-full sm:w-32"
                value={item.grade}
                onChange={(e) => handleItemChange(i, 'grade', e.target.value)}
              >
                <option value="">-- เลือกเกรด --</option>
                <option value="AB">AB</option>
                <option value="ABC">ABC</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="สวย">สวย</option>
                <option value="เล็ก">เล็ก</option>
                <option value="ตำหนิ">ตำหนิ</option>
                <option value="จัมโบ้">จัมโบ้</option>
                <option value="เข้">เข้</option>
                <option value="กวน">กวน</option>
                <option value="จิ๋ว">จิ๋ว</option>
                <option value="ใหญ่">ใหญ่</option>
                <option value="กลาง">กลาง</option>
                <option value="สุก">สุก</option>
                <option value="ตกไซส์">ตกไซส์</option>
                <option value="ตึง">ตึง</option>
              </select>
            </div>

            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="น้ำหนักรวม (กิโลกรัม)"
              value={item.weight}
              onChange={(e) => handleItemChange(i, 'weight', e.target.value)}
              required
            />

            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="ราคาต่อกิโล (บาท)"
              value={item.pricePerKg}
              onChange={(e) => handleItemChange(i, 'pricePerKg', e.target.value)}
              required
            />

            <p className="text-right text-sm text-gray-500">
              น้ำหนักรวม: {getTotalWeight(item).toLocaleString()} กก.
            </p>

            {items.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-error absolute top-2 right-2"
                onClick={() => removeItem(i)}
              >
                ลบรายการ
              </button>
            )}
          </div>
        ))}

        <button type="button" className="btn btn-outline w-full" onClick={addItem}>
          + เพิ่มรายการใหม่
        </button>

        <button type="submit" className="btn btn-primary w-full">บันทึก</button>
      </form>
    </div>
  );
}

export default PurchasePage;
