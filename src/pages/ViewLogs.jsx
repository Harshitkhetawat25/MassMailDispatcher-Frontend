import { useEffect, useState } from "react";
import { API_URL } from "../../constants/config";
import axios from "axios";
import Loader from "../components/ui/loader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "../hooks/use-mobile";

export default function ViewLogs({ stats, recentActivity }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL + "/api/mail/logs", {
          withCredentials: true,
        });
        setLogs(response.data.logs || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    return status === "success"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="h-[50vh] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Email Logs</h2>
        <div className="text-sm text-muted-foreground">
          Total logs: {logs.length}
        </div>
      </div>

      {logs.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">No logs found.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Email logs will appear here once you start sending emails.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Card View */}
          {isMobile ? (
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log._id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {log.recipient}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {log.subject}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(log.status)}
                      >
                        {log.status}
                      </Badge>
                    </div>

                    {log.error && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        {log.error}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      {formatDate(log.sentAt)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop Table View */
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">Recipient</th>
                        <th className="text-left p-4 font-medium">Subject</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Error</th>
                        <th className="text-left p-4 font-medium">Sent At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr
                          key={log._id}
                          className="border-b hover:bg-muted/25"
                        >
                          <td className="p-4">
                            <div className="max-w-[200px] truncate">
                              {log.recipient}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="max-w-[250px] truncate">
                              {log.subject}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="secondary"
                              className={getStatusColor(log.status)}
                            >
                              {log.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="max-w-[200px] truncate">
                              {log.error || "-"}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDate(log.sentAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
