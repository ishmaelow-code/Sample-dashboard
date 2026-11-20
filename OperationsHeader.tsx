import { Menu, RotateCcw } from 'lucide-react';

export type DashboardMode = 'stadium' | 'constituency';

interface OperationsHeaderProps {
  mode: DashboardMode;
  onChangeMode: (mode: DashboardMode) => void;
  selectedFilterLabel: string | null;
  onClearFilter: () => void;
  onOpenDrawer: () => void;
}

export function OperationsHeader({
  mode,
  onChangeMode,
  selectedFilterLabel,
  onClearFilter,
  onOpenDrawer,
}: OperationsHeaderProps) {
  const title =
    mode === 'stadium'
      ? 'CAPE COAST SPORTS STADIUM CONGRESS 2026 OPERATIONS DASHBOARD'
      : 'AYAWASO EAST CONSTITUENCY BY-ELECTION 2026 OPERATIONS DASHBOARD';

  return (
    <header className="h-12 shrink-0 bg-[#062438] border-b border-[#0E3954] px-4 flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wide text-[#EBF3F9] truncate uppercase">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {selectedFilterLabel && (
          <button
            type="button"
            onClick={onClearFilter}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#F5B041] bg-[#0B314A] hover:bg-[#10405F] border border-[#1E5374] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            title="Clear active filter"
          >
            <span>Filtered: {selectedFilterLabel}</span>
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}

        {/* Dashboard Sample Switcher */}
        <div
          className="flex items-center gap-1 p-0.5 bg-[#03131E] border border-[#12415E] rounded shrink-0"
          role="tablist"
          aria-label="Select operations dashboard"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'stadium'}
            onClick={() => onChangeMode('stadium')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'stadium'
                ? 'bg-[#0E3F5E] text-[#4EC6B0]'
                : 'text-[#89AAC0] hover:text-white'
            }`}
          >
            Cape Coast Stadium
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'constituency'}
            onClick={() => onChangeMode('constituency')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'constituency'
                ? 'bg-[#0E3F5E] text-[#4EC6B0]'
                : 'text-[#89AAC0] hover:text-white'
            }`}
          >
            Ayawaso East
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open operations menu"
          title="Operations console, incident alerts & export"
          className="p-2 rounded text-[#C5D8E6] hover:text-white hover:bg-[#0B3550] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
