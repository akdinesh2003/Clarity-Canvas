'use client';

import * as React from 'react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileDown,
  Lock,
  Trash2,
  Lightbulb,
  Sparkles,
  FileText,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { generateLayoutSuggestions } from '@/ai/flows/generate-layout-suggestions';
import { summarizeFeedback } from '@/ai/flows/summarize-feedback';
import { useToast } from '@/hooks/use-toast';
import type { Pin } from './feedback-pin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface SidebarControlsProps {
  incognitoMode: boolean;
  onToggleIncognito: (checked: boolean) => void;
  onLock: () => void;
  onClear: () => void;
  pins: Pin[];
  setLayoutContent: (content: string) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export function SidebarControls({
  incognitoMode,
  onToggleIncognito,
  onLock,
  onClear,
  pins,
  setLayoutContent,
  setHasUnsavedChanges,
}: SidebarControlsProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [summary, setSummary] = React.useState('');

  const handleGenerateLayout = async () => {
    if (!prompt) {
      toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a description for the layout.' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateLayoutSuggestions({ prompt });
      setLayoutContent(result.layoutSuggestion);
      toast({ title: 'Layout Generated', description: 'Your new layout is ready on the canvas.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate layout.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSummarizeFeedback = async () => {
    const feedback = pins.map((p) => p.feedback).filter(Boolean);
    if (feedback.length === 0) {
      toast({ variant: 'destructive', title: 'No Feedback', description: 'There are no feedback comments to summarize.' });
      return;
    }
    setIsSummarizing(true);
    try {
      const result = await summarizeFeedback({ feedback });
      setSummary(result.summary);
      // The dialog will be opened by the DialogTrigger, we just need to set the content
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to summarize feedback.' });
      return 'error';
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([document.querySelector('textarea')?.value || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clarity-canvas-export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setHasUnsavedChanges(false);
    toast({ title: 'Exported', description: 'Your canvas content has been downloaded.' });
  };

  return (
    <>
      <SidebarHeader>
        <h2 className="text-lg font-semibold font-headline">Controls</h2>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel>Session</SidebarGroupLabel>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <Label htmlFor="incognito-mode" className="flex flex-col gap-1">
              <span className="font-medium flex items-center gap-2"><EyeOff /> Incognito Mode</span>
              <span className="text-xs font-normal text-muted-foreground">No session history will be saved.</span>
            </Label>
            <Switch id="incognito-mode" checked={incognitoMode} onCheckedChange={onToggleIncognito} />
          </div>
        </SidebarGroup>
        
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Layout AI</SidebarGroupLabel>
          <div className="space-y-2">
            <Textarea
              placeholder="Describe the layout you want..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24"
            />
            <Button onClick={handleGenerateLayout} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate
            </Button>
          </div>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
            <SidebarGroupLabel>Feedback Tools</SidebarGroupLabel>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        onClick={handleSummarizeFeedback}
                        disabled={isSummarizing}
                        className="w-full"
                    >
                        {isSummarizing ? <Loader2 className="animate-spin" /> : <FileText />}
                        Summarize Feedback
                    </Button>
                </DialogTrigger>
                {summary && (
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle className="font-headline">Feedback Summary</DialogTitle>
                        <DialogDescription>
                            Here is an AI-generated summary of all feedback pins.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="prose prose-sm max-h-[60vh] overflow-y-auto rounded-md border p-4">
                            <p>{summary}</p>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button">Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLock} tooltip="Secure Mode">
              <Lock />
              <span>Lock Screen</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleExport} tooltip="Export content">
              <FileDown />
              <span>Export</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onClear}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              tooltip="Clear Canvas"
            >
              <Trash2 />
              <span>Clear Canvas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
