import React, { useState, useEffect } from 'react';
import { X, Download, PlusCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { IncidentReport, PollingStation } from '../data/constituencyData';

interface OperationsDrawerProps {
  open: boolean;
  onClose: () => void;
  allStations: PollingStation[];
  preselectedStation: PollingStation | null;
  incidents: IncidentReport[];
  onAddIncident: (incident: Omit<IncidentReport, 'id' | 'timestamp'>) => void;
  onToggleIncidentResolved: (id: string) => void;
  onDeleteIncident: (id: string) => void;
  onExportCsv: () => void;
}

export function OperationsDrawer({
  open,
  onClose,
  allStations,
  preselectedStation,
  incidents,
  onAddIncident,
  onToggleIncidentResolved,
  onDeleteIncident,
  onExportCsv,
}: OperationsDrawerProps) {
  const [stationId, setStationId] = useState(
    preselectedStation?.id ?? allStations[0]?.id ?? ''
  );
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [suspectsCount, setSuspectsCount] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (preselectedStation) {
      setStationId(preselectedStation.id);
    }
  }, [preselectedStation]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const station = allStations.find((s) => s.id === stationId);
    if (!station || !title.trim()) return;

    onAddIncident({
      title: title.trim(),
      stationId: station.id,
      stationName: station.name,
      electoralAreaName: station.electoralAreaName,
      severity,
      suspectsCount: Math.max(0, Number(suspectsCount) || 0),
      notes: notes.trim(),
      resolved: false,
    });

    setTitle('');
    setSuspectsCount(0);
    setNotes('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Field Operations & Incident Log"
    >
      <div className="w-full max-w-md h-full bg-[#051B2A] border-l border-[#12415E] flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-4 py-3.5 border-b border-[#103852] flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">
              Field Operations & Incidents
            </h2>
            <p className="text-xs text-[#88AAC0] mt-0.5">
              Log security incidents, suspect tracking & export station data
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto gis-scroll p-4 space-y-6">
          {/* Export Action */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#103852]">
            <div>
              <div className="text-sm font-medium text-[#E4EFF6]">
                Polling Station Registry
              </div>
              <div className="text-xs text-[#7FA2B8]">
                113 stations across 11 electoral areas
              </div>
            </div>
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#031420] bg-[#4EC6B0] hover:bg-[#5FD5BF] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Log Sample Incident Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pb-5 border-b border-[#103852]">
            <h3 className="text-sm font-semibold text-[#F5A623]">
              Log New Field Incident
            </h3>

            <div>
              <label
                htmlFor="incident-station"
                className="block text-xs text-[#9BBCD0] mb-1"
              >
                Polling Station
              </label>
              <select
                id="incident-station"
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="w-full h-9 px-2.5 bg-[#03131E] border border-[#144361] rounded text-xs text-[#E4EFF6] focus:outline-none focus:border-[#4EC6B0]"
              >
                {allStations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.electoralAreaName} — {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="incident-title"
                className="block text-xs text-[#9BBCD0] mb-1"
              >
                Incident Summary
              </label>
              <input
                id="incident-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Biometric verification kit delay"
                className="w-full h-9 px-2.5 bg-[#03131E] border border-[#144361] rounded text-xs text-[#E4EFF6] placeholder:text-[#587C94] focus:outline-none focus:border-[#4EC6B0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="incident-severity"
                  className="block text-xs text-[#9BBCD0] mb-1"
                >
                  Severity
                </label>
                <select
                  id="incident-severity"
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
                  htmlFor="incident-suspects"
                  className="block text-xs text-[#9BBCD0] mb-1"
                >
                  Suspects Detained
                </label>
                <input
                  id="incident-suspects"
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
                htmlFor="incident-notes"
                className="block text-xs text-[#9BBCD0] mb-1"
              >
                Field Notes (optional)
              </label>
              <textarea
                id="incident-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Officer dispatch or resolution notes..."
                className="w-full p-2.5 bg-[#03131E] border border-[#144361] rounded text-xs text-[#E4EFF6] placeholder:text-[#587C94] focus:outline-none focus:border-[#4EC6B0]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-9 inline-flex items-center justify-center gap-1.5 bg-[#EAB32B] hover:bg-[#F5BE38] text-[#031420] text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Record Incident</span>
            </button>
          </form>

          {/* Recorded Incidents List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#E4EFF6]">
                Active & Historical Reports
              </h3>
              <span className="text-xs font-mono-tabular text-[#88AAC0]">
                {incidents.length} total
              </span>
            </div>

            {incidents.length === 0 ? (
              <div className="py-6 text-center border border-dashed border-[#154563] rounded">
                <p className="text-xs text-[#88AAC0]">
                  Zero incidents reported across Ayawaso East.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#103852] border border-[#103852] rounded bg-[#03131E]">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-[#F5A623]">
                          {inc.electoralAreaName}
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
                        {inc.resolved ? 'Resolved' : inc.severity}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-white">
                      {inc.title}
                    </div>
                    <div className="text-xs text-[#9AB8CB]">
                      {inc.stationName}
                      {inc.suspectsCount > 0 && ` · ${inc.suspectsCount} suspect(s)`}
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
                        <span>{inc.resolved ? 'Reopen' : 'Mark Resolved'}</span>
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
        </div>
      </div>
    </div>
  );
}
