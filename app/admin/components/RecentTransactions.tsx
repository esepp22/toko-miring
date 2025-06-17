import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import type { Transaction, Customer, Product } from "@prisma/client";

type TransactionWithCustomerProduct = Transaction & {
  customer: Customer;
  product: Product;
};

function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

export default async function RecentTransactions() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const transaksiTerbaru: TransactionWithCustomerProduct[] =
    await prisma.transaction.findMany({
      orderBy: { tanggal: "desc" },
      take: 5,
      include: {
        customer: true,
        product: true,
      },
    });

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
          {transaksiTerbaru.map((transaksi) => (
            <tr key={transaksi.id_transaksi} className="border-t">
              <td className="px-4 py-2">
                {format(new Date(transaksi.tanggal), "dd MMM yyyy")}
              </td>
              <td className="px-4 py-2">{transaksi.customer.nama_customer}</td>
              <td className="px-4 py-2">{transaksi.product.nama_produk}</td>
              <td className="px-4 py-2">
                {formatRupiah(transaksi.total_harga)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
