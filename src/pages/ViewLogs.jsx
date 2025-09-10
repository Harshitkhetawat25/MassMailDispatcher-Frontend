import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import Loader from "../components/ui/loader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "../hooks/use-mobile";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ViewLogs({ stats, recentActivity }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLogs, setTotalLogs] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all"); // all | success | failed
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (statusFilter && statusFilter !== "all")
          params.append("status", statusFilter);
        if (dateFrom)
          params.append("from", dateFrom.toISOString().split("T")[0]); // Convert to YYYY-MM-DD
        if (dateTo) params.append("to", dateTo.toISOString().split("T")[0]); // Convert to YYYY-MM-DD

        const res = await api.get(`/api/mail/logs?${params.toString()}`);
        setLogs(res.data.logs || []);
        setTotalLogs(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page, limit, statusFilter, dateFrom, dateTo]);

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
          Total logs: {totalLogs}
        </div>
      </div>

      {/* Filters and limit selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-muted-foreground">Status:</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DatePicker
            label="From:"
            date={dateFrom}
            onDateChange={(date) => {
              setDateFrom(date);
              setPage(1);
            }}
            placeholder="Select start date"
            className="w-48"
          />

          <DatePicker
            label="To:"
            date={dateTo}
            onDateChange={(date) => {
              setDateTo(date);
              setPage(1);
            }}
            placeholder="Select end date"
            className="w-48"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm text-muted-foreground">Per page:</Label>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(parseInt(value, 10));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalLogs === 0 ? (
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
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      isActive={page === idx + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(idx + 1);
                      }}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
