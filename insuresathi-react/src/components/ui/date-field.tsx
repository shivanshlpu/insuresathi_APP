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

const parseToDateObj = (val: any): Date | undefined => {
  if (!val) return undefined;
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
  if (typeof val === 'string') {
    const ymdMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (ymdMatch) {
      const y = parseInt(ymdMatch[1], 10);
      const m = parseInt(ymdMatch[2], 10) - 1;
      const d = parseInt(ymdMatch[3], 10);
      return new Date(y, m, d);
    }
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

const formatDateToYYYYMMDD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function DateField({ name, label, form, yearSelect = false }: DateFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const dateValue = parseToDateObj(field.value);
        
        const [inputValue, setInputValue] = useState(
          dateValue ? format(dateValue, "dd-MM-yyyy") : ""
        );

        // Sync input when field value changes externally (e.g., from the calendar)
        useEffect(() => {
          if (field.value) {
             const d = parseToDateObj(field.value);
             if (d) {
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
          let val = e.target.value;
          
          if (inputValue.endsWith('-') && val.length === inputValue.length - 1) {
            val = val.slice(0, -1);
          }

          let digits = val.replace(/\D/g, '');
          if (digits.length > 8) digits = digits.slice(0, 8);

          let formatted = digits;
          if (digits.length > 4) {
            formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
          } else if (digits.length > 2) {
            formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
          }

          setInputValue(formatted);
          
          if (formatted.length === 10) {
            const parsedDate = parse(formatted, "dd-MM-yyyy", new Date());
            if (isValid(parsedDate)) {
               field.onChange(formatDateToYYYYMMDD(parsedDate));
            } else {
               field.onChange(undefined);
            }
          } else {
             field.onChange(undefined);
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
                      if (date) {
                        field.onChange(formatDateToYYYYMMDD(date));
                      } else {
                        field.onChange(undefined);
                      }
                    }}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={new Date().getFullYear() + 10}
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
