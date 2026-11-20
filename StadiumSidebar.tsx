import { Search, X } from 'lucide-react';
import { StadiumLocation, VenueCategory, VenueIncident } from '../data/capeCoastStadiumData';

interface StadiumSidebarProps {
  locations: StadiumLocation[];
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: VenueCategory | 'all';
  onCategoryChange: (cat: VenueCategory | 'all') => void;
  selectedLocationId: string | null;
  onSelectLocation: (loc: StadiumLocation) => void;
  incidents: VenueIncident[];
}

export function StadiumSidebar({
  locations,
  totalCount,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  selectedLocationId,
  onSelectLocation,
  incidents,
}: StadiumSidebarProps) {
  const activeIncidentLocIds = new Set(
    incidents.filter((i) => !i.resolved).map((i) => i.locationId)
  );

  return (
    <aside
      aria-label="Stadium Zones and Checkpoints Directory"
      className="flex flex-col h-full bg-[#051C2C] border border-[#0E344D] overflow-hidden"
    >
      <div className="px-3.5 pt-3 pb-2.5 border-b border-[#0E344D] shrink-0 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-[#D5E4EE]">
            Checkpoints, Gates & Stands
          </h2>
          <span className="text-xs font-mono-tabular text-[#82A4BA]">
            {locations.length === totalCount
              ? `${totalCount}`
              : `${locations.length} / ${totalCount}`}
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
            placeholder="Search roads, gates, stands..."
            aria-label="Search stadium gates, checkpoints, and stands"
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

        {/* Category Filter Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#03131E] border border-[#0F354D] rounded">
          {(
            [
              ['all', 'All'],
              ['checkpoint', 'Police'],
              ['gate', 'Gates'],
              ['stand', 'Stands'],
            ] as [VenueCategory | 'all', string][]
          ).map(([key, label]) => {
            const active = categoryFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onCategoryChange(key)}
                className={`py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#0E3F5E] text-[#4EC6B0]'
                    : 'text-[#89AAC0] hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto gis-scroll divide-y divide-[#0D2E44]">
        {locations.length === 0 ? (
          <div className="p-6 text-center space-y-2">
            <p className="text-sm text-[#9AB8CB]">No venue locations match your filter.</p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
              }}
              className="px-3 py-1.5 text-xs font-medium text-[#031420] bg-[#4EC6B0] hover:bg-[#5FD5BF] rounded transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          locations.map((loc) => {
            const isSelected = loc.id === selectedLocationId;
            const hasActiveIncident = activeIncidentLocIds.has(loc.id);

            const categoryColor =
              loc.category === 'checkpoint'
                ? 'text-[#38BDF8]'
                : loc.category === 'gate'
                  ? 'text-[#F5A623]'
                  : 'text-[#4EC6B0]';

            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => onSelectLocation(loc)}
                className={`w-full text-left px-3.5 py-2.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-teal-400 ${
                  isSelected ? 'bg-[#0C3652]' : 'hover:bg-[#08263A]'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`text-xs font-semibold truncate ${categoryColor}`}>
                    {loc.categoryLabel} · {loc.code}
                  </span>
                  {hasActiveIncident && (
                    <span className="text-[11px] font-semibold text-[#EF4444] animate-pulse shrink-0">
                      Alert
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#DCE8F0] leading-snug mt-0.5 font-medium">
                  {loc.name}
                </p>
                <p className="text-[11px] text-[#7DA0B6] mt-0.5 truncate">
                  {loc.personnelCount} officers · {loc.screenedCount.toLocaleString()} screened
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
