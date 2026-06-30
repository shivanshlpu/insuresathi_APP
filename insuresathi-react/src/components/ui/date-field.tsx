import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

interface DateFieldProps {
  name: string;
  label: string;
  form: UseFormReturn<any>;
  yearSelect?: boolean;
}

export function DateField({ name, label, form, yearSelect = false }: DateFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const dateValue = field.value ? new Date(field.value) : undefined;
        // Format for the text input (YYYY-MM-DD for native date input)
        const dateString =
          dateValue && !isNaN(dateValue.getTime())
            ? format(dateValue, "yyyy-MM-dd")
            : "";

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  type="date"
                  className="flex-1"
                  value={dateString}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      field.onChange(new Date(val));
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                />
              </FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                    initialFocus
                    captionLayout={yearSelect ? "dropdown-buttons" : "buttons"}
                    fromYear={yearSelect ? 1900 : undefined}
                    toYear={yearSelect ? new Date().getFullYear() : undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
