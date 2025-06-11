import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ ตรวจความยาวรหัสผ่าน
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.error?.includes('Unique constraint failed')) {
          setError('อีเมลนี้ถูกใช้ไปแล้ว');
        } else {
          setError('สมัครไม่สำเร็จ');
        }
        return;
      }

      alert('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการสมัคร');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">สมัครสมาชิก</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="ชื่อ"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="อีเมล"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="btn btn-primary w-full">สมัครสมาชิก</button>

        <p className="text-center text-sm mt-4">
          มีบัญชีอยู่แล้ว? <a href="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
