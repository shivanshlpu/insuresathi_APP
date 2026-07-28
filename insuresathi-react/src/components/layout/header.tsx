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
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md shadow-sm">
        <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
          <div className="flex items-center gap-3">
            <Link to="/">
              <div className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
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
                <div>
                  <h1 className="text-base sm:text-lg font-headline font-bold text-foreground leading-tight">
                    UMESH PRASAD TIWARI
                  </h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium hidden sm:block">
                    LIFE INSURANCE CORPORATION OF INDIA | CLIA/ZM CLUB MEMBER
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link to="/notifications" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Notifications">
                <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
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
              className="h-9 w-9"
              onClick={() => setIsClearDialogOpen(true)}
              aria-label="Clear all data"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <div className="flex items-center space-x-1.5 pl-1 border-l">
              <Label htmlFor="language-toggle" className="font-bold text-xs">
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
