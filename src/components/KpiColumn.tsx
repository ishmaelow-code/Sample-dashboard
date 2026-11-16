interface KpiColumnProps {
  primaryLabel: string;
  primaryValue: number;
  primaryTotal?: number;
  secondaryLabel: string;
  secondaryValue: number;
  incidentsCount: number;
  suspectsCount: number;
  isFiltered: boolean;
  onResetFilter: () => void;
  onOpenIncidents: () => void;
}

export function KpiColumn({
  primaryLabel,
  primaryValue,
  primaryTotal,
  secondaryLabel,
  secondaryValue,
  incidentsCount,
  suspectsCount,
  isFiltered,
  onResetFilter,
  onOpenIncidents,
}: KpiColumnProps) {
  return (
    <aside
      aria-label="Key Operations Metrics"
      className="h-full grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-4 gap-2"
    >
      {/* 1. Primary Metric */}
      <button
        type="button"
        onClick={isFiltered ? onResetFilter : undefined}
        disabled={!isFiltered}
        title={isFiltered ? 'Click to reset active filter' : primaryLabel}
        className={`bg-[#051C2C] border border-[#0E344D] px-4 py-3 flex flex-col items-center justify-center text-center transition-colors ${
          isFiltered ? 'hover:bg-[#08273C] cursor-pointer' : 'cursor-default'
        }`}
      >
        <span className="text-base sm:text-lg xl:text-[23px] font-medium text-[#EAB32B] leading-tight">
          {primaryLabel}
        </span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-mono-tabular text-4xl sm:text-5xl xl:text-[60px] font-medium text-[#C8D8E4] leading-none tracking-tight">
            {primaryValue}
          </span>
          {isFiltered && primaryTotal !== undefined && (
            <span className="font-mono-tabular text-sm text-[#7FA1B8]">
              /{primaryTotal}
            </span>
          )}
        </div>
      </button>

      {/* 2. Secondary Metric */}
      <div className="bg-[#051C2C] border border-[#0E344D] px-4 py-3 flex flex-col items-center justify-center text-center">
        <span className="text-base sm:text-lg xl:text-[23px] font-medium text-[#EAB32B] leading-tight">
          {secondaryLabel}
        </span>
        <span className="mt-1 font-mono-tabular text-4xl sm:text-5xl xl:text-[60px] font-medium text-[#C8D8E4] leading-none tracking-tight">
          {secondaryValue}
        </span>
      </div>

      {/* 3. Incidents */}
      <button
        type="button"
        onClick={onOpenIncidents}
        className="bg-[#051C2C] border border-[#0E344D] hover:border-[#1E5374] hover:bg-[#072337] px-4 py-3 flex flex-col items-center justify-center text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        title="View or log field incidents"
      >
        <span className="text-base sm:text-lg xl:text-[23px] font-medium text-[#EAB32B] leading-tight">
          Incidents
        </span>
        <span
          className="mt-1 font-mono-tabular text-4xl sm:text-5xl xl:text-[60px] font-semibold text-[#EB5248] leading-none tracking-tight"
          style={{ textShadow: '0 0 10px rgba(235, 82, 72, 0.25)' }}
        >
          {incidentsCount}
        </span>
      </button>

      {/* 4. Suspects */}
      <button
        type="button"
        onClick={onOpenIncidents}
        className="bg-[#051C2C] border border-[#0E344D] hover:border-[#1E5374] hover:bg-[#072337] px-4 py-3 flex flex-col items-center justify-center text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        title="View or log suspect records"
      >
        <span className="text-base sm:text-lg xl:text-[23px] font-medium text-[#EAB32B] leading-tight">
          Suspects
        </span>
        <div className="mt-2 flex items-center justify-center gap-4">
          <svg
            viewBox="0 0 64 64"
            className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 text-[#DCE4EA] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="19" cy="39" r="10.5" />
            <path d="M23.5 29.5 L26 24.5" />
            <path d="M26 24.5 C29 21 34 21 36.5 24" strokeWidth="3.5" />
            <path d="M35 28 L37.5 32.5" />
            <circle cx="44" cy="43" r="10.5" />
            <circle cx="19" cy="39" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="44" cy="43" r="1.6" fill="currentColor" stroke="none" />
          </svg>
          <span
            className="font-mono-tabular text-4xl sm:text-5xl xl:text-[60px] font-semibold text-[#EB5248] leading-none tracking-tight"
            style={{ textShadow: '0 0 10px rgba(235, 82, 72, 0.25)' }}
          >
            {suspectsCount}
          </span>
        </div>
      </button>
    </aside>
  );
}
