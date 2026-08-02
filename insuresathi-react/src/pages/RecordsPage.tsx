import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Eye, Printer, Download, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "@/hooks/use-translation";
import PdfDocument from "@/components/insurance-form/pdf-document";
import { defaultValues } from "@/hooks/use-local-storage-form";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { downloadPdf } from "@/lib/pdf-export";
import { API_BASE_URL } from "@/lib/api";

const formatDocDate = (dateVal?: any, fallbackVal?: any) => {
  const val = dateVal || fallbackVal;
  if (!val) return 'N/A';
  
  if (typeof val === 'string') {
    const ymdMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (ymdMatch) {
      const [_, y, m, d] = ymdMatch;
      return `${d}/${m}/${y}`;
    }
  }
  
  const dObj = new Date(val);
  if (!isNaN(dObj.getTime())) {
    const day = String(dObj.getDate()).padStart(2, '0');
    const month = String(dObj.getMonth() + 1).padStart(2, '0');
    const year = dObj.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  return String(val);
};

const getRecordTimeMs = (r: any): number => {
  const docDateVal = r.docDate || r.formData?.personal?.docDate || r.formData?.policy?.docDate;
  if (docDateVal) {
    if (typeof docDateVal === 'string') {
      const ymdMatch = docDateVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (ymdMatch) {
        const [_, y, m, d] = ymdMatch;
        return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10)).getTime();
      }
    }
    const d = new Date(docDateVal);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  if (r.createdAt) {
    const d = new Date(r.createdAt);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return 0;
};

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [printData, setPrintData] = useState<any>(null);
  const [shouldPrint, setShouldPrint] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const sortedRecords = [...records].sort((a, b) => {
    const timeA = getRecordTimeMs(a);
    const timeB = getRecordTimeMs(b);
    if (timeB !== timeA) {
      return timeB - timeA; // Newest Document Date first
    }
    const updatedA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const updatedB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return updatedB - updatedA;
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "InsureSathi-Record",
  });

  // Guarantee that the component has rendered before printing
  useEffect(() => {
    if (shouldPrint && printData) {
      const timer = setTimeout(() => {
        handlePrint();
        setShouldPrint(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldPrint, printData, handlePrint]);

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
      
      const res = await fetchWithAuth(`${API_BASE_URL}/api/customers?${params.toString()}`);
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
      const res = await fetchWithAuth(`${API_BASE_URL}/api/customers/${id}`, { method: 'DELETE' });
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-background p-3 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="icon" className="h-9 w-9"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">Customer Records</h1>
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
                      <th className="p-4 font-semibold">Document Date</th>
                      <th className="p-4 font-semibold rounded-tr-md text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRecords.map((r, i) => (
                      <tr key={r._id} className={`border-b last:border-0 transition-colors ${r.status === 'new' ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-slate-50'}`}>
                        <td className="p-4 font-medium">
                          {r.searchable?.name}
                          {r.status === 'new' && (
                            <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                              NEW
                            </span>
                          )}
                        </td>
                        <td className="p-4">{r.searchable?.policyNumber || 'N/A'}</td>
                        <td className="p-4">{r.searchable?.mobile || 'N/A'}</td>
                        <td className="p-4"><span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-semibold">{r.financialYear}</span></td>
                        <td className="p-4 font-medium">
                          {formatDocDate(r.formData?.personal?.docDate || r.formData?.policy?.docDate, r.createdAt)}
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="gap-2" onClick={async () => {
                                    if (r.status === 'new') {
                                        try {
                                            await fetchWithAuth(`${API_BASE_URL}/api/customers/${r._id}/reviewed`, { method: 'PATCH' });
                                        } catch (e) {
                                            console.error("Failed to mark as reviewed");
                                        }
                                    }
                                    window.location.href = `/register?editId=${r._id}`;
                                }}>
                                    <Eye className="w-4 h-4" /> View
                                </Button>
                                <Button size="sm" variant="default" className="gap-2" onClick={async () => {
                                    try {
                                        toast({ title: "Fetching details..." });
                                        const res = await fetchWithAuth(`${API_BASE_URL}/api/customers/${r._id}`);
                                        if (!res.ok) throw new Error("Failed to fetch full record");
                                        const fullRecord = await res.json();

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
                                        setShouldPrint(true);
                                    } catch (error) {
                                        toast({ title: "Error", description: "Could not load complete record for printing.", variant: "destructive" });
                                    }
                                }}>
                                    <Printer className="w-4 h-4" /> Print
                                </Button>
                                <Button size="sm" variant="outline" className="gap-2" onClick={async () => {
                                    try {
                                        toast({ title: "Preparing PDF..." });
                                        const res = await fetchWithAuth(`${API_BASE_URL}/api/customers/${r._id}`);
                                        if (!res.ok) throw new Error("Failed to fetch record");
                                        const fullRecord = await res.json();
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
                                        setTimeout(async () => {
                                            if (componentRef.current) {
                                                const name = safeData.personal?.name || 'Record';
                                                await downloadPdf(componentRef.current, `InsureSathi_${name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                                                toast({ title: "Downloaded", description: "PDF downloaded successfully!" });
                                            }
                                        }, 300);
                                    } catch (error) {
                                        toast({ title: "Error", description: "Could not download PDF.", variant: "destructive" });
                                    }
                                }}>
                                    <Download className="w-4 h-4" /> Download PDF
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
      <div className="printable-area" ref={componentRef}>
          {printData && <PdfDocument data={printData} t={t} />}
      </div>
    </div>
  );
}
