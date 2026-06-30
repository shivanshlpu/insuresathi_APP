import { useState, useEffect } from "react";
import { format, parse, isValid } from "date-fns";
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
        
        const [inputValue, setInputValue] = useState(
          dateValue && !isNaN(dateValue.getTime())
            ? format(dateValue, "dd-MM-yyyy")
            : ""
        );

        // Sync input when field value changes externally (e.g., from the calendar)
        useEffect(() => {
          if (field.value) {
             const d = new Date(field.value);
             if (!isNaN(d.getTime())) {
                 const formatted = format(d, "dd-MM-yyyy");
                 if (inputValue !== formatted) {
                     setInputValue(formatted);
                 }
             }
          } else {
             setInputValue("");
          }
        }, [field.value]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          setInputValue(val);
          
          if (!val) {
             field.onChange(undefined);
             return;
          }

          // Very simple parser for DD-MM-YYYY
          const parsedDate = parse(val, "dd-MM-yyyy", new Date());
          if (isValid(parsedDate) && val.length === 10) {
             field.onChange(parsedDate);
          }
        };

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  className="flex-1"
                  value={inputValue}
                  onChange={handleInputChange}
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
