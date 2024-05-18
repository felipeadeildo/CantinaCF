import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

type Props = {
  children: React.ReactNode
  message: React.ReactNode
}

export const SimpleTooltip = ({ children, message }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="text-xs">{message}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
