"use client";

import React from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Clock } from "lucide-react";
import confetti from "canvas-confetti";

// Custom Disco Ball Component
const DiscoBall = () => (
    <motion.div
        className="relative w-20 h-20 mb-2"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
        {/* String */}
        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[1px] h-10 bg-[#A62639]/30" />

        {/* Ball */}
        <motion.div
            className="w-full h-full rounded-full bg-[#A62639] relative overflow-hidden shadow-xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%),linear-gradient(-45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px]" />

            {/* Light highlights */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </motion.div>

        {/* Sparkling points around the ball */}
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                    scale: [0, 1.2, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 90, 180]
                }}
                transition={{
                    duration: 1 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2
                }}
            />
        ))}
    </motion.div>
);

const translations = {
    pl: {
        envelopeLabel: "Urodziny Ali",
        clickToOpen: "Kliknij, aby otworzyć",
        celebrating: "Świętujemy",
        birthday: "18. URODZINY ALI",
        when: "Kiedy",
        where: "Gdzie",
        dressCodeLabel: "Dress Code",
        dressCodeValue: "Elegancko i Świątecznie",
        enterParty: "WEJDŹ NA IMPREZĘ",
        returnEnvelope: "Wróć do koperty",
        location: "Grand Ballroom",
        time: "20.03.2026 | 18:00",
    },
    vi: {
        envelopeLabel: "Sinh nhật của Ala",
        clickToOpen: "Nhấn để mở",
        celebrating: "Chào mừng",
        birthday: "SINH NHẬT LẦN THỨ 18 CỦA ALA",
        when: "Thời gian",
        where: "Địa điểm",
        dressCodeLabel: "Trang phục",
        dressCodeValue: "Sang trọng & Lễ hội",
        enterParty: "VÀO BUỔI TIỆC",
        returnEnvelope: "Quay lại phong bì",
        location: "Grand Ballroom",
        time: "20.03.2026 | 18:00",
    }
};

