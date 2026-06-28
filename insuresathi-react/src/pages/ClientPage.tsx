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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl flex justify-end mb-4">
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
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
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          {language === "en" ? "InsureSathi Form" : "इश्योरसाथी फॉर्म"}
        </h1>
        <p className="text-gray-600">
          {language === "en" 
            ? "Please fill out the details accurately so your agent can process your request."
            : "कृपया अपनी जानकारी सही-सही भरें ताकि आपके एजेंट आपकी प्रक्रिया को आगे बढ़ा सकें।"}
        </p>
      </div>
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 md:p-10 border border-gray-100">
        <InsuranceForm isClientMode={true} />
      </div>
    </div>
  );
}
