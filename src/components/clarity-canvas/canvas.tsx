'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
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

    // Prevent adding pin on textarea
    if (e.target instanceof HTMLTextAreaElement) {
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
    <div
      ref={canvasRef}
      className="relative h-full w-full rounded-lg border-2 border-dashed bg-card shadow-inner cursor-copy"
      onClick={addPin}
    >
      <Textarea
        placeholder="Start typing or generate a layout to test your ideas... Click anywhere on the canvas to add a feedback pin."
        className="absolute inset-0 h-full w-full resize-none border-none bg-transparent p-6 text-base focus:ring-0 focus-visible:ring-0"
        value={layoutContent}
        onChange={(e) => setLayoutContent(e.target.value)}
        onClick={(e) => e.stopPropagation()} // Prevent adding pin when clicking textarea
      />
      {pins.map((pin) => (
        <FeedbackPin 
          key={pin.id} 
          pin={pin} 
          onUpdate={updatePinFeedback}
          onRemove={removePin}
        />
      ))}
    </div>
  );
}
