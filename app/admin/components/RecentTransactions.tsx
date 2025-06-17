import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";

type TransactionWithCustomerProduct = Prisma.TransactionGetPayload<{
  include: { customer: true; product: true };
}>;

function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

export default async function RecentTransactions() {
  // Hindari delay saat query, lebih baik pakai skeleton loading
  let transaksiTerbaru: TransactionWithCustomerProduct[] = [];

  try {
    transaksiTerbaru = await prisma.transaction.findMany({
      orderBy: { tanggal: "desc" },
      take: 5,
      include: {
        customer: true,
        product: true,
      },
    });
  } catch (error) {
    console.error("Gagal mengambil transaksi terbaru:", error);
    // Optional: tampilkan error UI atau fallback kosong
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Transaksi Terbaru</h2>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Tanggal</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Produk</th>
            <th className="px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {transaksiTerbaru.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Tidak ada transaksi ditemukan.
              </td>
            </tr>
          ) : (
            transaksiTerbaru.map((transaksi) => (
              <tr key={transaksi.id_transaksi} className="border-t">
                <td className="px-4 py-2">
                  {format(new Date(transaksi.tanggal), "dd MMM yyyy")}
                </td>
                <td className="px-4 py-2">
                  {transaksi.customer?.nama_customer ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {transaksi.product?.nama_produk ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {formatRupiah(transaksi.total_harga)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
