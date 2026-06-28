import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FileText, HeartHandshake } from "lucide-react";
import DynamicFieldArray from "./dynamic-field-array";
import { InsuranceFormValues } from "@/lib/schema";
import { useTranslation } from "@/hooks/use-translation";

interface Step3Props {
  form: UseFormReturn<InsuranceFormValues>;
}

export default function Step3PolicyDetails({ form }: Step3Props) {
  const { t } = useTranslation();
  const { control, formState: { errors } } = form;

  const renderNomineeFields = (index: number) => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <FormField control={control} name={`policy.nominees.${index}.name`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.nominees.${index}.relation`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_relation')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
       <FormField control={control} name={`policy.nominees.${index}.age`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_age')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.nominees.${index}.share`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_share')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </div>
  );

  const renderPreviousPolicyFields = (index: number) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4 items-end">
      <FormField control={control} name={`policy.previousPolicies.${index}.policyName`} render={({ field }) => (
          <FormItem className="sm:col-span-2"><FormLabel>{t('policy.policy_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.previousPolicies.${index}.policyNumber`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_number')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.previousPolicies.${index}.sumAssured`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_sum_assured')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.previousPolicies.${index}.premiumAmount`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_premium_amount')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
       <FormField
        control={control}
        name={`policy.previousPolicies.${index}.docDate`}
        render={({ field }) => (
          <FormItem className="flex flex-col"><FormLabel>{t('policy.policy_doc_date')}</FormLabel>
            <Popover><PopoverTrigger asChild><FormControl>
              <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl></PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
            </PopoverContent></Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField control={control} name={`policy.previousPolicies.${index}.status`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_status')}</FormLabel>
            <FormControl><Input {...field} placeholder={t('policy.policy_status')} /></FormControl>
          <FormMessage /></FormItem>
      )} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t("policy.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
            <FormField control={control} name="policy.planNumber" render={({ field }) => (
                <FormItem><FormLabel>{t('policy.plan_number')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="policy.term" render={({ field }) => (
                <FormItem><FormLabel>{t('policy.term')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="policy.sumAssured" render={({ field }) => (
                <FormItem><FormLabel>{t('policy.sum_assured')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
             <FormField control={control} name="policy.premiumMode" render={({ field }) => (
                <FormItem><FormLabel>{t('policy.premium_mode')}</FormLabel>
                    <FormControl><Input {...field} placeholder={t('policy.premium_mode')} /></FormControl>
                <FormMessage /></FormItem>
            )} />
             <FormField control={control} name="policy.premiumAmount" render={({ field }) => (
                <FormItem><FormLabel>{t('policy.premium_amount')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <div className="space-y-3 p-4 border rounded-md">
            <h3 className="font-medium">{t('policy.riders')}</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <FormField control={control} name="policy.adbRider" render={({ field }) => (
                    <FormItem><FormLabel>{t('policy.adb_rider')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
                <FormField control={control} name="policy.abRider" render={({ field }) => (
                    <FormItem><FormLabel>{t('policy.ab_rider')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
                <FormField control={control} name="policy.termRider" render={({ field }) => (
                    <FormItem><FormLabel>{t('policy.term_rider')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
                <FormField control={control} name="policy.cirRider" render={({ field }) => (
                    <FormItem><FormLabel>{t('policy.cir_rider')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
            </div>
         </div>
        
        <Accordion type="multiple" defaultValue={["nominees"]} className="w-full">
          <AccordionItem value="nominees">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5" /> {t('policy.nominees_section_title')}
                {errors.policy?.nominees && <span className="text-destructive text-xs ml-2">({t('form.validation.required')})</span>}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <DynamicFieldArray name="policy.nominees" title={t('policy.add_nominee')} form={form} renderFields={renderNomineeFields} defaultValues={{ name: '', relation: '', age: 0, share: 100 }} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="policies">
            <AccordionTrigger><div className="flex items-center gap-2"><FileText className="h-5 w-5" /> {t('policy.previous_policies_section_title')}</div></AccordionTrigger>
            <AccordionContent>
              <DynamicFieldArray name="policy.previousPolicies" title={t('policy.add_previous_policy')} form={form} renderFields={renderPreviousPolicyFields} defaultValues={{ policyName: '', policyNumber: '', sumAssured: 0, premiumAmount: 0, status: 'Yes' }} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
