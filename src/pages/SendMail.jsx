import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Send,
  Eye,
  Calendar,
  TestTube,
  FileText,
  Database,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Papa from "papaparse";
import axios from "axios";
import { API_URL } from "../../constants/config";
import { useIsMobile } from "../hooks/use-mobile";

export default function SendMail() {
  const isMobile = useIsMobile();
  const [selectedCsv, setSelectedCsv] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [csvPreview, setCsvPreview] = useState({ rows: [], fields: [] });
  const [templatePreview, setTemplatePreview] = useState(null);
  const [showCsvPreview, setShowCsvPreview] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const userData = useSelector((state) => state.user.userData);
  const files = useSelector((state) => state.user.userData?.files || []);
  const templates = useSelector(
    (state) => state.user.userData?.templates || []
  );

  // Debug: Log files whenever they change
  useEffect(() => {
    console.log("SendMail: Files updated:", files);
    console.log("SendMail: userData:", userData);
    console.log("SendMail: Number of files:", files.length);
    files.forEach((file, index) => {
      console.log(`File ${index}:`, file.fileName, file.fileId);
    });
  }, [files, userData]);

  // Force component re-render when user data changes
  useEffect(() => {
    console.log(
      "SendMail: Component mounted/updated with userData:",
      !!userData
    );
  }, [userData]);

  // Load CSV preview when selected
  const handleCsvSelect = async (fileId) => {
    setSelectedCsv(fileId);
    const selectedFile = files.find((f) => f.fileId === fileId);
    if (selectedFile) {
      try {
        const response = await fetch(selectedFile.fileUrl);
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setCsvPreview({
              rows: result.data.slice(0, 5), // First 5 rows for preview
              fields: result.meta.fields,
            });
          },
        });
      } catch (error) {
        toast.error("Failed to load CSV preview");
      }
    }
  };

  // Load template when selected
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t._id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
      setTemplatePreview(template);
    }
  };

  // Get placeholder variables from CSV fields
  const getPlaceholders = () => {
    return csvPreview.fields.map((field) => `{{${field}}}`);
  };

  // Replace placeholders with sample data for preview
  const getPreviewText = (text, rowIndex = 0) => {
    if (!csvPreview.rows.length) return text;
    let previewText = text;
    csvPreview.fields.forEach((field) => {
      const placeholder = `{{${field}}}`;
      const value = csvPreview.rows[rowIndex]?.[field] || `[${field}]`;
      previewText = previewText.replace(new RegExp(placeholder, "g"), value);
    });
    return previewText;
  };

  const handleSendTest = () => {
    if (!testEmail) {
      toast.error("Please enter test email address");
      return;
    }
    if (!selectedCsv || !subject || !body) {
      toast.error("Please select CSV, enter subject and body");
      return;
    }
    // TODO: Implement test mail sending
    toast.success(`Test mail sent to ${testEmail}`);
    setShowTestDialog(false);
    setTestEmail("");
  };

  // const handleScheduleMail = () => {
  //   if (!scheduleDate || !scheduleTime) {
  //     toast.error("Please select date and time");
  //     return;
  //   }
  //   if (!selectedCsv || !selectedTemplate || !subject || !body) {
  //     toast.error("Please select CSV, template and fill mail details");
  //     return;
  //   }
  //   // TODO: Implement mail scheduling
  //   toast.success(`Mail scheduled for ${scheduleDate} at ${scheduleTime}`);
  //   setShowScheduleDialog(false);
  // };

  const handleSendNow = async () => {
    if (!selectedCsv || !subject || !body) {
      toast.error("Please select CSV, enter subject and body");
      return;
    }

    try {
      // Use axios for the request
      let result;
      try {
        const response = await axios.post(
          API_URL + "/api/email/send-mass",
          {
            csvFileId: selectedCsv,
            subject,
            body,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        result = response.data;
      } catch (err) {
        if (err.response && err.response.data) {
          result = err.response.data;
        } else {
          toast.error("Failed to send emails");
          console.error(err);
          return;
        }
      }

      if (result.success) {
        toast.success(
          `Emails sent successfully! ${result.results.successful}/${result.results.total} sent`
        );
      } else {
        toast.error(result.message || "Failed to send emails");
      }
    } catch (error) {
      toast.error("Failed to send emails");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg md:text-xl">
            <Send className="mr-2 h-5 w-5" />
            Send Mail
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top Section: Select CSV & Template */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="csv-select">Select CSV File</Label>
             
              <div className="flex gap-2">
                <Select
                  key={`csv-select-${files.length}`}
                  value={selectedCsv}
                  onValueChange={handleCsvSelect}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose CSV file..." />
                  </SelectTrigger>
                  <SelectContent>
                    {files.length === 0 ? (
                      <SelectItem disabled value="no-files">
                        No CSV files uploaded yet
                      </SelectItem>
                    ) : (
                      files.map((file) => (
                        <SelectItem key={file.fileId} value={file.fileId}>
                          {file.fileName || file.name} ({file.rowCount} rows)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Dialog open={showCsvPreview} onOpenChange={setShowCsvPreview}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!selectedCsv}
                      className="px-3 shrink-0"
                      title="Preview CSV"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>CSV Preview (First 5 rows)</DialogTitle>
                    </DialogHeader>
                    {csvPreview.rows.length > 0 && (
                      <div className="overflow-auto">
                        <table className="w-full text-sm border">
                          <thead>
                            <tr className="bg-muted">
                              {csvPreview.fields.map((field) => (
                                <th
                                  key={field}
                                  className="px-3 py-2 text-left border"
                                >
                                  {field}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {csvPreview.rows.map((row, idx) => (
                              <tr key={idx} className="border-b">
                                {csvPreview.fields.map((field) => (
                                  <td key={field} className="px-3 py-2 border">
                                    {String(row[field] || "")}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-select">Select Template</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedTemplate}
                  onValueChange={handleTemplateSelect}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template._id} value={template._id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog
                  open={showTemplatePreview}
                  onOpenChange={setShowTemplatePreview}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!selectedTemplate}
                      className="px-3 shrink-0"
                      title="Preview Template"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Template Preview</DialogTitle>
                    </DialogHeader>
                    {templatePreview && (
                      <div className="space-y-4">
                        <div>
                          <Label className="font-semibold">Subject:</Label>
                          <p className="p-2 bg-muted rounded mt-1">
                            {getPreviewText(templatePreview.subject)}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Body:</Label>
                          <div className="p-3 bg-muted rounded mt-1 whitespace-pre-wrap">
                            {getPreviewText(templatePreview.body)}
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Placeholder Variables Helper */}
          {csvPreview.fields.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-md">
              <Label className="text-sm font-medium text-blue-900">
                Available Placeholders:
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {getPlaceholders().map((placeholder) => (
                  <span
                    key={placeholder}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs cursor-pointer hover:bg-blue-200"
                    onClick={() => {
                      navigator.clipboard.writeText(placeholder);
                      toast.success(`${placeholder} copied to clipboard`);
                    }}
                  >
                    {placeholder}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Middle Section: Mail Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter email body... Use {{fieldname}} for dynamic content"
                className="min-h-[200px] w-full"
              />
            </div>
          </div>

          {/* Live Preview */}
          {selectedCsv && csvPreview.rows.length > 0 && (subject || body) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Email Preview (with first row data)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="font-semibold">Subject:</Label>
                  <p className="p-2 bg-muted rounded mt-1">
                    {getPreviewText(subject)}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Body:</Label>
                  <div className="p-3 bg-muted rounded mt-1 whitespace-pre-wrap">
                    {getPreviewText(body)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bottom Section: Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {/* Test Mail */}
            {/* <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <TestTube className="h-4 w-4" />
                  {isMobile ? "Test" : "Test Mail"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Test Mail</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-email">Test Email Address</Label>
                    <Input
                      id="test-email"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter email address for testing..."
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowTestDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSendTest}>Send Test</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog> */}

            {/* Schedule Mail
            <Dialog
              open={showScheduleDialog}
              onOpenChange={setShowScheduleDialog}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Calendar className="h-4 w-4" />
                  {isMobile ? "Schedule" : "Schedule Mail"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Mail</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-date">Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowScheduleDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleScheduleMail}>Schedule</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog> */}

            {/* Send Now */}
            <Button
              onClick={handleSendNow}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto sm:ml-auto"
              size={isMobile ? "default" : "lg"}
            >
              <Send className="h-4 w-4" />
              Send Now
            </Button>
          </div>

          {/* Mail Statistics */}
          {selectedCsv && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Recipients:{" "}
                    {files.find((f) => f.fileId === selectedCsv)?.rowCount || 0}
                  </div>
                  <div>
                    Estimated time: ~
                    {Math.ceil(
                      (files.find((f) => f.fileId === selectedCsv)?.rowCount ||
                        0) / 60
                    )}{" "}
                    minutes
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
