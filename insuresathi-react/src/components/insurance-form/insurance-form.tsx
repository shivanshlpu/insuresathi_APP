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
import { ArrowLeft, Printer, Download, Save } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { downloadPdf } from "@/lib/pdf-export";

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
  const [isSaving, setIsSaving] = useState(false);
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

  const saveRecordToDb = async (values: any) => {
    setIsSaving(true);
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
        setIsSaving(false);
        form.reset();
        return true;
      }

      toast({
        title: "Success",
        description: "Record saved successfully!",
      });
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Database Error",
        description: "Could not save to MongoDB. Is the backend running?",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  };

  const handleSaveOnly = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isValid = await form.trigger();
    if (!isValid) {
      const errorFields = Object.keys(form.formState.errors);
      toast({
        title: "Validation Error",
        description: `Please fill all required fields correctly before saving. Errors in: ${errorFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    await saveRecordToDb(form.getValues());
  };

  const handlePrintOnly = () => {
    setShouldPrint(true);
  };

  const handleDownloadPdf = async () => {
    if (!componentRef.current) return;
    try {
      setIsGeneratingPdf(true);
      toast({ title: "Generating PDF...", description: "Preparing your PDF file for download." });
      const name = form.getValues().personal?.name || 'Customer';
      const filename = `InsureSathi_${name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      await downloadPdf(componentRef.current, filename);
      toast({ title: "Downloaded", description: "PDF downloaded successfully!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to download PDF.", variant: "destructive" });
    } finally {
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {!isClientMode && (
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">
            {isClientMode ? "Customer Information Form" : (editId ? "Customer Record" : "New Registration")}
          </h1>
        </div>
        {editId && !isEditMode && (
          <Button variant="secondary" size="sm" onClick={() => setIsEditMode(true)}>
            Edit Record
          </Button>
        )}
      </div>
      <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 sm:space-y-8">
        <fieldset disabled={!isEditMode} className="space-y-6 sm:space-y-8">
          <Step1PersonalDetails form={form} isClientMode={isClientMode} />
          <Step2OccupationAndBank form={form} />
          <Step3PolicyDetails form={form} />
          <Step4FamilyAndMedical form={form} />
        </fieldset>
        
        <div className="flex flex-col sm:flex-row justify-end pt-4 gap-3 sm:gap-4">
          {editId && !isEditMode ? (
            <>
              <Button type="button" onClick={handlePrintOnly} disabled={isGeneratingPdf} className="w-full sm:w-auto gap-2 text-base sm:text-lg py-3 sm:py-6 px-6 sm:px-8">
                <Printer className="w-5 h-5" /> Print Record
              </Button>
              <Button type="button" onClick={handleDownloadPdf} disabled={isGeneratingPdf} variant="outline" className="w-full sm:w-auto gap-2 text-base sm:text-lg py-3 sm:py-6 px-6 sm:px-8">
                <Download className="w-5 h-5" /> Download PDF
              </Button>
            </>
          ) : isClientMode ? (
            <>
              <Button type="button" onClick={handleSaveOnly} disabled={isSaving} className="w-full sm:w-auto gap-2 text-base sm:text-lg py-3 sm:py-6 px-6 sm:px-8">
                <Save className="w-5 h-5" /> {isSaving ? "Submitting..." : "Submit to Agent"}
              </Button>
              <Button type="button" onClick={handlePrintOnly} disabled={isGeneratingPdf} variant="outline" className="w-full sm:w-auto gap-2 text-base sm:text-lg py-3 sm:py-6 px-6 sm:px-8">
                <Printer className="w-5 h-5" /> Print Copy
              </Button>
            </>
          ) : (
            <>
              <Button type="button" onClick={handleSaveOnly} disabled={isSaving} className="w-full sm:w-auto gap-2 text-base sm:text-lg py-3 sm:py-6 px-6 sm:px-8">
                <Save className="w-5 h-5" /> {isSaving ? "Saving..." : (editId ? "Update Record" : "Save Record")}
              </Button>
              <Button type="button" onClick={handlePrintOnly} disabled={isGeneratingPdf} variant="secondary" className="w-full sm:w-auto gap-2 text-base sm:text-lg py-3 sm:py-6 px-6 sm:px-8">
                <Printer className="w-5 h-5" /> Print Record
              </Button>
              <Button type="button" onClick={handleDownloadPdf} disabled={isGeneratingPdf} variant="outline" className="w-full sm:w-auto gap-2 text-base sm:text-lg py-3 sm:py-6 px-6 sm:px-8">
                <Download className="w-5 h-5" /> Download PDF
              </Button>
            </>
          )}
        </div>
      </form>
      
      {/* Hidden PDF Document for printing */}
      <div className="printable-area absolute left-[-9999px] top-[-9999px]">
          <div ref={componentRef}>
              <PdfDocument data={form.getValues()} t={t} />
          </div>
      </div>
    </Form>
    </div>
  );
}
