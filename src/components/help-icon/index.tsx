import { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HelpIconProps {
  tips?: string | ReactNode;
  size?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export default function HelpIcon({
  tips,
  size = 16,
  side,
  className,
}: HelpIconProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleHelp size={size} className={className} />
        </TooltipTrigger>
        <TooltipContent side={side}>
          {typeof tips === 'string' ? <p>{tips}</p> : tips}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
