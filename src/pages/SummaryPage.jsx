import React, { useEffect, useState } from 'react';

function SummaryPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8899/v1/bills/summary/data')
      .then(res => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  const renderTable = (title, data) => (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <table className="table table-sm w-full">
        <thead>
          <tr>
            <th>หมวด</th>
            <th>น้ำหนักรวม (กก.)</th>
            <th>ยอดรวม (บาท)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([k, val]) => (
            <tr key={k}>
              <td>{k}</td>
              <td>{val.weight.toLocaleString()}</td>
              <td>{val.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  if (!summary) return <p className="text-center mt-6">กำลังโหลด...</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">สรุปยอดการรับซื้อทุเรียน</h2>
      {renderTable('ตามวันที่', summary.byDate)}
      {renderTable('ตามเกรด', summary.byGrade)}
      {renderTable('ตามพันธุ์', summary.byVariety)}
      {renderTable('ตามพันธุ์ + เกรด', summary.byVarietyGrade)}
    </div>
  );
}

export default SummaryPage;
