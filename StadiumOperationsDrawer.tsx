import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Radio,
} from 'lucide-react';
import {
  ActivityStage,
  StadiumLocation,
  VenueIncident,
} from '../data/capeCoastStadiumData';

interface StadiumOperationsDrawerProps {
  open: boolean;
  initialTab?: 'incidents' | 'stages';
  onClose: () => void;
  locations: StadiumLocation[];
  preselectedLocation: StadiumLocation | null;
  incidents: VenueIncident[];
  onAddIncident: (incident: Omit<VenueIncident, 'id' | 'timestamp'>) => void;
  onToggleIncidentResolved: (id: string) => void;
  onDeleteIncident: (id: string) => void;
  stages: ActivityStage[];
  onToggleStage: (id: string) => void;
  onAddStage: (stageLabel: string, message: string) => void;
  onDeleteStage: (id: string) => void;
  onExportCsv: () => void;
}

export function StadiumOperationsDrawer({
  open,
  initialTab = 'incidents',
  onClose,
  locations,
  preselectedLocation,
  incidents,
  onAddIncident,
  onToggleIncidentResolved,
  onDeleteIncident,
  stages,
  onToggleStage,
  onAddStage,
  onDeleteStage,
  onExportCsv,
}: StadiumOperationsDrawerProps) {
  const [activeTab, setActiveTab] = useState<'incidents' | 'stages'>(initialTab);

  // Incident form state
  const [locationId, setLocationId] = useState(
    preselectedLocation?.id ?? locations[0]?.id ?? ''
  );
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [suspectsCount, setSuspectsCount] = useState(0);
  const [notes, setNotes] = useState('');

  // Stage crawl form state
  const [stageLabel, setStageLabel] = useState('STAGE 05 · COLLATION');
  const [stageMessage, setStageMessage] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, open]);

  useEffect(() => {
    if (preselectedLocation) {
      setLocationId(preselectedLocation.id);
    }
  }, [preselectedLocation]);

  if (!open) return null;

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = locations.find((l) => l.id === locationId);
    if (!loc || !title.trim()) return;

    onAddIncident({
      title: title.trim(),
      locationId: loc.id,
      locationName: loc.name,
      categoryLabel: loc.categoryLabel,
      severity,
      suspectsCount: Math.max(0, Number(suspectsCount) || 0),
      notes: notes.trim(),
      resolved: false,
    });

    setTitle('');
    setSuspectsCount(0);
    setNotes('');
  };

  const handleStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageLabel.trim() || !stageMessage.trim()) return;
    onAddStage(stageLabel.trim().toUpperCase(), stageMessage.trim());
    setStageMessage('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Cape Coast Stadium Operations & Stage Console"
    >
      <div className="w-full max-w-md h-full bg-[#051B2A] border-l border-[#12415E] flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-4 py-3.5 border-b border-[#103852] flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">
              Cape Coast Stadium Operations
            </h2>
            <p className="text-xs text-[#88AAC0] mt-0.5">
              Blinking incident alerts, activity stage crawl & venue export
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close operations drawer"
            className="p-1.5 text-[#88AAC0] hover:text-white hover:bg-[#0D324B] rounded cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="px-4 pt-3 pb-2 border-b border-[#103852] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#03131E] border border-[#103852] rounded">
            <button
              type="button"
              onClick={() => setActiveTab('incidents')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'incidents'
                  ? 'bg-[#0E3F5E] text-[#4EC6B0]'
                  : 'text-[#89AAC0] hover:text-white'
              }`}
            >
              Incidents ({incidents.filter((i) => !i.resolved).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stages')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'stages'
                  ? 'bg-[#0E3F5E] text-[#4EC6B0]'
                  : 'text-[#89AAC0] hover:text-white'
              }`}
            >
              Crawling Stages ({stages.filter((s) => s.active).length})
            </button>
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#031420] bg-[#4EC6B0] hover:bg-[#5FD5BF] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>CSV</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto gis-scroll p-4 space-y-6">
          {activeTab === 'incidents' ? (
            <>
              <form
                onSubmit={handleIncidentSubmit}
                className="space-y-3 pb-5 border-b border-[#103852]"
              >
                <h3 className="text-sm font-semibold text-[#F5A623]">
                  Record Incident (Spawns Blinking Map Marker)
                </h3>

                <div>
                  <label
                    htmlFor="venue-loc"
                    className="block text-xs text-[#9BBCD0] mb-1"
                  >
                    Checkpoint, Gate, or Stand
                  </label>
                  <select
                    id="venue-loc"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full h-9 px-2.5 bg-[#03131E] border border-[#144361] rounded text-xs text-[#E4EFF6] focus:outline-none focus:border-[#4EC6B0]"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.code} · {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="venue-inc-title"
                    className="block text-xs text-[#9BBCD0] mb-1"
                  >
                    Incident Description
                  </label>
                  <input
                    id="venue-inc-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Prohibited item found during vehicle search"
                    className="w-full h-9 px-2.5 bg-[#03131E] border border-[#144361] rounded text-xs text-[#E4EFF6] placeholder:text-[#587C94] focus:outline-none focus:border-[#4EC6B0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="venue-inc-severity"
                      className="block text-xs text-[#9BBCD0] mb-1"
                    >
                      Severity
                    </label>
                    <select
                      id="venue-inc-severity"
                      value={severity}
                      onChange={(e) =>
                        setSeverity(e.target.value as 'Low' | 'Medium' | 'High')
                      }
                      className="w-full h-9 px-2.5 bg-[#03131E] border border-[#144361] rounded text-xs text-[#E4EFF6] focus:outline-none focus:border-[#4EC6B0]"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="venue-inc-suspects"
                      className="block text-xs text-[#9BBCD0] mb-1"
                    >
                      Suspects Detained
                    </label>
                    <input
                      id="venue-inc-suspects"
                      type="number"
                      min={0}
                      max={50}
                      value={suspectsCount}
                      onChange={(e) => setSuspectsCount(Number(e.target.value))}
                      className="w-full h-9 px-2.5 bg-[#03131E] border border-[#144361] rounded text-xs font-mono-tabular text-[#E4EFF6] focus:outline-none focus:border-[#4EC6B0]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="venue-inc-notes"
                    className="block text-xs text-[#9BBCD0] mb-1"
                  >
                    Officer Action / Search Notes
                  </label>
                  <textarea
                    id="venue-inc-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Police dispatch or containment notes..."
                    className="w-full p-2.5 bg-[#03131E] border border-[#144361] rounded text-xs text-[#E4EFF6] placeholder:text-[#587C94] focus:outline-none focus:border-[#4EC6B0]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-9 inline-flex items-center justify-center gap-1.5 bg-[#EAB32B] hover:bg-[#F5BE38] text-[#031420] text-xs font-semibold rounded transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Log Blinking Incident</span>
                </button>
              </form>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#E4EFF6]">
                    Venue Incident Feed
                  </h3>
                  <span className="text-xs font-mono-tabular text-[#88AAC0]">
                    {incidents.length} total
                  </span>
                </div>

                {incidents.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-[#154563] rounded">
                    <p className="text-xs text-[#88AAC0]">
                      Zero active incidents at Cape Coast Sports Stadium.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#103852] border border-[#103852] rounded bg-[#03131E]">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="p-3 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-semibold text-[#38BDF8]">
                              {inc.categoryLabel}
                            </span>
                            <span className="text-xs text-[#7B9DB3] mx-1.5">·</span>
                            <span className="text-xs text-[#9BBCD0] font-mono-tabular">
                              {inc.timestamp}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-medium ${
                              inc.resolved
                                ? 'text-[#4EC6B0]'
                                : inc.severity === 'High'
                                  ? 'text-[#EF4444]'
                                  : inc.severity === 'Medium'
                                    ? 'text-[#F5A623]'
                                    : 'text-[#9BBCD0]'
                            }`}
                          >
                            {inc.resolved ? 'Resolved' : `${inc.severity} (Blinking)`}
                          </span>
                        </div>

                        <div className="text-sm font-medium text-white">
                          {inc.title}
                        </div>
                        <div className="text-xs text-[#9AB8CB]">
                          {inc.locationName}
                          {inc.suspectsCount > 0 &&
                            ` · ${inc.suspectsCount} suspect(s)`}
                        </div>
                        {inc.notes && (
                          <p className="text-xs text-[#7FA2B8] pt-0.5">{inc.notes}</p>
                        )}

                        <div className="pt-1.5 flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => onToggleIncidentResolved(inc.id)}
                            className="inline-flex items-center gap-1 text-xs text-[#4EC6B0] hover:underline cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{inc.resolved ? 'Reopen Alert' : 'Resolve'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteIncident(inc.id)}
                            className="inline-flex items-center gap-1 text-xs text-[#F05248] hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <form
                onSubmit={handleStageSubmit}
                className="space-y-3 pb-5 border-b border-[#103852]"
              >
                <h3 className="text-sm font-semibold text-[#F5A623]">
                  Add Activity Stage to Crawl Feed
                </h3>

                <div>
                  <label
                    htmlFor="stage-label"
                    className="block text-xs text-[#9BBCD0] mb-1"
                  >
                    Stage Tag
                  </label>
                  <input
                    id="stage-label"
                    type="text"
                    required
                    value={stageLabel}
                    onChange={(e) => setStageLabel(e.target.value)}
                    placeholder="e.g. STAGE 05 · COLLATION"
                    className="w-full h-9 px-2.5 bg-[#03131E] border border-[#144361] rounded text-xs font-mono-tabular text-[#E4EFF6] focus:outline-none focus:border-[#4EC6B0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stage-message"
                    className="block text-xs text-[#9BBCD0] mb-1"
                  >
                    Crawling Announcement Text
                  </label>
                  <textarea
                    id="stage-message"
                    rows={2}
                    required
                    value={stageMessage}
                    onChange={(e) => setStageMessage(e.target.value)}
                    placeholder="e.g. Ballot sorting for National Youth Organizer underway at Central Pitch."
                    className="w-full p-2.5 bg-[#03131E] border border-[#144361] rounded text-xs text-[#E4EFF6] placeholder:text-[#587C94] focus:outline-none focus:border-[#4EC6B0]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-9 inline-flex items-center justify-center gap-1.5 bg-[#4EC6B0] hover:bg-[#5FD5BF] text-[#031420] text-xs font-semibold rounded transition-colors cursor-pointer"
                >
                  <Radio className="w-4 h-4" aria-hidden="true" />
                  <span>Broadcast to Stage Crawl</span>
                </button>
              </form>

              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold text-[#E4EFF6]">
                  Active & Queued Activity Stages
                </h3>

                <div className="divide-y divide-[#103852] border border-[#103852] rounded bg-[#03131E]">
                  {stages.map((stage) => (
                    <div key={stage.id} className="p-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono-tabular font-semibold text-[#4EC6B0]">
                          {stage.stageLabel}
                        </span>
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-1.5 text-xs text-[#C5D8E6] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={stage.active}
                              onChange={() => onToggleStage(stage.id)}
                              className="accent-[#4EC6B0] cursor-pointer"
                            />
                            <span>Crawl</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => onDeleteStage(stage.id)}
                            aria-label="Remove stage"
                            className="text-[#F05248] hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[#DCE8F0] leading-relaxed">
                        {stage.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
