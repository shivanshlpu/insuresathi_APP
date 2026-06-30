import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import PhotoUpload from "./photo-upload";
import { InsuranceFormValues } from "@/lib/schema";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Separator } from "../ui/separator";

interface Step1Props {
  form: UseFormReturn<InsuranceFormValues>;
  isClientMode?: boolean;
}

import { DateField } from "@/components/ui/date-field";


export default function Step1PersonalDetails({ form, isClientMode = false }: Step1Props) {
  const { t } = useTranslation();
  const watchedMaritalStatus = form.watch("personal.maritalStatus");

  const dob = form.watch("personal.dob");
  useEffect(() => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      form.setValue("personal.age", age, { shouldValidate: true });
    }
  }, [dob, form]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t("personal.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <FormField
            control={form.control}
            name="personal.photo"
            render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                <FormLabel>{t('personal.photo')}</FormLabel>
                <FormControl>
                    <PhotoUpload 
                    value={field.value}
                    onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            {!isClientMode && (
                <div className="grid sm:grid-cols-3 gap-4 w-full">
                    <DateField name="personal.docDate" label={t('general.doc_date')} form={form} />
                    <DateField name="personal.backDatingDate" label={t('general.back_dating_date')} form={form} />
                    <FormField control={form.control} name="personal.topPolicyNumber" render={({ field }) => (
                        <FormItem><FormLabel>{t("general.top_policy_number")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            )}
        </div>

        <Separator />

        <FormField control={form.control} name="personal.name" render={({ field }) => (
            <FormItem><FormLabel>{t("personal.name")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="personal.address" render={({ field }) => (
            <FormItem><FormLabel>{t("personal.address")}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="personal.fatherName" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.father_name")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="personal.motherName" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.mother_name")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <FormField control={form.control} name="personal.maritalStatus" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.marital_status")}</FormLabel>
                <FormControl>
                    <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="" disabled>Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                    </select>
                </FormControl>
                <FormMessage /></FormItem>
            )} />
            {watchedMaritalStatus === "married" && (
                <FormField control={form.control} name="personal.spouseName" render={({ field }) => (
                    <FormItem><FormLabel>{t("personal.spouse_name")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            )}
             <FormField control={form.control} name="personal.gender" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.gender")}</FormLabel>
                <FormControl>
                    <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </FormControl>
                <FormMessage /></FormItem>
            )} />
            <div className="flex flex-col gap-4">
                <FormField control={form.control} name="personal.qualification" render={({ field }) => (
                    <FormItem><FormLabel>{t("personal.qualification")}</FormLabel>
                    <FormControl>
                        <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="" disabled>Select Qualification</option>
                            <option value="Post-graduate">Post-graduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Matric">Matric</option>
                            <option value="High school">High school</option>
                            <option value="Other">Other</option>
                        </select>
                    </FormControl>
                    <FormMessage /></FormItem>
                )} />
                {form.watch("personal.qualification") && (
                    <FormField control={form.control} name="personal.qualificationClass" render={({ field }) => (
                        <FormItem><FormLabel>Class/Degree Studied</FormLabel><FormControl><Input {...field} placeholder="Specify class/degree" /></FormControl><FormMessage /></FormItem>
                    )} />
                )}
            </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
            <DateField name="personal.dob" label={t('personal.dob')} form={form} yearSelect={true} />
            <FormField control={form.control} name="personal.age" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.age")}</FormLabel><FormControl><Input type="number" {...field} readOnly /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="personal.placeOfBirth" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.place_of_birth")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="grid sm:grid-cols-3 gap-4">
            <FormField control={form.control} name="personal.mobile" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.mobile")}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="personal.email" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.email")}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            {!isClientMode && (
                <FormField control={form.control} name="personal.knowCustomerDuration" render={({ field }) => (
                    <FormItem><FormLabel>{t("personal.know_customer_duration")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            )}
        </div>
        
        <Separator />
        <h3 className="text-lg font-medium">{t('personal.kyc_subheader')}</h3>

        <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="kyc.aadhaarNumber" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.aadhaar_number")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="kyc.panNumber" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.pan_number")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="kyc.kycNumber" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.kyc_number")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="kyc.accessId" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.access_id")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
            <FormField control={form.control} name="kyc.bocNumber" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.boc_number")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DateField name="kyc.bocDate" label={t('personal.boc_date')} form={form} />
             <FormField control={form.control} name="kyc.bocAmount" render={({ field }) => (
                <FormItem><FormLabel>{t("personal.boc_amount")}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
