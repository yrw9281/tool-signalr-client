const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export const primaryButtonClass = `${buttonBase} bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-indigo-500`;

export const secondaryButtonClass = `${buttonBase} bg-slate-900 text-white shadow-lg shadow-slate-900/15 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-slate-900`;

export const inputFieldClass =
  "w-full rounded-xl border border-indigo-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200/60";

export const textAreaFieldClass = `${inputFieldClass} min-h-24 resize-y`;

export const badgeBaseClass =
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold";
