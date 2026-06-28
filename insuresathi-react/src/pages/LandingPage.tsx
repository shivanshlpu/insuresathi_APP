import { Link } from "react-router-dom";
import { FileText, FileSpreadsheet, HeartPulse, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function LandingPage() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetch('https://insuresathi-app.onrender.com/api/customers/unread-count')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setUnreadCount(data.count);
        }
      })
      .catch(err => console.error("Failed to fetch unread count", err));
  }, []);

  const handleCopyClientLink = () => {
    const link = `${window.location.origin}/client-form`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "You can now send this link to your customer.",
    });
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <HeartPulse className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">InsureSathi</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Manage your customer insurance registrations and old records securely in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto text-left">
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="text-primary" />
                New Registration
              </CardTitle>
              <CardDescription>
                Fill out a new insurance application form and generate PDF documents instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/register">
                <Button className="w-full text-lg py-6">Start Application</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-slate-700 relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileSpreadsheet className="text-slate-700" />
                View Old Records
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Search and manage previous applications stored in the database by year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/records">
                <Button variant="outline" className="w-full text-lg py-6 border-slate-300">Browse Database</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="pt-8">
          <Button variant="secondary" onClick={handleCopyClientLink} className="flex items-center gap-2 mx-auto">
            <LinkIcon className="h-4 w-4" />
            Copy Link for Customer Self-Service
          </Button>
        </div>
      </div>
    </div>
  );
}
