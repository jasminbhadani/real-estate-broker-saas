"use client";

export function ArchiveNeedButton() {
  return (
    <button
      type="submit"
      className="h-12 w-full rounded-xl border text-sm font-medium"
      onClick={(e) => {
        const confirmed = confirm(
          "Archive this need?"
        );

        if (!confirmed) {
          e.preventDefault();
        }
      }}
    >
      Archive
    </button>
  );
}