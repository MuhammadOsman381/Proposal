"use client";

import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import GridBackground from "@/components/GridBackground";

const SETTINGS_KEY = "proposal_admin_settings";
const ENCRYPTION_KEY = "default_key";

export default function AdminPage() {
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const encrypt = (text: string) =>
        CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();

    const [savedData, setSavedData] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (!saved) return;

        const data = JSON.parse(saved);
        setSavedData(data);

        setDate(data.date ? CryptoJS.AES.decrypt(data.date, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8) : "");
        setMessage(data.message ? CryptoJS.AES.decrypt(data.message, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8) : "");
        setSecretKey(
            data.secretKey
                ? CryptoJS.AES.decrypt(data.secretKey, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
                : ""
        );
        setAdminKey(
            data.adminKey
                ? CryptoJS.AES.decrypt(data.adminKey, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
                : ""
        );
    }, []);

    const saveData = () => {
        if (!secretKey) {
            alert("Secret key is required ❌");
            return;
        }

        const data = {
            date: encrypt(date),
            message: encrypt(message),
            secretKey: encrypt(secretKey),
            adminKey: encrypt(adminKey),
        };

        localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
        setSavedData(data);
        alert("Settings saved ✅");
    };

    const handleLogin = () => {
        if (!savedData || !savedData.adminKey) {
            alert("No admin key set, cannot login ❌");
            return;
        }

        const decryptedKey = CryptoJS.AES.decrypt(savedData.adminKey, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

        if (password === decryptedKey) {
            setIsAuthenticated(true);
        } else {
            alert("Wrong password ❌");
        }
    };

    return (
        <main className="min-h-screen flex items-start justify-center text-white p-8">
            <GridBackground />

            {!isAuthenticated ? (
                <div className="w-full max-w-md bg-slate-800 p-6 rounded-xl space-y-4">
                    <h1 className="text-2xl font-bold text-center">Admin Login 🔐</h1>

                    <div>
                        <label className="text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-slate-700"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-pink-600 py-2 rounded hover:bg-pink-700"
                    >
                        Login 🔓
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-xl bg-slate-800 p-6 rounded-xl space-y-4">
                    <h1 className="text-2xl font-bold text-center">Proposal Admin 💖</h1>

                    <div>
                        <label className="text-sm">Admin Secret Key</label>
                        <input
                            type="text"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-slate-700"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Proposal Secret Key</label>
                        <input
                            type="text"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-slate-700"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Target Date</label>
                        <input
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-slate-700"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Proposal Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 rounded bg-slate-700"
                        />
                    </div>

                    <button
                        onClick={saveData}
                        className="w-full bg-green-600 py-2 rounded hover:bg-green-700"
                    >
                        Save Settings 💾
                    </button>
                </div>
            )}
        </main>
    );
}
