import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Source } from "@/lib/types";
import { Info } from "lucide-react";

type SourcePopoverProps = {
  sources: Source[];
  note?: string;
};

export function SourcePopover({ sources, note }: SourcePopoverProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center justify-center p-1 rounded-full hover: dark:hover: transition-colors">
        <Info className="w-4 h-4 text-muted-foreground hover:text-muted-foreground dark:hover:text-slate-300" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 text-sm   shadow-xl  ">
        {note && (
          <div className="mb-4 pb-4 border-b  ">
            <h4 className="font-semibold mb-1 text-foreground ">Note</h4>
            <p className="text-muted-foreground  text-xs">{note}</p>
          </div>
        )}
        <h4 className="font-semibold mb-2 text-foreground ">Sources</h4>
        <ul className="space-y-3">
          {sources.map((src) => (
            <li key={src.id} className="flex flex-col gap-1">
              <a 
                href={src.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs break-words"
              >
                {src.title}
              </a>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>{src.publisher}</span>
                <span>•</span>
                <span>{src.date}</span>
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
