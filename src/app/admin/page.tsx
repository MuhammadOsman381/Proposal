"use client";
import { useEffect, useState } from "react";
import GridBackground from "@/components/GridBackground";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import toast from "react-hot-toast";
import useGetAndDelete from "@/hooks/useGetAndDelete";

const ADMIN_KEY = "admin123";

export default function AdminPage() {
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const createProposal = usePostAndPut(axios.post);
    const getProposal = useGetAndDelete(axios.get);
    const login = usePostAndPut(axios.post);

    const handleLogin = async () => {
        if (password === ADMIN_KEY) {
            const response = await login.callApi("auth/login", { adminKey: ADMIN_KEY }, false, false, true);
                setIsAuthenticated(true);
        } else {
            toast.error("Wrong admin key ❌");
        }
    };

    const saveData = async () => {
        const data = {
            adminKey,
            secretKey,
            date,
            message,
        };
        await createProposal.callApi("proposal/create", data, false, false, true);
    };

    const getData = async () => {
        const response = await getProposal.callApi("proposal/get", false, false);
        if (response.success) {
            setAdminKey(response.data.adminKey);
            setSecretKey(response.data.secretKey);
            setMessage(response.data.message);
            setDate(new Date(response.data.date).toISOString().slice(0, 16));
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <main className="min-h-screen flex items-start justify-center text-white p-8">
            <GridBackground />

            {!isAuthenticated ? (
                <div className="w-full max-w-md bg-slate-800 p-6 rounded-xl space-y-4">
                    <h1 className="text-2xl font-bold text-center">Admin Login 🔐</h1>

                    <div>
                        <label className="text-sm">Admin Key</label>
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
                        <label className="text-sm">Admin Key</label>
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
                        Save & Log Data 💾
                    </button>
                </div>
            )}
        </main>
    );
}
