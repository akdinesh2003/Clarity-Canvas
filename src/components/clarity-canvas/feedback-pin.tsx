'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, X } from 'lucide-react';

export interface Pin {
  id: number;
  x: number;
  y: number;
  feedback: string;
}

interface FeedbackPinProps {
  pin: Pin;
  onUpdate: (id: number, feedback: string) => void;
  onRemove: (id: number) => void;
}

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2c-3.87 0-7 3.13-7 7a7.02 7.02 0 0 0 4.29 6.53L12 22l2.71-6.47A7.02 7.02 0 0 0 19 9c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function FeedbackPin({ pin, onUpdate, onRemove }: FeedbackPinProps) {
  const [feedbackText, setFeedbackText] = React.useState(pin.feedback);
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onUpdate(pin.id, feedbackText);
    setIsOpen(false);
    toast({
      title: 'Feedback saved',
      description: 'Your feedback has been updated.',
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(pin.id);
    toast({
      variant: 'destructive',
      title: 'Pin removed',
      description: 'The feedback pin has been deleted.',
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="absolute transform -translate-x-1/2 -translate-y-full text-primary transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring rounded-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          aria-label="Feedback Pin"
          data-feedback-pin-ignore
        >
          <PinIcon className="h-6 w-6 drop-shadow-md" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        onClick={(e) => e.stopPropagation()}
        onEscapeKeyDown={() => setIsOpen(false)}
        onInteractOutside={(e) => {
            if (pin.feedback !== feedbackText) {
                if(confirm("You have unsaved changes. Are you sure you want to close?")) {
                    setFeedbackText(pin.feedback);
                    setIsOpen(false);
                } else {
                    e.preventDefault();
                }
            } else {
                 setIsOpen(false);
            }
        }}
        data-feedback-pin-ignore
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">Feedback</h4>
            <p className="text-sm text-muted-foreground">
              Add your comments for this point.
            </p>
          </div>
          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Type your feedback here..."
            className="h-32"
          />
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={handleRemove}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove Pin</span>
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="mr-1 h-4 w-4" />
                    Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                    <Save className="mr-1 h-4 w-4" />
                    Save
                </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}