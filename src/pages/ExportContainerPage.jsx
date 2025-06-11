import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

export default function ExportContainerPage() {
  const [form, setForm] = useState({
    date: '',
    city: '',
    containerInfo: '',
    containerCode: '',
    refCode: '',
    durianItems: [],
    handlingCosts: {
      largebox: { quantity: '', weight: '', costPerKg: '' },
      mediumbox: { quantity: '', weight: '', costPerKg: '' },
      smallbox: { quantity: '', weight: '', costPerKg: '' },
    },
    boxCosts: {
      large: { quantity: '', unitCost: '' },
      medium: { quantity: '', unitCost: '' },
      small: { quantity: '', unitCost: '' },
    },
    inspectionFee: 6000,
    brandSummary: '',
    freightItems: []
  });

  const [searchParams] = useSearchParams();
  const exportId = searchParams.get('id');

  useEffect(() => {
    if (exportId) {
      fetch(`${import.meta.env.VITE_API_URL}/v1/export/${exportId}`)
        .then(res => res.json())
        .then(data => setForm(data));
    }
  }, [exportId]);

  const varieties = ['MONTHONG', 'PUNGMANEE', 'KANYAOW'];
  const grades = ['A', 'B', 'C'];

  const labelMap = {
    largebox: 'กล่องขนาดใหญ่',
    mediumbox: 'กล่องขนาดกลาง',
    smallbox: 'กล่องขนาดเล็ก',
    large: 'กล่องขนาดใหญ่',
    medium: 'กล่องขนาดกลาง',
    small: 'กล่องขนาดเล็ก',
  };

  const handleInput = (section, type, field, value) => {
    setForm({
      ...form,
      [section]: {
        ...form[section],
        [type]: {
          ...form[section][type],
          [field]: parseFloat(value)
        },
      },
    });
  };

  const handleTextInput = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const addDurianItem = () => {
    setForm({
      ...form,
      durianItems: [
        ...form.durianItems,
        { variety: '', grade: '', boxes: '', weightPerBox: '', pricePerKg: '' },
      ],
    });
  };

  const updateDurianItem = (index, key, value) => {
    const newItems = [...form.durianItems];
    newItems[index][key] = value;
    setForm({ ...form, durianItems: newItems });
  };

  const removeDurianItem = (index) => {
    const newItems = [...form.durianItems];
    newItems.splice(index, 1);
    setForm({ ...form, durianItems: newItems });
  };

  const addFreightItem = () => {
    setForm(prev => ({
      ...prev,
      freightItems: [
        ...(prev.freightItems || []),
        { variety: '', grade: '', weight: '', pricePerKg: '' },
      ],
    }));
  };

  const updateFreightItem = (index, key, value) => {
    const updated = [...form.freightItems];
    updated[index][key] = value;
    setForm({ ...form, freightItems: updated });
  };

  const removeFreightItem = (index) => {
    const updated = [...form.freightItems];
    updated.splice(index, 1);
    setForm({ ...form, freightItems: updated });
  };

  const calculateHandlingWeightFromDurianItems = () => {
    const weightRanges = {
      largebox: [17, 19.5],
      mediumbox: [12, 14],
      smallbox: [9, 10],
    };

    const updatedHandlingCosts = { ...form.handlingCosts };
    Object.keys(updatedHandlingCosts).forEach(key => {
      updatedHandlingCosts[key].weight = 0;
    });

    form.durianItems.forEach(item => {
      const { boxes, weightPerBox } = item;
      if (!boxes || !weightPerBox) return;

      for (const [boxType, [min, max]] of Object.entries(weightRanges)) {
        if (weightPerBox >= min && weightPerBox <= max) {
          updatedHandlingCosts[boxType].weight += boxes * weightPerBox;
          break;
        }
      }
    });

    setForm(prev => ({
      ...prev,
      handlingCosts: updatedHandlingCosts,
    }));
  };

  const calculateBoxQuantitiesFromDurianItems = () => {
    const weightRanges = {
      large: [17, 19.5],
      medium: [12, 14],
      small: [9, 10],
    };

    const counts = {
      large: 0,
      medium: 0,
      small: 0,
    };

    form.durianItems.forEach(item => {
      const { boxes, weightPerBox } = item;
      if (!boxes || !weightPerBox) return;

      for (const [size, [min, max]] of Object.entries(weightRanges)) {
        if (weightPerBox >= min && weightPerBox <= max) {
          counts[size] += boxes;
          break;
        }
      }
    });

    setForm(prev => ({
      ...prev,
      handlingCosts: {
        ...prev.handlingCosts,
        largebox: { ...prev.handlingCosts.largebox, quantity: counts.large },
        mediumbox: { ...prev.handlingCosts.mediumbox, quantity: counts.medium },
        smallbox: { ...prev.handlingCosts.smallbox, quantity: counts.small },
      },
      boxCosts: {
        ...prev.boxCosts,
        large: { ...prev.boxCosts.large, quantity: counts.large },
        medium: { ...prev.boxCosts.medium, quantity: counts.medium },
        small: { ...prev.boxCosts.small, quantity: counts.small },
      },
    }));
  };

  const handleSaveOrUpdate = async () => {
    const method = exportId ? 'PUT' : 'POST';
    const url = exportId
      ? `${import.meta.env.VITE_API_URL}/v1/export/${exportId}`
      : `${import.meta.env.VITE_API_URL}/v1/export`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert(exportId ? 'อัปเดตสำเร็จ!' : 'บันทึกสำเร็จ!');
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleGeneratePDF = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/export/exportpdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export-${form.date}.pdf`;
    link.click();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Export Container - Durian</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">วันที่</label>
          <input type="date" className="input input-bordered w-full" value={form.date} onChange={e => handleTextInput('date', e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">เมืองปลายทาง</label>
          <input className="input input-bordered w-full" value={form.city} onChange={e => handleTextInput('city', e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">ข้อมูลตู้</label>
          <input className="input input-bordered w-full" value={form.containerInfo} onChange={e => handleTextInput('containerInfo', e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">รหัสตู้</label>
          <input className="input input-bordered w-full" value={form.containerCode} onChange={e => handleTextInput('containerCode', e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">รหัสอ้างอิง</label>
          <input className="input input-bordered w-full" value={form.refCode} onChange={e => handleTextInput('refCode', e.target.value)} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">รายการทุเรียน</h2>
        {form.durianItems.map((item, idx) => (
          <div key={idx} className="grid grid-cols-6 gap-2 mb-2">
            <select className="select select-bordered" value={item.variety} onChange={e => updateDurianItem(idx, 'variety', e.target.value)}>
              <option value="">เลือกพันธุ์</option>
              {varieties.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="select select-bordered" value={item.grade} onChange={e => updateDurianItem(idx, 'grade', e.target.value)}>
              <option value="">เลือกเกรด</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input className="input input-bordered" type="number" placeholder="จำนวนกล่อง" value={item.boxes} onChange={e => updateDurianItem(idx, 'boxes', parseFloat(e.target.value))} />
            <input className="input input-bordered" type="number" placeholder="น้ำหนัก/กล่อง" value={item.weightPerBox} onChange={e => updateDurianItem(idx, 'weightPerBox', parseFloat(e.target.value))} />
            <input className="input input-bordered" type="number" placeholder="ราคา/กก." value={item.pricePerKg} onChange={e => updateDurianItem(idx, 'pricePerKg', parseFloat(e.target.value))} />
            <button className="btn btn-error" onClick={() => removeDurianItem(idx)}>ลบ</button>
          </div>
        ))}
        <button className="btn btn-outline" onClick={addDurianItem}>+ เพิ่มรายการ</button>
        <button className="btn btn-info mt-2 ml-2" onClick={calculateHandlingWeightFromDurianItems}>คำนวณน้ำหนักรวม</button>
        <button className="btn btn-success mt-2 ml-2" onClick={calculateBoxQuantitiesFromDurianItems}>คำนวณจำนวนกล่อง</button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">ค่าน้ำหนักซิ / Freight Charges</h2>
        {form.freightItems?.map((item, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
            <select className="select select-bordered" value={item.variety} onChange={e => updateFreightItem(idx, 'variety', e.target.value)}>
              <option value="">พันธุ์</option>
              {varieties.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="select select-bordered" value={item.grade} onChange={e => updateFreightItem(idx, 'grade', e.target.value)}>
              <option value="">เกรด</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input type="number" className="input input-bordered" placeholder="น้ำหนัก (กก.)" value={item.weight} onChange={e => updateFreightItem(idx, 'weight', e.target.value)} />
            <input type="number" className="input input-bordered" placeholder="ราคา/กก." value={item.pricePerKg} onChange={e => updateFreightItem(idx, 'pricePerKg', e.target.value)} />
            <button type="button" className="btn btn-error" onClick={() => removeFreightItem(idx)}>ลบ</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={addFreightItem}>+ เพิ่มรายการน้ำหนักซิ</button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">ค่าจัดการกล่อง</h2>
        {['largebox', 'mediumbox', 'smallbox'].map(type => (
          <div key={type} className="grid grid-cols-3 gap-2 mb-2">
            <label className="col-span-3 font-semibold text-sm text-gray-600">{labelMap[type]}</label>
            <input className="input input-bordered" type="number" placeholder="จำนวนกล่อง" value={form.handlingCosts[type].quantity} onChange={e => handleInput('handlingCosts', type, 'quantity', e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="น้ำหนักรวม" value={form.handlingCosts[type].weight} onChange={e => handleInput('handlingCosts', type, 'weight', e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="ค่าจัดการต่อกก." value={form.handlingCosts[type].costPerKg} onChange={e => handleInput('handlingCosts', type, 'costPerKg', e.target.value)} />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">ค่ากล่อง</h2>
        {['large', 'medium', 'small'].map(size => (
          <div key={size} className="grid grid-cols-2 gap-2 mb-2">
            <label className="col-span-2 font-semibold text-sm text-gray-600">{labelMap[size]}</label>
            <input className="input input-bordered" type="number" placeholder="จำนวนกล่อง" value={form.boxCosts[size].quantity} onChange={e => handleInput('boxCosts', size, 'quantity', e.target.value)} />
            <input className="input input-bordered" type="number" placeholder="ราคาต่อกล่อง" value={form.boxCosts[size].unitCost} onChange={e => handleInput('boxCosts', size, 'unitCost', e.target.value)} />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">ค่าตรวจสาร</h2>
        <input className="input input-bordered w-full max-w-xs" type="number" value={form.inspectionFee} onChange={e => setForm({ ...form, inspectionFee: parseFloat(e.target.value) })} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">สรุปกล่องตามแบรนด์</h2>
        <textarea className="textarea textarea-bordered w-full h-40" placeholder="พิมพ์สรุปกล่องแต่ละพันธุ์/เกรด เช่น:\nMONTHONG A 6 ลูก 6 กล่อง 3 ลูก 1350 กล่อง ..." value={form.brandSummary} onChange={e => handleTextInput('brandSummary', e.target.value)} />
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={handleSaveOrUpdate} className="btn btn-success">
          {exportId ? 'อัปเดตเอกสาร' : 'บันทึกเอกสาร'}
        </button>
        <button onClick={handleGeneratePDF} className="btn btn-primary">Generate PDF</button>
      </div>
    </div>
  );
}
