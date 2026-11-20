import { useState } from 'react';
import { StadiumLocation } from '../data/capeCoastStadiumData';

interface StadiumPersonnelChartProps {
  locations: StadiumLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: StadiumLocation) => void;
}

export function StadiumPersonnelChart({
  locations,
  selectedLocationId,
  onSelectLocation,
}: StadiumPersonnelChartProps) {
  const [metric, setMetric] = useState<'personnel' | 'screened'>('personnel');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Show the 11 checkpoints & barricaded gates in the 11-column bar chart
  const chartItems = locations.filter(
    (l) => l.category === 'checkpoint' || l.category === 'gate'
  );

  const maxValue = metric === 'personnel' ? 20 : 1600;
  const midValue = maxValue / 2;
  const chartHeight = 90;

  return (
    <section
      aria-label="Police Checkpoints and Barricaded Gates Deployment Chart"
      className="h-full bg-[#051C2C] border border-[#0E344D] px-3.5 py-2.5 flex flex-col justify-between overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 shrink-0">
        <h2 className="text-sm font-medium text-[#D5E4EE]">
          {metric === 'personnel'
            ? '# Police & Security Officers / Checkpoint & Gate'
            : '# Vehicles & Persons Screened / Checkpoint & Gate'}
        </h2>

        <div className="flex items-center gap-1 p-0.5 bg-[#03131E] border border-[#103852] rounded shrink-0">
          <button
            type="button"
            onClick={() => setMetric('personnel')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
              metric === 'personnel'
                ? 'bg-[#0E3F5E] text-[#4EC6B0]'
                : 'text-[#89AAC0] hover:text-white'
            }`}
          >
            Officers
          </button>
          <button
            type="button"
            onClick={() => setMetric('screened')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
              metric === 'screened'
                ? 'bg-[#0E3F5E] text-[#4EC6B0]'
                : 'text-[#89AAC0] hover:text-white'
            }`}
          >
            Screened
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-stretch pt-2 pb-1">
        {/* Y-Axis Labels */}
        <div
          className="flex flex-col justify-between pr-2 text-right font-mono-tabular text-[11px] text-[#8AA7BA] select-none shrink-0"
          style={{ height: `${chartHeight}px` }}
        >
          <span>{maxValue}</span>
          <span>{midValue}</span>
          <span>0</span>
        </div>

        {/* Plot Area + X-Axis */}
        <div className="flex-1 flex flex-col min-w-0">
          <div
            className="relative w-full border-l border-b border-[#254962]"
            style={{ height: `${chartHeight}px` }}
          >
            <div className="absolute inset-x-0 top-0 border-t border-[#18384F] pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 border-t border-[#18384F] pointer-events-none" />

            <div className="relative z-10 h-full grid grid-cols-11 gap-1.5 sm:gap-2.5 px-1.5 sm:px-3 items-end">
              {chartItems.map((loc) => {
                const value =
                  metric === 'personnel' ? loc.personnelCount : loc.screenedCount;
                const heightPct = Math.min(100, (value / maxValue) * 100);
                const isSelected = selectedLocationId === loc.id;
                const isHovered = hoveredId === loc.id;

                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => onSelectLocation(loc)}
                    onMouseEnter={() => setHoveredId(loc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-label={`${loc.name}: ${value}`}
                    className="group relative h-full flex flex-col justify-end items-center cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400"
                  >
                    <span
                      className={`font-mono-tabular text-[10px] sm:text-[11px] mb-1 transition-colors ${
                        isSelected
                          ? 'text-[#F5A623] font-semibold'
                          : isHovered
                            ? 'text-white font-semibold'
                            : 'text-[#C8DBE8]'
                      }`}
                    >
                      {value}
                    </span>

                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[60px] transition-all duration-150 ${
                        isSelected
                          ? 'bg-[#F5A623]'
                          : isHovered
                            ? 'bg-[#63DAC3]'
                            : loc.category === 'checkpoint'
                              ? 'bg-[#38BDF8]'
                              : 'bg-[#48BEA9]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-11 gap-1.5 sm:gap-2.5 px-1.5 sm:px-3 pt-1">
            {chartItems.map((loc) => {
              const isSelected = selectedLocationId === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => onSelectLocation(loc)}
                  className={`text-center text-[10px] leading-[1.12] transition-colors cursor-pointer truncate whitespace-pre-line ${
                    isSelected
                      ? 'text-[#F5A623] font-semibold'
                      : 'text-[#B5CCD9] hover:text-white'
                  }`}
                  title={loc.name}
                >
                  {loc.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
