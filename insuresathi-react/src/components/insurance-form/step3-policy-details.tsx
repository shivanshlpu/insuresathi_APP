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
  const watchedHasPreviousPolicy = form.watch("policy.hasPreviousPolicy");

  const renderNomineeFields = (index: number) => {
    const nomineeAge = form.watch(`policy.nominees.${index}.age`);
    return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
      <FormField control={control} name={`policy.nominees.${index}.name`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.nominees.${index}.relation`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_relation')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
       <FormField control={control} name={`policy.nominees.${index}.age`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_age')}</FormLabel><FormControl><Input type="text" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.nominees.${index}.share`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_share')}</FormLabel><FormControl><Input type="text" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.nominees.${index}.email`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_email')}</FormLabel><FormControl><Input type="email" placeholder="Mail ID" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.nominees.${index}.mobile`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.nominee_mobile')}</FormLabel><FormControl><Input type="text" placeholder="Mobile No." {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      {nomineeAge !== undefined && nomineeAge < 18 && (
        <>
            <FormField control={control} name={`policy.nominees.${index}.appointeeName`} render={({ field }) => (
                <FormItem className="sm:col-span-2"><FormLabel>{t('policy.appointee_name') || 'Appointee Name'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`policy.nominees.${index}.appointeeRelation`} render={({ field }) => (
                <FormItem className="sm:col-span-2"><FormLabel>{t('policy.appointee_relation') || 'Appointee Relation'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`policy.nominees.${index}.appointeeAge`} render={({ field }) => (
                <FormItem className="sm:col-span-2"><FormLabel>{t('policy.appointee_age') || 'Appointee Age'}</FormLabel><FormControl><Input type="text" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </>
      )}
    </div>
  )};

  const renderPreviousPolicyFields = (index: number) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4 items-end">
      <FormField control={control} name={`policy.previousPolicies.${index}.policyName`} render={({ field }) => (
          <FormItem className="sm:col-span-2"><FormLabel>{t('policy.policy_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.previousPolicies.${index}.policyNumber`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_number')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.previousPolicies.${index}.sumAssured`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_sum_assured')}</FormLabel><FormControl><Input type="text" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.previousPolicies.${index}.term`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_term') || 'Term'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.previousPolicies.${index}.premiumPayingTerm`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_premium_term') || 'Premium Paying Term'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.previousPolicies.${index}.status`} render={({ field }) => (
          <FormItem><FormLabel>{t('policy.policy_status')}</FormLabel>
            <FormControl><Input {...field} placeholder={t('policy.policy_status')} /></FormControl>
          <FormMessage /></FormItem>
      )} />
    </div>
  );

  return (
    <Card id="step-policy">
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
                <FormItem><FormLabel>{t('policy.sum_assured')}</FormLabel><FormControl><Input type="text" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
             <FormField control={control} name="policy.premiumMode" render={({ field }) => (
                <FormItem><FormLabel>{t('policy.premium_mode')}</FormLabel>
                    <FormControl><Input {...field} placeholder={t('policy.premium_mode')} /></FormControl>
                <FormMessage /></FormItem>
            )} />
             <FormField control={control} name="policy.premiumAmount" render={({ field }) => (
                <FormItem><FormLabel>{t('policy.premium_amount')}</FormLabel><FormControl><Input type="text" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <div className="space-y-3 p-4 border rounded-md">
            <h3 className="font-medium">{t('policy.riders')}</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
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
                <FormField control={control} name="policy.pwbRider" render={({ field }) => (
                    <FormItem><FormLabel>{t('policy.pwb_rider')}</FormLabel>
                        <FormControl><Input {...field} placeholder="PWB Details" /></FormControl>
                    <FormMessage /></FormItem>
                )} />
            </div>
         </div>
        
        <Accordion type="multiple" defaultValue={["nominees", "policies"]} className="w-full">
          <AccordionItem value="nominees">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5" /> {t('policy.nominees_section_title')}
                {errors.policy?.nominees && <span className="text-destructive text-xs ml-2">({t('form.validation.required')})</span>}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <DynamicFieldArray name="policy.nominees" title={t('policy.add_nominee')} form={form} renderFields={renderNomineeFields} defaultValues={{ name: '', relation: '', age: 0, share: 100, email: '', mobile: '' }} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="policies">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> {t('policy.previous_policies_section_title')}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <FormField control={control} name="policy.hasPreviousPolicy" render={({ field }) => (
                <FormItem className="max-w-md">
                  <FormLabel>{t('policy.has_previous_policy')}</FormLabel>
                  <FormControl>
                    <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="">Select Option</option>
                      <option value="First Policy">{t('policy.first_policy')} (No Previous Policies)</option>
                      <option value="Yes">{t('policy.answer_yes')} (Have Previous Policies)</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {watchedHasPreviousPolicy === "First Policy" && (
                <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
                  First policy selected — previous policy details are not applicable.
                </div>
              )}

              {watchedHasPreviousPolicy === "Yes" && (
                <DynamicFieldArray name="policy.previousPolicies" title={t('policy.add_previous_policy')} form={form} renderFields={renderPreviousPolicyFields} defaultValues={{ policyName: '', policyNumber: '', sumAssured: 0, premiumAmount: 0, status: 'Yes' }} />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
