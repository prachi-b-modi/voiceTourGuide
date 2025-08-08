import React, { useState } from "react";

export function TourControl({ onPrev, onNext, onStop, onStartVoice }: { onPrev: () => void; onNext: () => void; onStop: () => void; onStartVoice: () => Promise<void> }): JSX.Element
{
  const [isStartingVoice, setIsStartingVoice] = useState(false);

  const handleStartVoice = async () =>
  {
    setIsStartingVoice(true);
    try
    {
      await onStartVoice();
    }
    catch (error)
    {
      console.error("Failed to start voice:", error);
      alert("Failed to start voice. Please try again or use the widget button.");
    }
    finally
    {
      setIsStartingVoice(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 glass elevate border rounded-xl px-3 py-2 flex items-center gap-2">
      <button type="button" onClick={onPrev} className="px-3 py-1.5 text-sm rounded-lg bg-white/70 hover:bg-white text-slate-700 border">Prev</button>
      <button type="button" onClick={onNext} className="px-3 py-1.5 text-sm rounded-lg bg-white/70 hover:bg-white text-slate-700 border">Next</button>
      <button 
        type="button"
        onClick={handleStartVoice} 
        disabled={isStartingVoice}
        className="px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isStartingVoice ? "Starting..." : "Start Tour"}
      </button>
      <button type="button" onClick={onStop} className="px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Stop Tour</button>
    </div>
  );
} 