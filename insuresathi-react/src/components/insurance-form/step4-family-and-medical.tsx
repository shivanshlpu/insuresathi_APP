import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Users, BookUser, HeartPulse } from "lucide-react";
import { DateField } from "@/components/ui/date-field";
import DynamicFieldArray from "./dynamic-field-array";
import { InsuranceFormValues } from "@/lib/schema";
import { useTranslation } from "@/hooks/use-translation";

interface Step4Props {
  form: UseFormReturn<InsuranceFormValues>;
}

export default function Step4FamilyAndMedical({ form }: Step4Props) {
  const { t } = useTranslation();
  const { control, watch } = form;

  const watchFamilyMemberStatus = (index: number) => watch(`policy.familyMembers.${index}.status`);
  const watchGender = watch("personal.gender");
  const watchMaritalStatus = watch("personal.maritalStatus");
  const isMarriedFemale = watchGender === 'Female' && watchMaritalStatus === 'married';

  const renderFamilyMemberFields = (index: number) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
      <FormField control={control} name={`policy.familyMembers.${index}.relation`} render={({ field }) => (
        <FormItem><FormLabel>{t('family.relation')}</FormLabel>
          <FormControl><Input {...field} placeholder={t('family.relation')} /></FormControl>
        <FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.familyMembers.${index}.status`} render={({ field }) => (
        <FormItem><FormLabel>{t('family.status')}</FormLabel>
          <FormControl>
              <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="Living">Living</option>
                  <option value="Deceased">Deceased</option>
              </select>
          </FormControl>
        <FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.familyMembers.${index}.age`} render={({ field }) => (
        <FormItem><FormLabel>{t('family.age')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      {watchFamilyMemberStatus(index) !== 'Deceased' && (
        <FormField control={control} name={`policy.familyMembers.${index}.health`} render={({ field }) => (
          <FormItem><FormLabel>{t('family.health')}</FormLabel>
            <FormControl><Input {...field} placeholder={t('family.health')} /></FormControl>
          <FormMessage /></FormItem>
        )} />
      )}
      {watchFamilyMemberStatus(index) === 'Deceased' && (
        <>
          <FormField control={control} name={`policy.familyMembers.${index}.deathReason`} render={({ field }) => (
            <FormItem className="sm:col-span-2"><FormLabel>{t('family.death_reason')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name={`policy.familyMembers.${index}.deathYear`} render={({ field }) => (
            <FormItem className="sm:col-span-2"><FormLabel>{t('family.death_year')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </>
      )}
    </div>
  );

  const renderReferenceFields = (index: number) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormField control={control} name={`policy.references.${index}.name`} render={({ field }) => (
        <FormItem><FormLabel>{t('family.ref_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.references.${index}.contact`} render={({ field }) => (
        <FormItem><FormLabel>{t('family.ref_contact')}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name={`policy.references.${index}.address`} render={({ field }) => (
        <FormItem><FormLabel>{t('family.ref_address')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t("family.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["family"]} className="w-full space-y-4">
          <AccordionItem value="family">
            <AccordionTrigger><div className="flex items-center gap-2"><Users className="h-5 w-5" /> {t('family.title')}</div></AccordionTrigger>
            <AccordionContent>
              <DynamicFieldArray
                name="policy.familyMembers"
                title={t('family.add_family_member')}
                form={form}
                renderFields={renderFamilyMemberFields}
                defaultValues={{ 
                  relation: 'Father', 
                  status: 'Living', 
                  age: 0, 
                  health: 'Good',
                  deathReason: '',
                  deathYear: '',
                }}
              />
            </AccordionContent>
          </AccordionItem>

          <Card className="!mt-6">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><HeartPulse className="h-5 w-5"/>{t('family.medical_details_header')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="font-medium">{t('family.health_details_subheader')}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={control} name="medical.height" render={({ field }) => (
                        <FormItem><FormLabel>{t('family.height')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="medical.weight" render={({ field }) => (
                        <FormItem><FormLabel>{t('family.weight')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={control} name="medical.birthMark" render={({ field }) => (
                    <FormItem><FormLabel>{t('family.birth_mark')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="medical.treatmentDetailsGeneral" render={({ field }) => (
                    <FormItem><FormLabel>{t('family.treatment_details_general')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                {isMarriedFemale && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-medium">{t('family.female_details_subheader')}</h3>
                        <div className="p-4 border rounded-md space-y-4">
                            <h4 className="font-medium text-sm">{t('family.health_delivery_subheader')}</h4>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <FormField control={control} name="medical.isPregnant" render={({ field }) => (
                                    <FormItem><FormLabel>{t('family.is_pregnant')}</FormLabel>
                                        <FormControl>
                                            <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                <option value="" disabled>Select Option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </FormControl>
                                    <FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name="medical.deliveryMode" render={({ field }) => (
                                    <FormItem><FormLabel>{t('family.delivery_mode')}</FormLabel>
                                         <FormControl>
                                            <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                <option value="" disabled>Select Mode</option>
                                                <option value="Normal">Normal</option>
                                                <option value="Cesarean">Cesarean</option>
                                            </select>
                                         </FormControl>
                                    <FormMessage /></FormItem>
                                )} />
                                <DateField name="medical.lastDeliveryDate" label={t('family.last_delivery_date')} form={form} yearSelect={true} />
                            </div>
                            <FormField control={control} name="medical.treatmentDetails" render={({ field }) => (
                                <FormItem><FormLabel>{t('family.treatment_details')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="p-4 border rounded-md space-y-4">
                             <h4 className="font-medium text-sm">{t('family.husband_details_subheader')}</h4>
                             <div className="grid sm:grid-cols-3 gap-4">
                                <FormField control={control} name="medical.husbandName_mw" render={({ field }) => (
                                    <FormItem><FormLabel>{t('family.husband_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name="medical.husbandOccupation_mw" render={({ field }) => (
                                    <FormItem><FormLabel>{t('family.husband_occupation')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name="medical.husbandIncome_mw" render={({ field }) => (
                                    <FormItem><FormLabel>{t('family.husband_income')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                             </div>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>

          <Card className="!mt-6">
             <CardHeader>
                <CardTitle className="font-headline">{t('family.remarks_header')}</CardTitle>
            </CardHeader>
            <CardContent>
                <FormField control={control} name="remarks" render={({ field }) => (
                    <FormItem><FormLabel>{t('family.remarks_label')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>

          <AccordionItem value="references" className="!mt-6">
            <AccordionTrigger><div className="flex items-center gap-2"><BookUser className="h-5 w-5" /> {t('family.references_subheader')}</div></AccordionTrigger>
            <AccordionContent>
              <DynamicFieldArray name="policy.references" title={t('family.add_reference')} form={form} renderFields={renderReferenceFields} defaultValues={{ name: '', contact: '', address: '' }} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
