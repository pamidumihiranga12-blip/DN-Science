import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rs. ${num.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
    case "delivered":
      return "text-green-600 bg-green-50 border-green-200";
    case "pending":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "rejected":
    case "cancelled":
      return "text-red-600 bg-red-50 border-red-200";
    case "confirmed":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "shipped":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "suspended":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}
