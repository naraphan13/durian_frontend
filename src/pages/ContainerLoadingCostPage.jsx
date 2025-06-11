import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

export default function ContainerLoadingCostPage() {
  const [form, setForm] = useState({
    date: '',
    recipient: '',
    containers: [{ label: 'ตู้ที่ ', containerCode: '', price: 0 }],
  });

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/v1/containerloading/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            date: data.date,
            recipient: data.recipient || '',
            containers: data.containers || [{ label: '', containerCode: '', price: 0 }],
          });
        })
        .catch(err => console.error('Error loading container loading:', err));
    }
  }, [id]);

  const handleDateChange = (value) => {
    setForm(prev => ({ ...prev, date: value }));
  };

  const handleRecipientChange = (value) => {
    setForm(prev => ({ ...prev, recipient: value }));
  };

  const handleContainerChange = (index, field, value) => {
    const updated = [...form.containers];
    updated[index][field] = field === 'price' ? parseFloat(value) : value;
    setForm(prev => ({ ...prev, containers: updated }));
  };

  const addContainer = () => {
    setForm(prev => ({
      ...prev,
      containers: [...prev.containers, { label: 'ตู้ที่ ', containerCode: '', price: 0 }],
    }));
  };

  const removeContainer = (index) => {
    const updated = form.containers.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, containers: updated }));
  };

  const handleSave = async () => {
    const payload = { ...form };
    try {
      if (id) {
        await fetch(`${import.meta.env.VITE_API_URL}/v1/containerloading/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        alert('แก้ไขข้อมูลสำเร็จ');
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/v1/containerloading`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        alert('บันทึกข้อมูลสำเร็จ');
      }
      navigate('/containerloading-history');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const total = form.containers.reduce((sum, c) => sum + (c.price || 0), 0);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{id ? 'แก้ไขข้อมูลค่าขึ้นตู้' : 'เพิ่มข้อมูลค่าขึ้นตู้'}</h1>
        <button className="btn btn-outline" onClick={() => navigate('/containerloading-history')}>
          กลับไปหน้าประวัติ
        </button>
      </div>

      <div>
        <label className="block mb-1 font-medium">วันที่</label>
        <input type="date" className="input input-bordered w-full" value={form.date} onChange={e => handleDateChange(e.target.value)} />
      </div>

      <div>
        <label className="block mb-1 font-medium">ชื่อผู้รับเงิน</label>
        <input type="text" className="input input-bordered w-full" value={form.recipient} onChange={e => handleRecipientChange(e.target.value)} />
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold mt-4">รายการตู้</h2>
        {form.containers.map((c, idx) => (
          <div key={idx} className="flex gap-2 flex-wrap mb-2">
            <input
              type="text"
              className="input input-bordered w-full md:w-1/4"
              placeholder="ลำดับตู้ เช่น ตู้ที่ 1"
              value={c.label}
              onChange={e => handleContainerChange(idx, 'label', e.target.value)}
            />
            <input
              type="text"
              className="input input-bordered w-full md:w-1/3"
              placeholder="เลขตู้"
              value={c.containerCode}
              onChange={e => handleContainerChange(idx, 'containerCode', e.target.value)}
            />
            <input
              type="number"
              className="input input-bordered w-full md:w-1/4"
              placeholder="ราคาค่าขึ้น"
              value={c.price}
              onChange={e => handleContainerChange(idx, 'price', e.target.value)}
            />
            {form.containers.length > 1 && (
              <button className="btn btn-sm btn-error" onClick={() => removeContainer(idx)}>ลบ</button>
            )}
          </div>
        ))}
        <button className="btn btn-sm btn-outline" onClick={addContainer}>+ เพิ่มรายการตู้</button>
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
