import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

export default function PackingCostPage() {
  const [form, setForm] = useState({
    date: '',
    recipient: '',
    bigBox: { quantity: 0, pricePerBox: 0 },
    smallBox: { quantity: 0, pricePerBox: 0 },
    deductions: [{ label: '', amount: 0 }],
  });

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/v1/packing/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            date: data.date,
            recipient: data.recipient || '',
            bigBox: { quantity: data.bigBoxQuantity, pricePerBox: data.bigBoxPrice },
            smallBox: { quantity: data.smallBoxQuantity, pricePerBox: data.smallBoxPrice },
            deductions: data.deductions || [{ label: '', amount: 0 }],
          });
        })
        .catch(err => console.error('Error loading packing:', err));
    }
  }, [id]);

  const handleChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: parseFloat(value),
      },
    }));
  };

  const handleField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDate = (value) => {
    setForm(prev => ({ ...prev, date: value }));
  };

  const handleDeductionChange = (index, field, value) => {
    const updated = [...form.deductions];
    updated[index][field] = field === 'amount' ? parseFloat(value) : value;
    setForm(prev => ({ ...prev, deductions: updated }));
  };

  const addDeduction = () => {
    setForm(prev => ({ ...prev, deductions: [...prev.deductions, { label: '', amount: 0 }] }));
  };

  const removeDeduction = (index) => {
    const updated = form.deductions.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, deductions: updated }));
  };

  const handleSave = async () => {
    const payload = {
      date: form.date,
      recipient: form.recipient,
      bigBoxQuantity: form.bigBox.quantity,
      bigBoxPrice: form.bigBox.pricePerBox,
      smallBoxQuantity: form.smallBox.quantity,
      smallBoxPrice: form.smallBox.pricePerBox,
      deductions: form.deductions,
    };

    try {
      if (id) {
        await fetch(`${import.meta.env.VITE_API_URL}/v1/packing/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        alert('แก้ไขข้อมูลสำเร็จ');
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/v1/packing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        alert('บันทึกข้อมูลสำเร็จ');
      }
      navigate('/packing-history');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const totalBig = form.bigBox.quantity * form.bigBox.pricePerBox;
  const totalSmall = form.smallBox.quantity * form.smallBox.pricePerBox;
  const total = totalBig + totalSmall;
  const totalDeduction = form.deductions.reduce((sum, d) => sum + d.amount, 0);
  const remaining = total - totalDeduction;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{id ? 'แก้ไขข้อมูลแพ็ค' : 'เพิ่มข้อมูลแพ็ค'}</h1>
        <button className="btn btn-outline" onClick={() => navigate('/packing-history')}>หน้าประวัติ</button>
      </div>

      <div>
        <label className="block mb-1 font-medium">วันที่</label>
        <input type="date" className="input input-bordered w-full" value={form.date} onChange={e => handleDate(e.target.value)} />
      </div>

      <div>
        <label className="block mb-1 font-medium">จ่ายให้ (ชื่อผู้รับเงิน)</label>
        <input type="text" className="input input-bordered w-full" value={form.recipient} onChange={e => handleField('recipient', e.target.value)} />
      </div>

      <div>
        <h2 className="font-semibold mt-4">กล่องใหญ่</h2>
        <input type="number" placeholder="จำนวนกล่องใหญ่" className="input input-bordered w-full mb-2" value={form.bigBox.quantity} onChange={e => handleChange('bigBox', 'quantity', e.target.value)} />
        <input type="number" placeholder="ราคาต่อกล่องใหญ่" className="input input-bordered w-full" value={form.bigBox.pricePerBox} onChange={e => handleChange('bigBox', 'pricePerBox', e.target.value)} />
      </div>

      <div>
        <h2 className="font-semibold mt-4">กล่องเล็ก</h2>
        <input type="number" placeholder="จำนวนกล่องเล็ก" className="input input-bordered w-full mb-2" value={form.smallBox.quantity} onChange={e => handleChange('smallBox', 'quantity', e.target.value)} />
        <input type="number" placeholder="ราคาต่อกล่องเล็ก" className="input input-bordered w-full" value={form.smallBox.pricePerBox} onChange={e => handleChange('smallBox', 'pricePerBox', e.target.value)} />
      </div>

      <div>
        <h2 className="font-semibold mt-4">รายการหักค่าของ / หักเบิก</h2>
        {form.deductions.map((d, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input type="text" placeholder="ชื่อรายการ" className="input input-bordered w-full" value={d.label} onChange={e => handleDeductionChange(i, 'label', e.target.value)} />
            <input type="number" placeholder="จำนวนเงิน" className="input input-bordered w-32" value={d.amount} onChange={e => handleDeductionChange(i, 'amount', e.target.value)} />
            {form.deductions.length > 1 && (
              <button className="btn btn-sm btn-error" onClick={() => removeDeduction(i)}>ลบ</button>
            )}
          </div>
        ))}
        <button className="btn btn-sm btn-outline" onClick={addDeduction}>+ เพิ่มรายการหักเบิก</button>
      </div>

      <div className="mt-4">
        <p><strong>รวม:</strong> {total.toLocaleString()} บาท</p>
        <p><strong>หักรวม:</strong> {totalDeduction.toLocaleString()} บาท</p>
        <p><strong>คงเหลือ:</strong> {remaining.toLocaleString()} บาท</p>
      </div>

      <button className="btn btn-primary mt-4 w-full" onClick={handleSave}>
        {id ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูลแพ็ค'}
      </button>
    </div>
  );
}
