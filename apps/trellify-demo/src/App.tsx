import React, { useMemo, useState, useEffect, useRef } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import stepsData from "./steps.json";
import type { VoiceTourStep } from "voice-tour-sdk";
import { useVoiceTour } from "./hooks/useVoiceTour";
import { TopBar } from "./components/TopBar";
import { Board } from "./components/Board";
import { TourControl } from "./components/TourControl";
import { playChime } from "./utils/chime";

export default function App(): JSX.Element
{
  const steps: VoiceTourStep[] = useMemo(() => stepsData as VoiceTourStep[], []);
  const tour = useVoiceTour(steps);

  // Add stepIndex state to control Joyride programmatically
  const [stepIndex, setStepIndex] = useState(0);
  const isManualAdvance = useRef(false);
  const lastAdvanceTime = useRef(0);

  // Set up voice tool handler for nextStep with proper cleanup
  useEffect(() =>
  {
    const handleNextStep = () =>
    {
      const now = Date.now();
      const timeSinceLastAdvance = now - lastAdvanceTime.current;
      
      console.log('=== VOICE EVENT RECEIVED ===');
      console.log('App: Received nextStep tool call - advancing tour');
      console.log('Current stepIndex before advance:', stepIndex);
      console.log('Time since last advance:', timeSinceLastAdvance, 'ms');
      
      // Debounce: ignore events that come within 500ms of each other
      if (timeSinceLastAdvance < 500)
      {
        console.log('=== VOICE EVENT IGNORED (DEBOUNCED) ===');
        return;
      }
      
      lastAdvanceTime.current = now;
      isManualAdvance.current = true;
      setStepIndex((prevIndex) => {
        const nextIndex = Math.min(prevIndex + 1, steps.length - 1);
        console.log(`App: Advancing from step ${prevIndex} to step ${nextIndex}`);
        console.log('=== VOICE EVENT COMPLETE ===');
        return nextIndex;
      });
    };

    console.log('Setting up voice event listener...');
    // Add event listener directly to avoid multiple listeners
    window.addEventListener('voice-tour:next', handleNextStep);

    // Cleanup function to remove the event listener
    return () =>
    {
      console.log('Cleaning up voice event listener...');
      window.removeEventListener('voice-tour:next', handleNextStep);
    };
  }, [steps.length]); // Only depend on steps.length, not tour

  const joyrideSteps = steps.map((s) => ({ target: s.selector, content: s.docs }));

  const handleJoyride: (data: CallBackProps) => void = tour.bindJoyride((data: CallBackProps) =>
  {
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(data.status!))
    {
      return;
    }
    
    // Only update stepIndex if this is NOT a manual advance (to prevent race conditions)
    // and if the action is a user-initiated navigation (like clicking Joyride's own buttons)
    if (typeof data.index === "number" && !isManualAdvance.current)
    {
      // Only sync state for actual Joyride navigation actions  
      if (data.action === 'next' || data.action === 'prev' || data.action === 'start')
      {
        setStepIndex(data.index);
      }
      playChime();
      // The voice agent will automatically receive the step docs via system message
      // No need to send additional user messages that might override the context
    }
    
    // Reset the manual advance flag after processing
    if (isManualAdvance.current)
    {
      isManualAdvance.current = false;
    }
  });

  const handleManualNext = () =>
  {
    console.log('App: Manual next button clicked');
    isManualAdvance.current = true;
    setStepIndex((prevIndex) => {
      const nextIndex = Math.min(prevIndex + 1, steps.length - 1);
      console.log(`App: Manual advance from step ${prevIndex} to step ${nextIndex}`);
      return nextIndex;
    });
  };

  const handleManualPrev = () =>
  {
    console.log('App: Manual prev button clicked');
    isManualAdvance.current = true;
    setStepIndex((prevIndex) => {
      const nextIndex = Math.max(prevIndex - 1, 0);
      console.log(`App: Manual prev from step ${prevIndex} to step ${nextIndex}`);
      return nextIndex;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <Joyride
        steps={joyrideSteps}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        stepIndex={stepIndex}
        run={true}
        callback={handleJoyride}
        styles={{
          options: {
            primaryColor: '#059669', // emerald-600
            textColor: '#0f172a', // slate-900
            zIndex: 10000,
            arrowColor: '#ffffff'
          },
          tooltip: {
            backgroundColor: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 14px 30px rgba(0,0,0,0.12)',
            padding: '16px 16px 12px'
          },
          tooltipContainer: {
            textAlign: 'left',
            color: '#0f172a'
          },
          tooltipContent: {
            padding: 0
          },
          tooltipFooter: {
            marginTop: 12
          },
          buttonNext: {
            backgroundColor: '#059669',
            borderRadius: 10,
            padding: '8px 12px',
            color: '#ffffff'
          },
          buttonBack: {
            color: '#334155'
          },
          buttonSkip: {
            color: '#64748b'
          },
          overlay: {
            backgroundColor: 'rgba(15,23,42,0.35)'
          },
          spotlight: {
            borderRadius: 12,
            boxShadow: '0 0 0 2px rgba(5,150,105,0.35)'
          }
        }}
      />
      <TopBar />

      <div className="relative flex-1">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop')" }}
        />

        <Board />
      </div>

      <TourControl 
        onPrev={handleManualPrev}
        onNext={handleManualNext}
        onStop={() => tour.stop()} 
        onStartVoice={() => tour.startVoice()} 
      />
    </div>
  );
} 