"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Inbox,
  Layers3,
  PackageCheck,
} from "lucide-react";
import {
  getDashboardData,
  type DashboardData,
} from "@/features/dashboard/dashboardApi";

function getAvailabilityLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isOutOfStock(value: string) {
  return value.toLowerCase().replaceAll(" ", "_").replaceAll("-", "_") === "out_of_stock";
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminDashboardClient() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardData()
      .then(setDashboard)
      .catch((caughtError: Error) => setError(caughtError.message));
  }, []);

  if (error) {
    return (
      <p className="rounded-[8px] border border-[#f4c7c7] bg-[#fff1f1] px-5 py-4 text-[14px] font-bold text-[#9b1c1c]">
        {error}
      </p>
    );
  }

  if (!dashboard) {
    return (
      <p className="rounded-[8px] border border-[#dfeadd] bg-white px-5 py-4 text-[14px] font-bold text-[#31583d]">
        Loading dashboard data...
      </p>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: dashboard.stats.products,
      detail: `${dashboard.stats.activeProducts} active`,
      icon: Boxes,
    },
    {
      label: "Categories",
      value: dashboard.stats.categories,
      detail: "Active categories",
      icon: Layers3,
    },
    {
      label: "Messages",
      value: dashboard.stats.messages,
      detail: `${dashboard.stats.unreadMessages} unread`,
      icon: Inbox,
    },
    {
      label: "Available Stock",
      value: dashboard.stats.availableProducts,
      detail: `${dashboard.stats.comingSoonProducts} coming soon, ${dashboard.stats.outOfStockProducts} out`,
      icon: PackageCheck,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-[8px] border border-[#dfeadd] bg-white p-4 shadow-[0_10px_24px_rgba(49,88,61,0.06)] sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[14px] font-bold text-[#667167]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-[30px] font-bold leading-none text-[#10221f] sm:text-[34px]">
                    {item.value}
                  </p>
                  <p className="mt-3 text-[13px] font-bold text-[#5a9a4a]">
                    {item.detail}
                  </p>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#edf6ea] text-[#31583d]">
                  <Icon size={21} strokeWidth={2.2} />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
          <div className="border-b border-[#e4eee6] px-5 py-4">
            <h2 className="text-[20px] font-bold text-[#10221f]">
              Latest Products
            </h2>
          </div>
          <div className="divide-y divide-[#edf2ea] sm:hidden">
            {dashboard.latestProducts.map((product) => (
              <article key={product.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-bold text-[#10221f]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-[13px] font-medium text-[#667167]">
                      {product.category}
                    </p>
                  </div>
                  <p className="shrink-0 text-[14px] font-bold text-[#31583d]">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf6ea] px-3 py-1 text-[12px] font-bold text-[#31583d]">
                    {isOutOfStock(product.availability) ? (
                      <AlertTriangle size={14} />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    {getAvailabilityLabel(product.availability)}
                  </span>
                  <span className="rounded-full bg-[#fbfdf8] px-3 py-1 text-[12px] font-bold text-[#667167] ring-1 ring-[#dfe8dd]">
                    {formatDate(product.createdAt)}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-[#fbfdf8] text-[13px] font-bold uppercase text-[#667167]">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2ea] text-[14px]">
                {dashboard.latestProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-4 font-bold text-[#10221f]">
                      {product.name}
                    </td>
                    <td className="px-5 py-4 font-medium text-[#667167]">
                      {product.category}
                    </td>
                    <td className="px-5 py-4 font-bold text-[#31583d]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf6ea] px-3 py-1 text-[12px] font-bold text-[#31583d]">
                        {isOutOfStock(product.availability) ? (
                          <AlertTriangle size={14} />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        {getAvailabilityLabel(product.availability)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#667167]">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {dashboard.latestProducts.length === 0 ? (
            <p className="px-5 py-8 text-center text-[15px] font-medium text-[#667167]">
              No products in the database yet.
            </p>
          ) : null}
        </div>

        <div className="rounded-[8px] border border-[#dfeadd] bg-white shadow-[0_10px_24px_rgba(49,88,61,0.06)]">
          <div className="border-b border-[#e4eee6] px-5 py-4">
            <h2 className="text-[20px] font-bold text-[#10221f]">
              Recent Messages
            </h2>
          </div>
          <div className="divide-y divide-[#edf2ea]">
            {dashboard.recentMessages.map((message) => (
              <div key={message.id} className="px-4 py-4 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[#10221f]">{message.name}</p>
                    <p className="mt-1 break-all text-[13px] font-medium text-[#667167]">
                      {message.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#fbfdf8] px-3 py-1 text-[12px] font-bold text-[#31583d] ring-1 ring-[#dfe8dd]">
                    {message.status}
                  </span>
                </div>
                <p className="mt-3 text-[14px] font-bold text-[#1f3025]">
                  {message.subject}
                </p>
                <p className="mt-2 text-[13px] font-medium text-[#667167]">
                  {formatDate(message.createdAt)}
                </p>
              </div>
            ))}
            {dashboard.recentMessages.length === 0 ? (
              <p className="px-5 py-8 text-center text-[15px] font-medium text-[#667167]">
                No messages in the database yet.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
