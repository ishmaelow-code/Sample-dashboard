import { Search, X } from 'lucide-react';
import { PollingStation } from '../data/constituencyData';

interface PollingStationsSidebarProps {
  stations: PollingStation[];
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStationId: string | null;
  onSelectStation: (station: PollingStation) => void;
  selectedAreaName: string | null;
  onClearAreaFilter: () => void;
}

export function PollingStationsSidebar({
  stations,
  totalCount,
  searchQuery,
  onSearchChange,
  selectedStationId,
  onSelectStation,
  selectedAreaName,
  onClearAreaFilter,
}: PollingStationsSidebarProps) {
  return (
    <aside
      aria-label="Polling Stations Directory"
      className="flex flex-col h-full bg-[#051C2C] border border-[#0E344D] overflow-hidden"
    >
      {/* Header & Search */}
      <div className="px-3.5 pt-3 pb-2.5 border-b border-[#0E344D] shrink-0 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-[#D5E4EE]">Polling Stations</h2>
          <span className="text-xs font-mono-tabular text-[#82A4BA]">
            {stations.length === totalCount
              ? `${totalCount}`
              : `${stations.length} / ${totalCount}`}
          </span>
        </div>

        <div className="relative">
          <Search
            className="w-4 h-4 text-[#698CA3] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            aria-label="Search polling stations or electoral areas"
            className="w-full h-8 pl-8 pr-7 bg-[#03131E] border border-[#123D59] rounded text-xs text-[#E4EFF6] placeholder:text-[#5F8299] focus:outline-none focus:border-[#4EC6B0] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7BA0B7] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {selectedAreaName && (
          <div className="flex items-center justify-between text-xs text-[#9AC0D6] pt-0.5">
            <span className="truncate">Area: {selectedAreaName}</span>
            <button
              type="button"
              onClick={onClearAreaFilter}
              className="text-[#F5A623] hover:underline whitespace-nowrap shrink-0 ml-2 cursor-pointer"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Stations List */}
      <div className="flex-1 overflow-y-auto gis-scroll divide-y divide-[#0D2E44]">
        {stations.length === 0 ? (
          <div className="p-6 text-center space-y-2">
            <p className="text-sm text-[#9AB8CB]">No polling stations match your filter.</p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onClearAreaFilter();
              }}
              className="px-3 py-1.5 text-xs font-medium text-[#031420] bg-[#4EC6B0] hover:bg-[#5FD5BF] rounded transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          stations.map((station) => {
            const isSelected = station.id === selectedStationId;
            return (
              <button
                key={station.id}
                type="button"
                onClick={() => onSelectStation(station)}
                className={`w-full text-left px-3.5 py-2.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-teal-400 ${
                  isSelected
                    ? 'bg-[#0C3652]'
                    : 'hover:bg-[#08263A]'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-semibold text-[#F5A623] leading-snug truncate">
                    {station.electoralAreaName}
                  </span>
                  {station.status === 'Incident' && (
                    <span className="text-[11px] font-medium text-[#F05248] shrink-0">
                      Incident
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#DCE8F0] leading-snug mt-0.5">
                  {station.name}
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
