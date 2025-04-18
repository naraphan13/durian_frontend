import React, { useEffect, useState } from 'react';

function BillHistoryPage() {
    const [bills, setBills] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8899/v1/bills')
            .then(res => res.json())
            .then(setBills)
            .catch(err => console.error(err));
    }, []);

    const calcTotal = (items) =>
        items.reduce((sum, i) => sum + i.weight * i.pricePerKg, 0);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">บิลย้อนหลัง</h2>
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>วันที่</th>
                        <th>ชื่อผู้ขาย</th>
                        <th>จำนวน</th>
                        <th>ยอดรวม</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map((bill) => (
                        <tr key={bill.id}>
                            <td>{bill.date.split('T')[0]}</td>
                            <td>{bill.seller}</td>
                            <td>{bill.items.length}</td>
                            <td>{calcTotal(bill.items).toLocaleString()}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => setSelected(bill)}
                                >
                                    ดู
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selected && (
                <dialog open className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">รายละเอียดบิล</h3>
                        <p>ผู้ขาย: {selected.seller}</p>
                        <p>วันที่: {selected.date.split('T')[0]}</p>
                        <table className="table table-sm mt-3">
                            <thead>
                                <tr>
                                    <th>พันธุ์</th>
                                    <th>เกรด</th>
                                    <th>น้ำหนัก</th>
                                    <th>ราคา/กก.</th>
                                    <th>รวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selected.items.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.variety}</td>
                                        <td>{item.grade}</td>
                                        <td>{item.weight}</td>
                                        <td>{item.pricePerKg}</td>
                                        <td>{(item.weight * item.pricePerKg).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-action">
                            <a
                                href={`http://localhost:8899/v1/bills/${selected.id}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                            >
                                📄 ดาวน์โหลด PDF
                            </a>

                            <button className="btn" onClick={() => setSelected(null)}>
                                ปิด
                            </button>
                        </div>
                        
                    </div>
                </dialog>
            )}
        </div>
    );
}

export default BillHistoryPage;
