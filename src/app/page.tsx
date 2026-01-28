"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import GridBackground from "@/components/GridBackground";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";

type Stage = "timer" | "secret" | "proposal";

export default function Page() {
  const [stage, setStage] = useState<Stage>("timer");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [encryptedSecret, setEncryptedSecret] = useState("");
  const [message, setMessage] = useState("");
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  const [timeLeft, setTimeLeft] = useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  const getProposal = useGetAndDelete(axios.get);

  const getData = async () => {
    const response = await getProposal.callApi("proposal/get", false, false);
    if (response.success) {
      setEncryptedSecret(response.data.secretKey);
      setMessage(response.data.message);
      const utcDate = response.data.date;
      const localDate = new Date(
        Date.UTC(
          parseInt(utcDate.slice(0, 4)),
          parseInt(utcDate.slice(5, 7)) - 1,
          parseInt(utcDate.slice(8, 10)),
          parseInt(utcDate.slice(11, 13)),
          parseInt(utcDate.slice(14, 16)),
          parseInt(utcDate.slice(17, 19))
        )
      );
      setTargetDate(localDate);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (stage !== "timer" || !targetDate || isNaN(targetDate.getTime())) return;

    const updateTimer = () => {
      let diff = targetDate.getTime() - Date.now();

      console.log(targetDate.getTime());

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        setStage("secret");
        return true; // signal to stop interval
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ d: days, h: hours, m: minutes, s: seconds });
      return false; // continue interval
    };

    // Run once immediately
    if (updateTimer()) return;

    const interval = setInterval(() => {
      if (updateTimer()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, targetDate]);


  const partyPopper = () => {
    const end = Date.now() + 4000;
    const frame = () => {
      confetti({ particleCount: 8, spread: 90, origin: { y: 0.6 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const unlock = () => {
    console.log("Decrypted secret:", encryptedSecret);
    console.log("Entered password:", password);

    if (password === encryptedSecret) {
      setStage("proposal");
      partyPopper();
    } else {
      setError("Wrong secret 💔");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center text-slate-300 overflow-hidden">
      <GridBackground />

      {stage === "timer" && (
        <div className="text-center text-white space-y-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-8xl font-bold">
            <div className="flex flex-col">
              <span>{String(timeLeft.d).padStart(2, "0")}</span>
              <span className="text-xl font-normal">Days</span>
            </div>
            <div className="flex flex-col">
              <span>{String(timeLeft.h).padStart(2, "0")}</span>
              <span className="text-xl font-normal">Hours</span>
            </div>
            <div className="flex flex-col">
              <span>{String(timeLeft.m).padStart(2, "0")}</span>
              <span className="text-xl font-normal">Minutes</span>
            </div>
            <div className="flex flex-col">
              <span>{String(timeLeft.s).padStart(2, "0")}</span>
              <span className="text-xl font-normal">Seconds</span>
            </div>
          </div>
        </div>
      )}

      {stage === "secret" && (
        <div className="bg-slate-800 border-t-2 border-slate-700  p-6 rounded-xl w-80  text-center space-y-4">
          <h2 className="text-xl font-semibold">Enter Secret 🔐</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border-t-2 border-slate-600  outline-none bg-slate-700 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={unlock}
            className="w-full bg-pink-600 border-t-2 border-pink-500 py-1.5 rounded hover:bg-pink-700 hover:border-pink-600 text-white"
          >
            Unlock
          </button>
        </div>
      )}

      {stage === "proposal" && (
        <div className="bg-slate-800 p-8 border-t-2 border-slate-700 rounded-2xl  w-96 text-center space-y-4">
          <h1 className="text-3xl font-bold ">💍 Pata nhi</h1>
          <p className="text-gray-400">{message}</p>
        </div>
      )}
    </main>
  );
}
