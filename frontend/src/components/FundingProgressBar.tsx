interface FundingProgressBarProps {
  totalValue: number;
  totalInvested: number;
}

export default function FundingProgressBar({ totalValue, totalInvested }: FundingProgressBarProps) {
  const pct = totalValue > 0 ? Math.min((totalInvested / totalValue) * 100, 100) : 0;
  const remaining = Math.max(totalValue - totalInvested, 0);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>${totalInvested.toLocaleString()} raised</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-500 h-2.5 rounded-full transition-all"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">${remaining.toLocaleString()} remaining</p>
    </div>
  );
}
