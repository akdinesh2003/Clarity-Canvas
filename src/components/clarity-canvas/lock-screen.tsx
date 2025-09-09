'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound } from 'lucide-react';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: (pin: string) => void;
}

export function LockScreen({ isLocked, onUnlock }: LockScreenProps) {
  const [pin, setPin] = React.useState('');

  const handleUnlock = () => {
    onUnlock(pin);
    setPin('');
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleUnlock();
    }
  };

  if (!isLocked) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-[350px] shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline">Screen Locked</CardTitle>
          <CardDescription>Enter your PIN to unlock.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input
              type="password"
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg tracking-[0.5em]"
              autoFocus
            />
            <Button onClick={handleUnlock} className="w-full">Unlock</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
