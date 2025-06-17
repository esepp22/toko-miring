// app/admin/dashboard/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonTable from "../components/SkeletonTable";
import StatsSection from "../components/StatsSection";
import BarChartSection from "../components/BarChartSection";
import LineChartSection from "../components/LineChartSection";
import RecentTransactions from "../components/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <Suspense fallback={<SkeletonCard />}>
          <StatsSection />
        </Suspense>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Suspense fallback={<SkeletonCard />}>
            <BarChartSection />
          </Suspense>
          <Suspense fallback={<SkeletonCard />}>
            <LineChartSection />
          </Suspense>
        </div>

        {/* Recent Transactions Table */}
        <Suspense fallback={<SkeletonTable />}>
          <RecentTransactions />
        </Suspense>
      </div>
    </div>
  );
}
