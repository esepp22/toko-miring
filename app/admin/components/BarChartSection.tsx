"use server";

import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import BarChartComponent from "./BarChartComponent";

// Tipe transaksi yang diambil
type TransactionWithProduct = {
  tanggal: Date;
  total_harga: number;
  product: {
    nama_produk: string;
  } | null;
};

export default async function BarChartSection() {
  await new Promise((resolve) => setTimeout(resolve, 5000)); // simulasi delay

  const data = await prisma.transaction.findMany({
    orderBy: { tanggal: "desc" },
    take: 7,
    include: { product: true },
  });

  const dataChart = data
    .map((trx: TransactionWithProduct) => ({
      tanggal: format(new Date(trx.tanggal), "dd MMM"),
      total: trx.total_harga,
      nama: trx.product?.nama_produk
        ? trx.product.nama_produk.slice(0, 10) + "..."
        : "Unknown",
    }))
    .reverse();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Total Revenue</h2>
      <p className="text-gray-500 text-sm mb-2">7 Transaksi Terakhir</p>
      <BarChartComponent data={dataChart} />
    </div>
  );
}
