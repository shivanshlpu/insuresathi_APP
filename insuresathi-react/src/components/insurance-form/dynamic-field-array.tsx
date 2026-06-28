import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InsuranceFormValues } from "@/lib/schema";
import { PlusCircle, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

type FieldArrayName = 
  | "policy.nominees"
  | "policy.familyMembers"
  | "policy.previousPolicies"
  | "policy.references";

interface DynamicFieldArrayProps {
  name: FieldArrayName;
  title: string;
  form: UseFormReturn<InsuranceFormValues>;
  renderFields: (index: number) => React.ReactNode;
  defaultValues: any;
}

export default function DynamicFieldArray({
  name,
  title,
  form,
  renderFields,
  defaultValues,
}: DynamicFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {fields.length > 0 && (
        <div className="space-y-4">
          {fields.map((item, index) => (
            <Card key={item.id} className="relative bg-secondary/50">
              <CardContent className="p-4">
                {renderFields(index)}
              </CardContent>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-7 w-7"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t('form.navigation.remove')}</span>
              </Button>
            </Card>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => append(defaultValues)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {title}
      </Button>
    </div>
  );
}
