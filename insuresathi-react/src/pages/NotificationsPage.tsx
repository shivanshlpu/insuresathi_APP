import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWithAuth('https://insuresathi-app.onrender.com/api/customers/notifications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      })
      .catch(err => {
        console.error(err);
        toast({ title: "Error", description: "Failed to load notifications", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [toast]);

  const handleMarkReviewed = async (id: string) => {
    try {
      await fetchWithAuth(`https://insuresathi-app.onrender.com/api/customers/${id}/reviewed`, { method: 'PATCH' });
      window.location.href = `/register?editId=${id}`;
    } catch (e) {
      console.error("Failed to mark as reviewed", e);
      window.location.href = `/register?editId=${id}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            Notifications
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Unread Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Bell className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p className="text-lg">You're all caught up! No new submissions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div key={n._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">
                        {n.searchable?.name || 'Unknown'} submitted a new form
                      </h3>
                      <p className="text-sm text-slate-600">
                        Received on: {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button onClick={() => handleMarkReviewed(n._id)} className="gap-2 shrink-0">
                      <Eye className="h-4 w-4" /> View Record
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
