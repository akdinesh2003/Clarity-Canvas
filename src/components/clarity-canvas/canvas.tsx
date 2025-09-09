'use client';

import * as React from 'react';
import { FeedbackPin, type Pin } from '@/components/clarity-canvas/feedback-pin';
import { useToast } from '@/hooks/use-toast';

interface CanvasProps {
  layoutContent: string;
  setLayoutContent: (content: string) => void;
  pins: Pin[];
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
}

export function Canvas({ layoutContent, setLayoutContent, pins, setPins }: CanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const addPin = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;

    // Prevent adding pin on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, textarea, [onclick], [data-feedback-pin-ignore]')) {
        return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPin: Pin = {
      id: Date.now(),
      x,
      y,
      feedback: '',
    };
    setPins((prev) => [...prev, newPin]);
    toast({
      title: 'Feedback pin added',
      description: 'Click the pin to add your feedback.',
    });
  };

  const updatePinFeedback = (id: number, feedback: string) => {
    setPins((prev) => prev.map((pin) => (pin.id === id ? { ...pin, feedback } : pin)));
  };
  
  const removePin = (id: number) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
  };


  return (
    <div className="relative h-full w-full p-4 md:p-6">
        <div
            ref={canvasRef}
            className="relative h-full w-full rounded-lg border-2 border-dashed bg-card shadow-inner cursor-copy overflow-auto"
            onClick={addPin}
        >
            {layoutContent ? (
                <div 
                    className="prose dark:prose-invert max-w-none p-6" 
                    dangerouslySetInnerHTML={{ __html: layoutContent }}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-muted-foreground">
                    <p>Start by generating a layout to test your ideas... Click anywhere on the canvas to add a feedback pin.</p>
                </div>
            )}

            {pins.map((pin) => (
                <FeedbackPin 
                    key={pin.id} 
                    pin={pin} 
                    onUpdate={updatePinFeedback}
                    onRemove={removePin}
                />
            ))}
        </div>
    </div>
  );
}