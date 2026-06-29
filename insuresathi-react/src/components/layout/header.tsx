import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Trash2, Bell, LogOut } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "../ui/button";
import { ClearDataDialog } from "./clear-data-dialog";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchWithAuth('https://insuresathi-app.onrender.com/api/customers/unread-count')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setUnreadCount(data.count);
        }
      })
      .catch(err => console.error("Failed to fetch unread count", err));
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const handleClearData = () => {
    localStorage.removeItem("insuresathi_form_data");
    window.location.reload();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex flex-col items-center justify-between p-2 max-w-3xl sm:flex-row sm:p-4 sm:py-3">
          <div className="flex flex-col items-center sm:items-start">
            <Link to="/">
              <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="p-2 bg-primary rounded-md">
                  <svg
                    className="h-6 w-6 text-primary-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h1 className="text-xl font-headline font-bold text-foreground">
                  UMESH PRASAD TIWARI
                </h1>
              </div>
            </Link>
            <div className="text-xs text-muted-foreground text-center sm:text-left sm:pl-10">
              <p>LIFE INSURANCE CORPORATION OF INDIA</p>
              <p>CLIA/ZM CLUB MEMBER | AGENCY CODE: 05916370</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Link to="/notifications" className="relative">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsClearDialogOpen(true)}
              aria-label="Clear all data"
            >
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <div className="flex items-center space-x-2">
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
        </div>
      </header>
      <ClearDataDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleClearData}
      />
    </>
  );
}
