import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Eye, Printer, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "@/hooks/use-translation";
import PdfDocument from "@/components/insurance-form/pdf-document";
import { defaultValues } from "@/hooks/use-local-storage-form";

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [printData, setPrintData] = useState<any>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "InsureSathi-Record",
  });

  useEffect(() => {
    fetchRecords();
  }, [search, yearFilter]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (yearFilter) params.append('year', yearFilter);
      
      const res = await fetch(`https://insuresathi-app.onrender.com/api/customers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load records. Is the backend running?", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to completely delete this record? This cannot be undone.")) return;
    
    try {
      const res = await fetch(`https://insuresathi-app.onrender.com/api/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Deleted", description: "Record deleted successfully." });
      fetchRecords(); // Refresh the list
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to delete record.", variant: "destructive" });
    }
  };

  // Generate unique years for the filter dropdown back to 2008
  const currentYear = new Date().getFullYear();
  const availableYears = [];
  for (let y = currentYear; y >= 2008; y--) {
    availableYears.push(`${y}-${y + 1}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Customer Records</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <CardTitle>Database Overview</CardTitle>
              <div className="flex w-full md:w-auto gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search name, policy..." 
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="relative">
                    <select 
                        className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                    >
                        <option value="">All Years</option>
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p className="text-lg">No records found matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-4 font-semibold rounded-tl-md">Name</th>
                      <th className="p-4 font-semibold">Policy Number</th>
                      <th className="p-4 font-semibold">Mobile</th>
                      <th className="p-4 font-semibold">Financial Year</th>
                      <th className="p-4 font-semibold">Date Registered</th>
                      <th className="p-4 font-semibold rounded-tr-md text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={r._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium">{r.searchable?.name}</td>
                        <td className="p-4">{r.searchable?.policyNumber || 'N/A'}</td>
                        <td className="p-4">{r.searchable?.mobile || 'N/A'}</td>
                        <td className="p-4"><span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-semibold">{r.financialYear}</span></td>
                        <td className="p-4">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                                <Link to={`/register?editId=${r._id}`}>
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Eye className="w-4 h-4" /> View
                                    </Button>
                                </Link>
                                <Button size="sm" variant="default" className="gap-2" onClick={async () => {
                                    try {
                                        toast({ title: "Fetching details..." });
                                        const res = await fetch(`https://insuresathi-app.onrender.com/api/customers/${r._id}`);
                                        if (!res.ok) throw new Error("Failed to fetch full record");
                                        const fullRecord = await res.json();

                                        // Merge missing nested properties with defaultValues to prevent PDF crashes
                                        const safeData = {
                                            ...defaultValues,
                                            ...fullRecord.formData,
                                            personal: { ...defaultValues.personal, ...fullRecord.formData?.personal },
                                            kyc: { ...defaultValues.kyc, ...fullRecord.formData?.kyc },
                                            occupation: { ...defaultValues.occupation, ...fullRecord.formData?.occupation },
                                            bank: { ...defaultValues.bank, ...fullRecord.formData?.bank },
                                            policy: { ...defaultValues.policy, ...fullRecord.formData?.policy },
                                            medical: { ...defaultValues.medical, ...fullRecord.formData?.medical }
                                        };
                                        
                                        setPrintData(safeData);
                                        setTimeout(() => {
                                            handlePrint();
                                        }, 100);
                                    } catch (error) {
                                        toast({ title: "Error", description: "Could not load complete record for printing.", variant: "destructive" });
                                    }
                                }}>
                                    <Printer className="w-4 h-4" /> Print
                                </Button>
                                <Button size="sm" variant="destructive" className="gap-2" onClick={() => handleDelete(r._id)}>
                                    <Trash2 className="w-4 h-4" /> Delete
                                </Button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
      {/* Hidden PDF Document for printing directly from table */}
      <div className="absolute left-[-9999px] top-[-9999px]">
          <div ref={componentRef}>
              {printData && <PdfDocument data={printData} t={t} />}
          </div>
      </div>
    </div>
  );
}
