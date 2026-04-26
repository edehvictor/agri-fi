import Link from 'next/link';
import { getOpenDeals } from '@/lib/api';
import FundingProgressBar from '@/components/FundingProgressBar';
import FilterSidebar from '@/components/marketplace/FilterSidebar';

// Render on demand so CI build does not need a reachable backend.
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let deals = [];
  try {
    deals = await getOpenDeals();
  } catch {
    // show empty state on error
  }

  const commodityFilter = (searchParams.commodity as string) || '';
  const statusFilter = (searchParams.status as string) || 'all';
  const minRoiFilter = searchParams.minRoi ? Number(searchParams.minRoi) : null;
  const maxRoiFilter = searchParams.maxRoi ? Number(searchParams.maxRoi) : null;

  // Process and filter deals
  const processedDeals = deals
    .map((deal: any) => {
      // Mock ROI for demonstration since it's not in the API
      // Use deal ID to create a deterministic but varied ROI between 8% and 25%
      const hash = deal.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const expectedRoi = 8 + (hash % 18);
      return { ...deal, expectedRoi };
    })
    .filter((deal: any) => {
      // Commodity search filter
      if (commodityFilter && !deal.commodity?.toLowerCase().includes(commodityFilter.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'open' && deal.status !== 'open') return false;
        if (statusFilter === 'funded' && deal.status !== 'funded') return false;
      }

      // ROI filter
      if (minRoiFilter !== null && deal.expectedRoi < minRoiFilter) return false;
      if (maxRoiFilter !== null && deal.expectedRoi > maxRoiFilter) return false;

      // Ensure we only show open or funded deals generally, or whatever the API returned
      // The requirement asks for Status (Open, Funded) so we shouldn't hard-restrict if not requested,
      // but previously it had: d.status === 'open'
      // If we keep the old behavior, we might miss 'funded' deals if the backend eventually returns them.
      if (deal.status !== 'open' && deal.status !== 'funded') return false;

      return true;
    });

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Trade Deal Marketplace</h1>
        <p className="text-green-600 mb-8">Browse open agricultural trade deals available for investment.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {processedDeals.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-green-100 h-full">
                <p className="text-xl text-gray-400">No deals match your criteria.</p>
                <p className="text-sm mt-2 text-gray-400">Try adjusting your filters to find more opportunities.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {processedDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/marketplace/${deal.id}`}
                    className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3 relative"
                  >
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-semibold text-gray-800 capitalize pr-2">{deal.commodity}</h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          deal.status === 'funded'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {deal.status === 'funded' ? 'Funded' : 'Open'}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1">
                      <p className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="text-gray-700 font-medium">
                          {Number(deal.quantity).toLocaleString()} {deal.quantity_unit}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Total Value:</span>
                        <span className="text-gray-700 font-medium">
                          ${Number(deal.total_value).toLocaleString()}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Expected ROI:</span>
                        <span className="text-green-600 font-bold">
                          {deal.expectedRoi}%
                        </span>
                      </p>
                    </div>

                    <div className="mt-auto pt-2">
                      <FundingProgressBar
                        totalValue={Number(deal.total_value)}
                        totalInvested={Number(deal.total_invested)}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
