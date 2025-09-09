'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

interface HeaderProps {
  isLocked: boolean;
  notifications: string[];
}

export function Header({ isLocked, notifications }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6 z-20">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-bold font-headline">Clarity Canvas</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {!isLocked && notifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full p-0 text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </div>
        {isLocked && <Badge variant="secondary">Secure Mode</Badge>}
      </div>
    </header>
  );
}