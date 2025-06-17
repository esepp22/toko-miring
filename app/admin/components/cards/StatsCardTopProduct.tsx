// app/admin/components/cards/StatsCardTopProduct.tsx
import { prisma } from "@/lib/prisma";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
export default async function StatsCardTopProduct() {
    await delay(5000); // Bisa 0, untuk instant

  const topSelling = await prisma.transaction.groupBy({
    by: ["id_produk"],
    _count: { id_transaksi: true },
    orderBy: {
      _count: { id_transaksi: "desc" },
    },
    take: 1,
  });

  const topProduct = topSelling[0]
    ? await prisma.product.findUnique({
        where: { id_produk: topSelling[0].id_produk },
      })
    : null;

  const productName = topProduct?.nama_produk || "Belum ada data";
  const totalSold = topSelling[0]?._count.id_transaksi ?? 0;

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h3 className="text-gray-500 text-sm font-medium">Produk Terlaris</h3>
      <p className="text-lg font-semibold text-gray-800 mt-1">{productName}</p>
      <p className="text-sm text-gray-600 mt-1">{totalSold} penjualan</p>
    </div>
  );
}
