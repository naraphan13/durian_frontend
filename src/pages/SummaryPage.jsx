import React, { useEffect, useState } from 'react';

function SummaryPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/bills/summary/data`)
      .then(res => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  const renderNestedDateTable = (data) => (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-2">ตามวันที่ (แยกพันธุ์ + เกรด)</h3>
      {Object.entries(data).map(([date, entries]) => {
        const totalWeight = Object.values(entries).reduce((sum, entry) => sum + entry.weight, 0);
        const totalAmount = Object.values(entries).reduce((sum, entry) => sum + entry.total, 0);

        return (
          <div key={date} className="mb-4 border p-4 rounded-md bg-white shadow-sm">
            <h4 className="font-medium mb-2">
              📅 วันที่: {date} | น้ำหนักรวม: {totalWeight.toLocaleString()} กก. | ยอดรวม: {totalAmount.toLocaleString()} บาท
            </h4>
            <table className="table table-sm w-full">
              <thead>
                <tr>
                  <th>พันธุ์ + เกรด</th>
                  <th>น้ำหนักรวม (กก.)</th>
                  <th>ยอดรวม (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(entries).map(([key, val]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{val.weight.toLocaleString()}</td>
                    <td>{val.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </section>
  );

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
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">สรุปยอดการรับซื้อทุเรียน</h2>
      {renderNestedDateTable(summary.byDate)}
      {renderTable('ตามเกรด', summary.byGrade)}
      {renderTable('ตามพันธุ์', summary.byVariety)}
      {renderTable('ตามพันธุ์ + เกรด', summary.byVarietyGrade)}
    </div>
  );
}

export default SummaryPage;
