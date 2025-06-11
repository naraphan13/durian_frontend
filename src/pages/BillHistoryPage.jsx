import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";

function BillHistoryPage() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchSeller, setSearchSeller] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const observerRef = useRef();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/bills`);
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้");
        const data = await res.json();
        setBills(data);
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const calculateTotal = (items) =>
    items.reduce((sum, item) => {
      const weight = parseFloat(item.weight) || 0;
      const price = parseFloat(item.pricePerKg) || 0;
      return sum + weight * price;
    }, 0);

  const filteredBills = bills.filter((bill) => {
    const sellerMatch = bill.seller.toLowerCase().includes(searchSeller.toLowerCase());
    const dateMatch = bill.date.startsWith(searchDate);
    const totalAmount = calculateTotal(bill.items);

    const cleanedSearchAmount = searchAmount
      ? parseFloat(searchAmount.replace(/,/g, ""))
      : 0;

    const amountMatch = searchAmount
      ? !isNaN(cleanedSearchAmount) && totalAmount >= cleanedSearchAmount
      : true;

    return sellerMatch && (!searchDate || dateMatch) && amountMatch;
  });

  const sortedBills = [...filteredBills];
  if (searchAmount) {
    const target = parseFloat(searchAmount.replace(/,/g, ""));
    if (!isNaN(target)) {
      sortedBills.sort((a, b) => {
        const totalA = calculateTotal(a.items);
        const totalB = calculateTotal(b.items);
        const diffA = Math.abs(totalA - target);
        const diffB = Math.abs(totalB - target);
        return diffA - diffB;
      });
    }
  }

  const visibleBills = sortedBills.slice(0, page * itemsPerPage);

  const loadMoreBills = () => {
    if (isLoadingMore || visibleBills.length >= sortedBills.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 500);
  };

  const lastElementRef = useCallback(
    (node) => {
      if (loading || isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleBills.length < sortedBills.length) {
          loadMoreBills();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, isLoadingMore, visibleBills, sortedBills]
  );

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/bills/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");
      alert("ลบสำเร็จ");
      const updatedBills = bills.filter((b) => b.id !== id);
      setBills(updatedBills);
      setPage(1);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-green-700 font-semibold text-lg">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">บิลย้อนหลัง</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="ค้นหาผู้ขาย..."
          className="input input-bordered w-full md:w-1/3"
          value={searchSeller}
          onChange={(e) => {
            setSearchSeller(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="input input-bordered w-full md:w-1/3"
          value={searchDate}
          onChange={(e) => {
            setSearchDate(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="text"
          placeholder="ค้นหาจากยอดรวม (บาท)"
          className="input input-bordered w-full md:w-1/3"
          value={searchAmount}
          onChange={(e) => {
            setSearchAmount(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ชื่อผู้ขาย</th>
              <th>จำนวนรายการ</th>
              <th>รวมเงิน (บาท)</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {visibleBills.map((bill, index) => (
              <tr key={bill.id} ref={index === visibleBills.length - 1 ? lastElementRef : null}>
                <td>{new Date(bill.date).toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" })}</td>
                <td>{bill.seller}</td>
                <td>{bill.items.length} รายการ</td>
                <td>{calculateTotal(bill.items).toLocaleString()}</td>
                <td className="flex flex-wrap gap-1">
                  <button className="btn btn-sm btn-outline" onClick={() => setSelectedBill(bill)}>
                    ดูรายละเอียด
                  </button>
                  <button className="btn btn-sm btn-warning" onClick={() => navigate(`/edit/${bill.id}`)}>
                    แก้ไข
                  </button>
                  <button className="btn btn-sm btn-error" onClick={() => setBillToDelete(bill)}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
            {visibleBills.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500">
                  ไม่พบข้อมูลที่ตรงกับเงื่อนไข
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner text-success"></span>
          </div>
        )}
      </div>

      {selectedBill && (
        <dialog id="billDetailModal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-2">รายละเอียดบิล {selectedBill.id}</h3>
            <p>ผู้ขาย: {selectedBill.seller}</p>
            <p>วันที่: {new Date(selectedBill.date).toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" })}</p>

            <div className="overflow-x-auto mt-4">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>พันธุ์</th>
                    <th>เกรด</th>
                    <th>น้ำหนัก (กก.)</th>
                    <th>ราคา/กก.</th>
                    <th>รวม (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.variety}</td>
                      <td>{item.grade}</td>
                      <td>{item.weight}</td>
                      <td>{item.pricePerKg}</td>
                      <td>{(parseFloat(item.weight) * parseFloat(item.pricePerKg)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-action">
              <a
                href={`${import.meta.env.VITE_API_URL}/v1/bills/${selectedBill.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                พิมพ์ PDF
              </a>
              <button className="btn" onClick={() => setSelectedBill(null)}>
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}

      {billToDelete && (
        <dialog id="confirmDeleteModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">ยืนยันการลบ</h3>
            <p>คุณต้องการลบบิล <strong>{billToDelete.id}</strong> ใช่หรือไม่?</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={() => handleDelete(billToDelete.id)}>
                ยืนยันลบ
              </button>
              <button className="btn" onClick={() => setBillToDelete(null)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default BillHistoryPage;
