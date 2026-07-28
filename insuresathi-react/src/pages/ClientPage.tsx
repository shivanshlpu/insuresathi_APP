import InsuranceForm from "@/components/insurance-form/insurance-form";
import { useLanguage } from "@/contexts/language-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ClientPage() {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col items-center py-6 sm:py-10 px-3 sm:px-4">
      <div className="w-full max-w-5xl flex justify-end mb-4">
        <div className="flex items-center space-x-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
          <Label htmlFor="language-toggle" className="font-bold text-sm">
            {language === "en" ? "EN" : "हि"}
          </Label>
          <Switch
            id="language-toggle"
            checked={language === "hi"}
            onCheckedChange={toggleLanguage}
            aria-label="Toggle language"
          />
        </div>
      </div>
      <div className="w-full max-w-5xl text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-300 mb-2">
          {language === "en" ? "InsureSathi Form" : "इश्योरसाथी फॉर्म"}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {language === "en" 
            ? "Please fill out the details accurately so your agent can process your request."
            : "कृपया अपनी जानकारी सही-सही भरें ताकि आपके एजेंट आपकी प्रक्रिया को आगे बढ़ा सकें।"}
        </p>
      </div>
      <div className="w-full max-w-5xl bg-white dark:bg-card shadow-xl rounded-xl p-4 sm:p-6 md:p-10 border border-gray-100 dark:border-border">
        <InsuranceForm isClientMode={true} />
      </div>
    </div>
  );
}
