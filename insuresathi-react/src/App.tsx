import Header from "@/components/layout/header";
import InsuranceForm from "@/components/insurance-form/insurance-form";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import RecordsPage from "@/pages/RecordsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="insuresathi_theme">
      <LanguageProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/records" element={<RecordsPage />} />
                <Route path="/register" element={
                  <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <InsuranceForm />
                  </div>
                } />
              </Routes>
            </main>
            <footer className="py-4">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>InsureSathi Mobile &copy; {new Date().getFullYear()}</p>
              </div>
            </footer>
          </div>
        </Router>
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
