import { useState } from 'react';
import { ElectoralArea } from '../data/constituencyData';

interface ElectoralAreaChartProps {
  areas: ElectoralArea[];
  selectedAreaId: string | null;
  onSelectArea: (areaId: string) => void;
  stationCounts: Record<string, number>;
}

export function ElectoralAreaChart({
  areas,
  selectedAreaId,
  onSelectArea,
  stationCounts,
}: ElectoralAreaChartProps) {
  const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);

  const maxValue = 20;
  const chartHeight = 96;

  return (
    <section
      aria-label="Polling Stations per Electoral Area"
      className="h-full bg-[#051C2C] border border-[#0E344D] px-3.5 py-2.5 flex flex-col justify-between overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 shrink-0">
        <h2 className="text-sm font-medium text-[#D5E4EE]">
          # Polling Stations/Electoral Area
        </h2>
        {selectedAreaId && (
          <button
            type="button"
            onClick={() => onSelectArea(selectedAreaId)}
            className="text-xs text-[#F5A623] hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            Clear selection
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 flex items-stretch pt-2 pb-1">
        {/* Y-Axis Labels */}
        <div
          className="flex flex-col justify-between pr-2 text-right font-mono-tabular text-[11px] text-[#8AA7BA] select-none shrink-0"
          style={{ height: `${chartHeight}px` }}
        >
          <span>20</span>
          <span>10</span>
          <span>0</span>
        </div>

        {/* Plot Area + X-Axis */}
        <div className="flex-1 flex flex-col min-w-0">
          <div
            className="relative w-full border-l border-b border-[#254962]"
            style={{ height: `${chartHeight}px` }}
          >
            {/* Horizontal grid lines at 20, 10, 0 */}
            <div className="absolute inset-x-0 top-0 border-t border-[#18384F] pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 border-t border-[#18384F] pointer-events-none" />

            {/* Bars Grid */}
            <div className="relative z-10 h-full grid grid-cols-11 gap-1.5 sm:gap-2.5 px-1.5 sm:px-3 items-end">
              {areas.map((area) => {
                const count = stationCounts[area.id] ?? area.expectedCount;
                const heightPct = Math.min(100, (count / maxValue) * 100);
                const isSelected = selectedAreaId === area.id;
                const isHovered = hoveredAreaId === area.id;
                const isDimmed = selectedAreaId !== null && !isSelected;

                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => onSelectArea(area.id)}
                    onMouseEnter={() => setHoveredAreaId(area.id)}
                    onMouseLeave={() => setHoveredAreaId(null)}
                    aria-label={`${area.name}: ${count} polling stations`}
                    aria-pressed={isSelected}
                    className="group relative h-full flex flex-col justify-end items-center cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400"
                  >
                    {/* Value Label above bar */}
                    <span
                      className={`font-mono-tabular text-[11px] mb-1 transition-colors ${
                        isSelected
                          ? 'text-[#F5A623] font-semibold'
                          : isHovered
                            ? 'text-white font-semibold'
                            : isDimmed
                              ? 'text-[#67869A]'
                              : 'text-[#C8DBE8]'
                      }`}
                    >
                      {count}
                    </span>

                    {/* Bar Column */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[64px] transition-all duration-150 ${
                        isSelected
                          ? 'bg-[#F5A623]'
                          : isHovered
                            ? 'bg-[#63DAC3]'
                            : isDimmed
                              ? 'bg-[#286366] opacity-55'
                              : 'bg-[#48BEA9]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="grid grid-cols-11 gap-1.5 sm:gap-2.5 px-1.5 sm:px-3 pt-1.5">
            {areas.map((area) => {
              const isSelected = selectedAreaId === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => onSelectArea(area.id)}
                  className={`text-center text-[10px] sm:text-[11px] leading-[1.15] transition-colors cursor-pointer truncate whitespace-pre-line ${
                    isSelected
                      ? 'text-[#F5A623] font-semibold'
                      : 'text-[#B5CCD9] hover:text-white'
                  }`}
                  title={area.name}
                >
                  {area.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
