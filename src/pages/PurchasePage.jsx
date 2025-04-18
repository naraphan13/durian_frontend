// 📁 src/pages/PurchasePage.jsx
import React, { useState } from 'react';

function PurchasePage() {
  const [seller, setSeller] = useState('');
  const [items, setItems] = useState([
    {
      variety: 'หมอนทอง',
      grade: 'A',
      useBasket: true,
      weights: [''],
      weight: '',
      pricePerKg: ''
    }
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleWeightChange = (itemIndex, weightIndex, value) => {
    const updated = [...items];
    updated[itemIndex].weights[weightIndex] = value;
    setItems(updated);
  };

  const addBasket = (index) => {
    const updated = [...items];
    updated[index].weights.push('');
    setItems(updated);
  };

  const removeBasket = (itemIndex, weightIndex) => {
    const updated = [...items];
    updated[itemIndex].weights.splice(weightIndex, 1);
    setItems(updated);
  };

  const getTotalWeight = (item) =>
    item.useBasket
      ? item.weights.reduce((sum, w) => sum + parseFloat(w || 0), 0)
      : parseFloat(item.weight || 0);

  const addItem = () => {
    setItems([
      ...items,
      {
        variety: 'หมอนทอง',
        grade: 'A',
        useBasket: true,
        weights: [''],
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

    const payloadItems = items.map((item) => ({
      variety: item.variety,
      grade: item.grade,
      weights: item.useBasket ? item.weights.map((w) => parseFloat(w)) : [],
      weight: getTotalWeight(item),
      pricePerKg: parseFloat(item.pricePerKg)
    }));

    try {
      const res = await fetch('http://localhost:8899/v1/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller, items: payloadItems }),
      });
      if (!res.ok) throw new Error('Error saving bill');
      alert('บันทึกบิลสำเร็จ');
      setSeller('');
      setItems([
        {
          variety: 'หมอนทอง',
          grade: 'A',
          useBasket: true,
          weights: [''],
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
      <h2 className="text-xl font-bold mb-4 text-center">คิดบิลหน้าแผง (เข่ง/รวม)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
                <option value="หมอนทอง">หมอนทอง</option>
                <option value="ชะนี">ชะนี</option>
                <option value="กระดุม">กระดุม</option>
                <option value="พวงมณี">พวงมณี</option>
              </select>
              <select
                className="select select-bordered w-full sm:w-32"
                value={item.grade}
                onChange={(e) => handleItemChange(i, 'grade', e.target.value)}
              >
                <option>AB</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>สวย</option>
                <option>เล็ก</option>
                <option>ตำหนิ</option>
                <option>จัมโบ้</option>
                <option>เข้</option>
                <option>กวน</option>
                <option>จิ๋ว</option>
                <option>ใหญ่</option>
                <option>กลาง</option>
              </select>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={item.useBasket}
                onChange={() => handleItemChange(i, 'useBasket', !item.useBasket)}
              />
              <span>กรอกน้ำหนักแบบแยกเข่ง</span>
            </label>

            {item.useBasket ? (
              <div className="space-y-2">
                <label className="block font-medium">น้ำหนักต่อเข่ง:</label>
                {item.weights.map((w, wi) => (
                  <div key={wi} className="flex gap-2">
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder={`เข่งที่ ${wi + 1}`}
                      value={w}
                      onChange={(e) => handleWeightChange(i, wi, e.target.value)}
                    />
                    {item.weights.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-error"
                        onClick={() => removeBasket(i, wi)}
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => addBasket(i)}
                >
                  + เพิ่มเข่ง
                </button>
              </div>
            ) : (
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="น้ำหนักรวม (กิโลกรัม)"
                value={item.weight}
                onChange={(e) => handleItemChange(i, 'weight', e.target.value)}
              />
            )}

            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="ราคาต่อกิโล (บาท)"
                value={item.pricePerKg}
                onChange={(e) => handleItemChange(i, 'pricePerKg', e.target.value)}
              />
            </div>

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