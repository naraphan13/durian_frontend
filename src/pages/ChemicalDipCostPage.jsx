import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

export default function ChemicalDipCostPage() {
  const [form, setForm] = useState({
    date: '',
    recipient: '',
    weight: 0,
    pricePerKg: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/v1/chemicaldip/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            date: data.date,
            recipient: data.recipient || '',
            weight: data.weight,
            pricePerKg: data.pricePerKg,
          });
        })
        .catch(err => console.error('Error loading chemical dip:', err));
    }
  }, [id]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  const handleDateChange = (value) => {
    setForm(prev => ({ ...prev, date: value }));
  };

  const handleTextChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const payload = { ...form };
    try {
      if (id) {
        await fetch(`${import.meta.env.VITE_API_URL}/v1/chemicaldip/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        alert('แก้ไขข้อมูลสำเร็จ');
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/v1/chemicaldip`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        alert('บันทึกข้อมูลสำเร็จ');
      }
      navigate('/chemicaldip-history');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const total = form.weight * form.pricePerKg;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{id ? 'แก้ไขข้อมูลชุบน้ำยา' : 'เพิ่มข้อมูลชุบน้ำยา'}</h1>
        <button className="btn btn-outline" onClick={() => navigate('/chemicaldip-history')}>กลับไปหน้าประวัติ</button>
      </div>

      <div>
        <label className="block mb-1 font-medium">วันที่</label>
        <input type="date" className="input input-bordered w-full" value={form.date} onChange={e => handleDateChange(e.target.value)} />
      </div>

      <div>
        <label className="block mb-1 font-medium">จ่ายให้ (ชื่อผู้รับเงิน)</label>
        <input type="text" className="input input-bordered w-full" value={form.recipient} onChange={e => handleTextChange('recipient', e.target.value)} />
      </div>

      <div>
        <label className="block mb-1 font-medium">น้ำหนัก (ตัน)</label>
        <input type="number" className="input input-bordered w-full" value={form.weight} onChange={e => handleChange('weight', e.target.value)} />
      </div>

      <div>
        <label className="block mb-1 font-medium">ราคาต่อตัน (บาท)</label>
        <input type="number" className="input input-bordered w-full" value={form.pricePerKg} onChange={e => handleChange('pricePerKg', e.target.value)} />
      </div>

      <div className="mt-4">
        <p><strong>รวมทั้งหมด:</strong> {total.toLocaleString()} บาท</p>
      </div>

      <button className="btn btn-primary w-full mt-4" onClick={handleSave}>
        {id ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
      </button>
    </div>
  );
}
