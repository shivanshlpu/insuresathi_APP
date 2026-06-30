import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsuranceFormValues } from "@/lib/schema";
import { useTranslation } from "@/hooks/use-translation";
import { Separator } from "../ui/separator";

interface Step2Props {
  form: UseFormReturn<InsuranceFormValues>;
}

export default function Step2OccupationAndBank({ form }: Step2Props) {
  const { t } = useTranslation();
  const watchedOccupationType = form.watch("occupation.occupationType");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t("occupation.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="occupation.occupationType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("occupation.occupation_type")}</FormLabel>
                    <FormControl>
                        <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            <option value="">Select Occupation</option>
                            <option value="Service">Service</option>
                            <option value="Business">Business</option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Student">Student</option>
                            <option value="Housewife">Housewife</option>
                            <option value="Other">Other</option>
                        </select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="occupation.annualIncome"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t("occupation.yearly_income")}</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="500000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        {watchedOccupationType === "Service" && (
          <div className="p-4 border rounded-md space-y-4">
            <h3 className="font-medium">{t('occupation.service_fields')}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="occupation.designation" render={({ field }) => (
                  <FormItem><FormLabel>{t("occupation.designation")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="occupation.department" render={({ field }) => (
                  <FormItem><FormLabel>{t("occupation.department")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
             <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="occupation.serviceYears" render={({ field }) => (
                  <FormItem><FormLabel>{t("occupation.service_year")}</FormLabel><FormControl><Input type="number" placeholder={t('occupation.years')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="occupation.serviceMonths" render={({ field }) => (
                    <FormItem><FormLabel>{t("occupation.service_month")}</FormLabel><FormControl><Input type="number" placeholder={t('occupation.months')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
          </div>
        )}
        {watchedOccupationType === "Business" && (
          <div className="p-4 border rounded-md space-y-4">
            <h3 className="font-medium">{t('occupation.business_fields')}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <FormField control={form.control} name="occupation.businessName" render={({ field }) => (
                  <FormItem><FormLabel>{t("occupation.business_name")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="occupation.typeOfBusiness" render={({ field }) => (
                  <FormItem><FormLabel>{t("occupation.type_of_business")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="occupation.gstNumber" render={({ field }) => (
                  <FormItem><FormLabel>{t("occupation.gst_number") || "GST Number"}</FormLabel><FormControl><Input {...field} placeholder="Optional" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
               <FormField control={form.control} name="occupation.businessYear" render={({ field }) => (
                  <FormItem><FormLabel>{t("occupation.business_year")}</FormLabel><FormControl><Input type="number" placeholder={t('occupation.years')} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="occupation.businessMonths" render={({ field }) => (
                  <FormItem><FormLabel>{t("occupation.business_month")}</FormLabel><FormControl><Input type="number" placeholder={t('occupation.months')} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>
        )}

        <Separator />
        <h3 className="text-lg font-medium">{t('occupation.bank_details_header')}</h3>

        <div className="grid sm:grid-cols-3 gap-4">
            <FormField control={form.control} name="bank.bankName" render={({ field }) => (
                <FormItem><FormLabel>{t("occupation.bank_name")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="bank.accountNumber" render={({ field }) => (
                <FormItem><FormLabel>{t("occupation.account_number")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="bank.accountType" render={({ field }) => (
                <FormItem><FormLabel>{t("occupation.account_type")}</FormLabel>
                 <FormControl><Input {...field} placeholder={t("occupation.account_type")} /></FormControl>
                <FormMessage /></FormItem>
            )} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="bank.ifscCode" render={({ field }) => (
                <FormItem><FormLabel>{t("occupation.ifsc_code")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="bank.bankAddress" render={({ field }) => (
                <FormItem><FormLabel>{t("occupation.bank_address")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
      </CardContent>
    </Card>
  );
}
