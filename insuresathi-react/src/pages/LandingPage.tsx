import { Link } from "react-router-dom";
import { FileText, FileSpreadsheet, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
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

          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileSpreadsheet className="text-slate-700" />
                View Old Records
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
      </div>
    </div>
  );
}
