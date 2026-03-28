"use client";

interface SchedulePickerProps {
  scheduledAt: string;
  onChange: (value: string) => void;
}

export function SchedulePicker({ scheduledAt, onChange }: SchedulePickerProps) {
  const now = new Date();
  const minDateTime = new Date(now.getTime() + 5 * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Programma pubblicazione (opzionale)
      </label>
      <div className="flex items-center gap-3">
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => onChange(e.target.value)}
          min={minDateTime}
          className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 text-sm"
        />
        {scheduledAt && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Rimuovi
          </button>
        )}
      </div>
      {scheduledAt && (
        <p className="mt-1 text-xs text-gray-500">
          Pubblicazione programmata per il{" "}
          {new Date(scheduledAt).toLocaleDateString("it-IT", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}
