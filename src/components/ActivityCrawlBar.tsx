import { ActivityStage } from '../data/capeCoastStadiumData';
import { SlidersHorizontal } from 'lucide-react';

interface ActivityCrawlBarProps {
  stages: ActivityStage[];
  onManageStages: () => void;
}

export function ActivityCrawlBar({
  stages,
  onManageStages,
}: ActivityCrawlBarProps) {
  const activeStages = stages.filter((s) => s.active);
  const displayStages =
    activeStages.length > 0
      ? activeStages
      : [
          {
            id: 'fallback',
            stageLabel: 'STANDBY',
            message: 'No active Congress stage announcements configured.',
            active: true,
          },
        ];

  return (
    <div
      aria-label="Live Congress Activity Stage Ticker"
      className="h-9 shrink-0 bg-[#041826] border-t border-[#103D58] flex items-center overflow-hidden select-none"
    >
      {/* Left Label */}
      <div className="h-full px-3.5 bg-[#0A2F47] border-r border-[#144B6B] flex items-center shrink-0">
        <span className="text-[11px] font-semibold tracking-wider text-[#F5A623] uppercase whitespace-nowrap">
          Congress Stage Feed
        </span>
      </div>

      {/* Crawling Text Viewport */}
      <div className="flex-1 min-w-0 h-full flex items-center overflow-hidden crawl-container">
        <div className="animate-crawl flex items-center">
          {[0, 1].map((dupIdx) => (
            <div key={dupIdx} className="flex items-center shrink-0">
              {displayStages.map((stage) => (
                <div
                  key={`${dupIdx}-${stage.id}`}
                  className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap"
                >
                  <span className="text-[11px] font-mono-tabular font-semibold text-[#4EC6B0]">
                    {stage.stageLabel}
                  </span>
                  <span className="text-[#457491]" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-xs text-[#E4F0F7] font-medium">
                    {stage.message}
                  </span>
                  <span className="text-[#275A78] pl-4" aria-hidden="true">
                    ///
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Manage Stages Button */}
      <button
        type="button"
        onClick={onManageStages}
        title="Configure crawling stage announcements"
        className="h-full px-3 bg-[#062234] hover:bg-[#0B334D] border-l border-[#144B6B] text-[11px] font-medium text-[#A9CADC] hover:text-white inline-flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer whitespace-nowrap"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#4EC6B0]" aria-hidden="true" />
        <span className="hidden sm:inline">Update Stages</span>
      </button>
    </div>
  );
}
