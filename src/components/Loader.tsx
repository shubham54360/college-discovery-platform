import React from 'react';

export default function Loader({ fullPage = false }: { fullPage?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-12 w-12">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-slate-800/80"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-semibold tracking-wider text-slate-400 animate-pulse">
        Loading analytics...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center bg-slate-950">
        {content}
      </div>
    );
  }

  return <div className="py-12 w-full flex items-center justify-center">{content}</div>;
}