export default function InvitationPage() {
    const { isLoaded } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [lang, setLang] = useState<"pl" | "vi">("pl");
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Detect language
    useEffect(() => {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.includes("vi")) {
            setLang("vi");
        } else {
            setLang("pl");
        }
    }, []);

    const t = translations[lang];

    // March 20, 2026 at 18:00 (6 PM) Poland time (CET -> UTC+1)
    const eventDate = new Date("2026-03-20T18:00:00+01:00").getTime();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [eventDate]);

    const handleConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#A62639", "#FDFBF7", "#C19A6B"],
            zIndex: 100,
        });
    };

    // Magnetic Button Logic
    const buttonRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((e.clientX - centerX) / 4);
        y.set((e.clientY - centerY) / 4);
    };
    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-[#FDFBF7] flex flex-col items-center justify-center text-[#3E2723] py-4">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div
                        key="envelope-view"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="z-50 cursor-pointer flex flex-col items-center gap-8 py-10"
                        onClick={() => {
                            setIsOpen(true);
                            handleConfetti();
                        }}
                    >
                        {/* The Envelope */}
                        <div className="relative group">
                            <motion.div
                                className="w-[min(288px,80vw)] h-[min(208px,60vw)] bg-[#A62639] rounded-lg shadow-[0_20px_50px_rgba(166,38,57,0.3)] relative overflow-hidden border border-white/10"
                                whileHover={{ y: -10 }}
                            >
                                {/* Envelope Flap Appearance */}
                                <div className="absolute inset-0 bg-[#8A1F2F]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }} />

                                {/* Seal */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#FDFBF7] rounded-full shadow-lg flex items-center justify-center border-4 border-[#A62639]">
                                    <span className="font-serif text-xl font-bold text-[#A62639]">A</span>
                                </div>

                                <div className="absolute bottom-6 w-full text-center px-4">
                                    <p className="text-[#FDFBF7]/60 text-[10px] uppercase tracking-[0.4em] font-medium truncate">{t.envelopeLabel}</p>
                                </div>
                            </motion.div>

                            {/* Shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
                                animate={{ x: [-200, 400] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className="text-xs tracking-[0.3em] uppercase font-bold text-[#A62639]">{t.clickToOpen}</span>
                            <div className="w-1 h-1 bg-[#A62639] rounded-full" />
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="card-view"
                        className="relative w-full max-w-[360px] flex flex-col items-center px-4 sm:px-6 my-auto"
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    >
                        {/* The Invitation Card with Scalloped Border */}
                        <div
                            className="w-full bg-[#A62639] p-2 relative shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
                            style={{
                                clipPath: "polygon(0% 2.5%, 2.5% 0%, 5% 2.5%, 7.5% 0%, 10% 2.5%, 12.5% 0%, 15% 2.5%, 17.5% 0%, 20% 2.5%, 22.5% 0%, 25% 2.5%, 27.5% 0%, 30% 2.5%, 32.5% 0%, 35% 2.5%, 37.5% 0%, 40% 2.5%, 42.5% 0%, 45% 2.5%, 47.5% 0%, 50% 2.5%, 52.5% 0%, 55% 2.5%, 57.5% 0%, 60% 2.5%, 62.5% 0%, 65% 2.5%, 67.5% 0%, 70% 2.5%, 72.5% 0%, 75% 2.5%, 77.5% 0%, 80% 2.5%, 82.5% 0%, 85% 2.5%, 87.5% 0%, 90% 2.5%, 92.5% 0%, 95% 2.5%, 97.5% 0%, 100% 2.5%, 100% 97.5%, 97.5% 100%, 95% 97.5%, 92.5% 100%, 90% 97.5%, 87.5% 100%, 85% 97.5%, 82.5% 100%, 80% 97.5%, 77.5% 100%, 75% 97.5%, 72.5% 100%, 70% 97.5%, 67.5% 100%, 65% 97.5%, 62.5% 100%, 60% 97.5%, 57.5% 100%, 55% 97.5%, 52.5% 100%, 50% 97.5%, 47.5% 100%, 45% 97.5%, 42.5% 100%, 40% 97.5%, 37.5% 100%, 35% 97.5%, 32.5% 100%, 30% 97.5%, 27.5% 100%, 25% 97.5%, 22.5% 100%, 20% 97.5%, 17.5% 100%, 15% 97.5%, 12.5% 100%, 10% 97.5%, 7.5% 100%, 5% 97.5%, 2.5% 100%, 0% 97.5%)"
                            }}
                        >
                            <div className="bg-[#FDFBF7] w-full h-full flex flex-col items-center py-4 sm:py-8 px-5 sm:px-8">
                                <DiscoBall />

                                <motion.h2
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="font-serif text-[#A62639] text-4xl sm:text-5xl font-black italic mb-1 tracking-tight"
                                >
                                    Party
                                </motion.h2>
                                <motion.h2
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="font-serif text-[#A62639] text-2xl sm:text-3xl mb-2 tracking-[0.1em]"
                                >
                                    TIME
                                </motion.h2>

                                <div className="w-12 h-[2px] bg-[#A62639]/20 mb-4" />

                                <div className="text-center space-y-2 mb-4">
                                    <p className="text-[9px] uppercase tracking-[0.4em] font-black text-[#A62639]/40">{t.celebrating}</p>
                                    <h1 className="font-serif text-lg sm:text-xl text-[#2C1810] font-bold leading-tight">{t.birthday}</h1>
                                </div>

                                {/* Event Details Grid */}
                                <div className="grid grid-cols-2 gap-4 w-full mb-4 border-y border-[#A62639]/10 py-4">
                                    <div className="flex flex-col items-center gap-1 border-r border-[#A62639]/10 text-center">
                                        <Clock size={12} className="text-[#A62639]/60 mb-0.5" />
                                        <span className="text-[8px] uppercase tracking-widest text-[#A62639] font-bold">{t.when}</span>
                                        <p className="text-[10px] sm:text-xs font-bold text-[#3E2723]">{t.time}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <MapPin size={12} className="text-[#A62639]/60 mb-0.5" />
                                        <span className="text-[8px] uppercase tracking-widest text-[#A62639] font-bold">{t.where}</span>
                                        <p className="text-[10px] sm:text-xs font-bold text-[#3E2723] leading-tight">{t.location}</p>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex flex-col items-center gap-1 mb-4 text-center"
                                >
                                    <span className="text-[8px] uppercase tracking-widest text-[#A62639]/60 font-bold">{t.dressCodeLabel}</span>
                                    <p className="text-[10px] sm:text-xs font-bold text-[#3E2723] uppercase tracking-[0.2em]">{t.dressCodeValue}</p>
                                </motion.div>

                                <div className="mb-4 w-full px-2">
                                    <div className="flex justify-center items-end gap-3 sm:gap-4">
                                        {[
                                            { label: "D", value: timeLeft.days },
                                            { label: "H", value: timeLeft.hours },
                                            { label: "M", value: timeLeft.minutes },
                                            { label: "S", value: timeLeft.seconds },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex flex-col items-center">
                                                <span className="font-serif text-lg sm:text-xl text-[#3E2723] font-bold leading-none">
                                                    {item.value.toString().padStart(2, "0")}
                                                </span>
                                                <span className="text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-[#A62639] mt-1 font-bold">
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Magnetic Entry Button */}
                                <div className="w-full mt-auto mb-4 min-h-[48px]">
                                    {!isLoaded ? (
                                        <div className="w-full h-11 bg-[#A62639]/10 rounded-full animate-pulse" />
                                    ) : (
                                        <div
                                            ref={buttonRef}
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={handleMouseLeave}
                                            className="relative"
                                        >
                                            <SignedOut>
                                                <SignInButton mode="modal" fallbackRedirectUrl="/feed">
                                                    <motion.button
                                                        style={{ x, y }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center gap-2 bg-[#A62639] text-[#FDFBF7] h-11 sm:h-12 rounded-full font-serif text-base sm:text-lg tracking-widest shadow-xl shadow-[#A62639]/20 transition-transform active:scale-95"
                                                    >
                                                        {t.enterParty}
                                                        <ChevronRight size={18} />
                                                    </motion.button>
                                                </SignInButton>
                                            </SignedOut>
                                            <SignedIn>
                                                <Link href="/feed">
                                                    <motion.button
                                                        style={{ x, y }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center gap-2 bg-[#A62639] text-[#FDFBF7] h-11 sm:h-12 rounded-full font-serif text-base sm:text-lg tracking-widest shadow-xl shadow-[#A62639]/20 transition-transform active:scale-95"
                                                    >
                                                        {t.enterParty}
                                                        <ChevronRight size={18} />
                                                    </motion.button>
                                                </Link>
                                            </SignedIn>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Graphic - Champagne Toast */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="absolute bottom-2 w-full flex justify-center pointer-events-none pb-2 overflow-visible"
                                >
                                    <div className="relative w-32 h-16 flex justify-center">
                                        {/* Left Glass */}
                                        <motion.svg
                                            width="45" height="60" viewBox="0 0 60 80"
                                            className="absolute left-4"
                                            animate={{ rotate: [0, 5, 0], x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        >
                                            <path d="M10 5 Q10 40 30 40 Q50 40 50 5" fill="none" stroke="#A62639" strokeWidth="1.5" />
                                            <line x1="30" y1="40" x2="30" y2="70" stroke="#A62639" strokeWidth="1.5" />
                                            <line x1="20" y1="70" x2="40" y2="70" stroke="#A62639" strokeWidth="1.5" />
                                            <path d="M15 15 L45 15 Q45 35 30 35 Q15 35 15 15" fill="#A62639" opacity="0.3" />
                                        </motion.svg>

                                        {/* Right Glass */}
                                        <motion.svg
                                            width="45" height="60" viewBox="0 0 60 80"
                                            className="absolute right-4"
                                            animate={{ rotate: [0, -5, 0], x: [0, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
                                        >
                                            <path d="M10 5 Q10 40 30 40 Q50 40 50 5" fill="none" stroke="#A62639" strokeWidth="1.5" />
                                            <line x1="30" y1="40" x2="30" y2="70" stroke="#A62639" strokeWidth="1.5" />
                                            <line x1="20" y1="70" x2="40" y2="70" stroke="#A62639" strokeWidth="1.5" />
                                            <path d="M15 15 L45 15 Q45 35 30 35 Q15 35 15 15" fill="#A62639" opacity="0.3" />
                                        </motion.svg>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 mb-4 text-[9px] uppercase tracking-[0.3em] font-black text-[#A62639]/50 hover:text-[#A62639] transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {t.returnEnvelope}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
