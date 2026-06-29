import { useState, useEffect, useRef } from "react";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorageForm } from "@/hooks/use-local-storage-form";
// ref import removed since combined in line 1
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

import Step1PersonalDetails from "./step1-personal-details";
import Step2OccupationAndBank from "./step2-occupation-and-bank";
import Step3PolicyDetails from "./step3-policy-details";
import Step4FamilyAndMedical from "./step4-family-and-medical";
import PdfDocument from "./pdf-document";

const FormSkeleton = () => (
  <Card>
    <CardContent className="p-6 space-y-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </CardContent>
  </Card>
);

interface InsuranceFormProps {
  isClientMode?: boolean;
}

export default function InsuranceForm({ isClientMode = false }: InsuranceFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');
  const [isEditMode, setIsEditMode] = useState(!editId);
  const [form, isInitialized] = useLocalStorageForm();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [shouldPrint, setShouldPrint] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "InsureSathi-Application",
    onAfterPrint: () => setIsGeneratingPdf(false),
  });

  // Guarantee that the component has rendered latest values before printing
  useEffect(() => {
    if (shouldPrint) {
      const timer = setTimeout(() => {
        handlePrint();
        setShouldPrint(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldPrint, handlePrint]);

  useEffect(() => {
    if (editId) {
      fetchWithAuth(`https://insuresathi-app.onrender.com/api/customers/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.formData) {
            form.reset(data.formData);
          }
        })
        .catch(err => console.error("Error fetching record:", err));
    }
  }, [editId, form]);

  if (!isInitialized) {
    return <FormSkeleton />;
  }

  const onSubmit = async (values: any) => {
    const isValid = await form.trigger();
    if (!isValid) {
      const errorFields = Object.keys(form.formState.errors);
      toast({
        title: "Validation Error",
        description: `Please fill all required fields correctly before generating the PDF. Errors in: ${errorFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPdf(true);
    toast({
      title: "Saving to Database...",
      description: "Please wait while we secure your record.",
    });

    try {
      const url = editId 
        ? `https://insuresathi-app.onrender.com/api/customers/${editId}` 
        : 'https://insuresathi-app.onrender.com/api/customers';
        
      const response = await fetchWithAuth(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: values, source: isClientMode ? 'client' : 'agent' })
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      if (isClientMode) {
        toast({
          title: "Success",
          description: "Thank you! Your details have been securely sent to your agent.",
        });
        setIsGeneratingPdf(false);
        form.reset();
        return;
      }

      toast({
        title: "Success",
        description: "Record saved successfully! Opening print dialog...",
      });

      // Allow state to flush so hidden component renders with latest values before printing
      setShouldPrint(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Database Error",
        description: "Could not save to MongoDB. Is the backend running?",
        variant: "destructive"
      });
      setIsGeneratingPdf(false);
    }
  };

  const handleBack = () => {
    if (editId && isEditMode) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave without saving?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isClientMode && (
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-3xl font-bold text-slate-900">
            {isClientMode ? "Customer Information Form" : (editId ? "Customer Record" : "New Registration")}
          </h1>
        </div>
        {editId && !isEditMode && (
          <Button variant="secondary" onClick={() => setIsEditMode(true)}>
            Edit Record
          </Button>
        )}
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset disabled={!isEditMode} className="space-y-8">
          <Step1PersonalDetails form={form} isClientMode={isClientMode} />
          <Step2OccupationAndBank form={form} />
          <Step3PolicyDetails form={form} />
          <Step4FamilyAndMedical form={form} />
        </fieldset>
        
        <div className="flex justify-end pt-4 gap-4">
          {editId && !isEditMode ? (
            <Button type="button" onClick={() => setShouldPrint(true)} disabled={isGeneratingPdf} className="w-full sm:w-auto text-lg py-6 px-12">
              {isGeneratingPdf ? t('pdf.generating') : "Generate PDF"}
            </Button>
          ) : (
            <Button type="submit" disabled={isGeneratingPdf} className="w-full sm:w-auto text-lg py-6 px-12">
              {isGeneratingPdf ? t('pdf.generating') : (isClientMode ? "Submit to Agent" : (editId ? "Update Record & Save PDF" : "Generate PDF & Save"))}
            </Button>
          )}
        </div>
      </form>
      
      {/* Hidden PDF Document for printing */}
      <div className="absolute left-[-9999px] top-[-9999px]">
          <div ref={componentRef}>
              <PdfDocument data={form.getValues()} t={t} />
          </div>
      </div>
    </Form>
    </div>
  );
}
