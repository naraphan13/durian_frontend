// 📁 src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error('Invalid credentials');

            const data = await res.json();

            // ✅ เก็บ token และ role ใน localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role); // << สำคัญมาก

            navigate('/'); // ไปหน้าหลักหรือหน้าที่ต้องการหลัง login
        } catch (err) {
            console.error(err);
            setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-4 border rounded shadow bg-white">
            <h2 className="text-xl font-bold mb-4 text-center">เข้าสู่ระบบ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="รหัสผ่าน"
                    className="input input-bordered w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" className="btn btn-primary w-full">เข้าสู่ระบบ</button>

                <p className="text-center text-sm mt-4">
                    ยังไม่มีบัญชี? <a href="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</a>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
