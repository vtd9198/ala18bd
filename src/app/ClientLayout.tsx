"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import UploadDrawer from "@/components/UploadDrawer";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isInvitationPage = pathname === "/";

    return (
        <div className={`mx-auto min-h-[100dvh] bg-background relative flex flex-col overflow-x-hidden ${isInvitationPage ? 'w-full max-w-none' : 'max-w-md shadow-2xl'}`}>
            <main className={`flex-1 ${!isInvitationPage ? 'pb-24' : ''}`}>
                {children}
            </main>
            {!isInvitationPage && <BottomNav />}
            {!isInvitationPage && <UploadDrawer />}
        </div>
    );
}
