import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const SWATCHES = [
  '#ffffff', '#f5f0e8', '#fef9c3', '#fed7aa',
  '#fecaca', '#e9d5ff', '#bfdbfe', '#bbf7d0',
  '#d1d5db', '#a3a3a3', '#737373', '#404040',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="h-6 w-6 rounded-md border border-border/50 shadow-sm cursor-pointer transition-shadow hover:shadow-md"
          style={{ backgroundColor: value }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {SWATCHES.map((color) => (
            <button
              key={color}
              className={`h-6 w-6 rounded-md border cursor-pointer transition-all hover:scale-110 ${
                value === color ? 'border-primary ring-1 ring-primary' : 'border-border/50'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-7 cursor-pointer rounded border-0"
        />
      </PopoverContent>
    </Popover>
  );
}
