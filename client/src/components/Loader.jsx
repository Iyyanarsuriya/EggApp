import React from 'react';

const Loader = ({ text = 'Loading fresh farm eggs...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 gap-4">
      <div
        className="relative w-16 h-20 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-gradient-to-br from-amber-200 to-amber-500 shadow-lg shadow-amber-500/30 animate-pulse-slow"
      >
        <div className="absolute top-5 left-4 w-3 h-4 bg-white/60 rounded-full -rotate-25" />
      </div>
      <p className="text-sm sm:text-base font-semibold text-slate-500 font-sans">
        {text}
      </p>
    </div>
  );
};

export default Loader;
