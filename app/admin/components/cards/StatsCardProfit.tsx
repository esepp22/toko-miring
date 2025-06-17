// app/admin/components/cards/StatsCardProfit.tsx
import StatsCard from "../StatsCard";
import { prisma } from "@/lib/prisma";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default async function StatsCardProfit() {
  await delay(5000); // Bisa 0, untuk instant

  const profit = await prisma.transaction.aggregate({
    _sum: {
      total_harga: true,
    },
  });

  return (
    <StatsCard
      title="Total Profit"
      value={`Rp ${profit._sum.total_harga?.toLocaleString("id-ID") || "0"}`}
      percentage="4.35%" // Optional: bisa diganti dinamis
      isPositive={true}
    />
  );
}
