import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatMediaUrl(url: string | null) {
    if (!url) return "";
    return url.replace(
        "https://nautical-iguana-162.eu-west-1.convex.cloud/api/storage/",
        "https://nautical-iguana-162.eu-west-1.convex.site/getMedia?storageId="
    );
}

