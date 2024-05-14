import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { TRechargesQuery, TSalesQuery } from "@/types/queries"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export const IntervalFilter = ({
  query: [query, setQuery],
}: {
  query: TRechargesQuery | TSalesQuery
}) => {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "max-w-xs w-full h-9 rounded-md px-3 text-xs justify-start text-left font-normal",
              !query && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {query.from ? (
              query.to ? (
                <>
                  {format(query.from, "LLL dd, y")} - {format(query.to, "LLL dd, y")}
                </>
              ) : (
                format(query.from, "LLL dd, y")
              )
            ) : (
              <span>Selecionar Intervalo de Data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={query?.from}
            selected={{ from: query?.from, to: query?.to }}
            onSelect={(dateRange) =>
              setQuery({ ...query, from: dateRange?.from, to: dateRange?.to })
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
