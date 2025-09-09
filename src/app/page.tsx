'use client';

import * as React from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Canvas } from '@/components/clarity-canvas/canvas';
import { Header } from '@/components/clarity-canvas/header';
import { SidebarControls } from '@/components/clarity-canvas/sidebar-controls';
import { LockScreen } from '@/components/clarity-canvas/lock-screen';
import type { Pin } from '@/components/clarity-canvas/feedback-pin';
import { useToast } from '@/hooks/use-toast';

const PIN_UNLOCK = '1234';

export default function Home() {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);

  const [incognitoMode, setIncognitoMode] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(false);
  const [layoutContent, setLayoutContent] = React.useState('');
  const [pins, setPins] = React.useState<Pin[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    setIsMounted(true);
    if (!incognitoMode) {
      try {
        const savedContent = localStorage.getItem('clarity-canvas-content');
        const savedPins = localStorage.getItem('clarity-canvas-pins');
        if (savedContent) setLayoutContent(JSON.parse(savedContent));
        if (savedPins) setPins(JSON.parse(savedPins));
      } catch (error) {
        console.error("Failed to load from localStorage", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Could not load your saved session from the browser.",
        });
      }
    }
  }, [incognitoMode, toast]);

  // Save to localStorage when content changes
  React.useEffect(() => {
    if (isMounted && !incognitoMode) {
      try {
        const newContent = JSON.stringify(layoutContent);
        const newPins = JSON.stringify(pins);
        localStorage.setItem('clarity-canvas-content', newContent);
        localStorage.setItem('clarity-canvas-pins', newPins);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [layoutContent, pins, incognitoMode, isMounted]);

  // Handle unsaved changes prompt
  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !incognitoMode) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, incognitoMode]);


  const handleClear = () => {
    setLayoutContent('');
    setPins([]);
    if (!incognitoMode) {
      localStorage.removeItem('clarity-canvas-content');
      localStorage.removeItem('clarity-canvas-pins');
    }
    toast({
      title: "Canvas Cleared",
      description: "Your canvas and feedback pins have been reset.",
    });
  };

  const handleToggleIncognito = (checked: boolean) => {
    setIncognitoMode(checked);
    if (checked) {
      handleClear();
      toast({
        title: "Incognito Mode On",
        description: "Your session will not be saved.",
      });
    } else {
      toast({
        title: "Incognito Mode Off",
        description: "Your session will now be saved automatically.",
      });
    }
  };

  const handleUnlock = (pin: string) => {
    if (pin === PIN_UNLOCK) {
      setIsLocked(false);
      toast({
        title: "Unlocked",
        description: "Welcome back!",
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Incorrect PIN',
        description: 'Please try again.',
      });
    }
  };

  const notifications = [
    'New feedback received',
    'Layout suggestion ready',
    'Canvas exported successfully',
  ];

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col">
        <Header
          isLocked={isLocked}
          notifications={notifications}
        />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar>
            <SidebarControls
              incognitoMode={incognitoMode}
              onToggleIncognito={handleToggleIncognito}
              onLock={() => setIsLocked(true)}
              onClear={handleClear}
              pins={pins}
              setLayoutContent={setLayoutContent}
              setHasUnsavedChanges={setHasUnsavedChanges}
            />
          </Sidebar>
          <SidebarInset>
              <Canvas
                layoutContent={layoutContent}
                setLayoutContent={setLayoutContent}
                pins={pins}
                setPins={setPins}
              />
          </SidebarInset>
        </div>
      </div>

      <LockScreen isLocked={isLocked} onUnlock={handleUnlock} />
    </SidebarProvider>
  );
}