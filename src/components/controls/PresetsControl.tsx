import { useState } from 'react';
import { useLithophaneStore } from '@/store/useLithophaneStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bookmark, Save, Trash2, Upload } from 'lucide-react';

export function PresetsControl() {
  const presets = useLithophaneStore((s) => s.presets);
  const savePreset = useLithophaneStore((s) => s.savePreset);
  const loadPreset = useLithophaneStore((s) => s.loadPreset);
  const deletePreset = useLithophaneStore((s) => s.deletePreset);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    savePreset(name.trim());
    setName('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full h-7 text-xs">
          <Bookmark className="h-3 w-3 mr-1.5" />
          Presets
          {presets.length > 0 && (
            <span className="ml-auto text-muted-foreground">
              {presets.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <Label className="text-xs font-semibold mb-2 block">Save Current Settings</Label>
        <div className="flex gap-1.5 mb-3">
          <Input
            placeholder="Preset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="h-7 text-xs"
          />
          <Button
            size="sm"
            className="h-7 px-2"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            <Save className="h-3 w-3" />
          </Button>
        </div>

        {presets.length > 0 && (
          <>
            <Label className="text-xs font-semibold mb-2 block">
              Saved Presets
            </Label>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {presets.map((preset, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 group"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-7 justify-start text-xs px-2"
                    onClick={() => {
                      loadPreset(i);
                      setOpen(false);
                    }}
                  >
                    <Upload className="h-3 w-3 mr-1.5 opacity-50" />
                    {preset.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={() => deletePreset(i)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {presets.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            No saved presets yet
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
