"use client";

import { useState, useMemo } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../constants/config";
import Loader from "@/components/ui/loader";
import { useApiCall } from "@/hooks/useApiCall";

export default function UploadCsvDialog({ children, onUploadSuccess }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState({ rows: [], fields: [] });
  const [parsing, setParsing] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);

  const {
    execute: uploadFile,
    loading: uploading,
    error: uploadError,
  } = useApiCall();

  const previewRows = useMemo(() => parsed.rows.slice(0, 5), [parsed.rows]);

  const resetState = () => {
    setFile(null);
    setParsed({ rows: [], fields: [] });
    setParsing(false);
    setCloudinaryUrl(null);
  };

  // Cloudinary upload function
  const uploadToServer = async (file) => {
    const formData = new FormData();
    formData.append("csv", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await axios.post(API_URL + "/api/upload/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return response.data; // { url, public_id, fileName }
    } catch (error) {
      console.error("Server upload error:", error);
      throw error;
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setParsing(true);

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (result) => {
        const { data, meta, errors } = result;
        if (errors && errors.length) {
          toast.error("Failed to parse CSV");
        } else {
          toast.success("CSV parsed successfully");
        }
        setParsed({ rows: data, fields: meta.fields || [] });
        setParsing(false);
        // No need to call onUploadSuccess here; call it on confirm
      },
      error: (err) => {
        setParsing(false);
        toast.error({
          title: "Failed to parse CSV",
          description: err?.message || "Unknown error",
          variant: "destructive",
        });
      },
    });
  };

  const handleClose = (next) => {
    setOpen(next);
    if (!next) {
      // reset on close for a clean reopen
      resetState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {children ? children : <Button>Upload CSV</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload CSV</DialogTitle>
          <DialogDescription className="text-pretty">
            Select a CSV file to import recipients. We’ll validate the file and
            show a quick preview.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV file</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              disabled={parsing}
            />
            <p className="text-xs text-muted-foreground">
              Expected format: header row followed by data rows. Example
              headers: email, name, company.
            </p>
          </div>

          {file && (
            <div className="text-sm">
              <p className="mb-2">
                <span className="font-medium">Selected:</span> {file.name} (Few Field of CSV)
              </p>
              <div className="rounded-md border">
                <div className="max-h-56 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {parsed.fields.map((f) => (
                          <th
                            key={f}
                            className="px-3 py-2 text-left font-medium"
                          >
                            {f}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsing ? (
                        <tr>
                          <td
                            className="px-3 py-3 text-center"
                            colSpan={parsed.fields.length || 1}
                          >
                            <div className="flex justify-center py-2">
                              <Loader className="mr-2" color="border-white" />
                              <span className="text-muted-foreground">
                                Parsing CSV...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : previewRows.length === 0 ? (
                        <tr>
                          <td
                            className="px-3 py-3 text-muted-foreground text-center"
                            colSpan={parsed.fields.length || 1}
                          >
                            No rows found in this file
                          </td>
                        </tr>
                      ) : (
                        previewRows.map((row, idx) => (
                          <tr key={idx} className="border-t">
                            {parsed.fields.map((f) => (
                              <td key={f} className="px-3 py-2">
                                {String(row?.[f] ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {parsed.rows.length > 0 && (
                  <span>{parsed.rows.length} total row(s) detected.</span>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (onUploadSuccess && file) {
                uploadFile(
                  async () => {
                    // Upload to your backend -> which uploads to Cloudinary
                    const result = await uploadToServer(file);
                    setCloudinaryUrl(result.url);
                    return result;
                  },
                  {
                    successMessage: "CSV uploaded successfully!",
                    errorMessage: "Failed to upload CSV. Please try again.",
                    onSuccess: (result) => {
                      // Call onUploadSuccess with both local data and Cloudinary response
                      onUploadSuccess({
                        name: file.name,
                        data: parsed.rows,
                        fields: parsed.fields,
                        cloudinaryUrl: result.url, // from server response
                        public_id: result.public_id, // optional: to manage later deletions
                        fileId: result.fileId, // if your server returns this
                        rowCount: parsed.rows.length,
                      });

                      handleClose(false);
                    },
                  }
                );
              }
            }}
            disabled={parsing || !file || uploading}
          >
            {uploading ? (
              <>
                <Loader className="mr-2 h-4 w-4" color="border-black" />
                Uploading...
              </>
            ) : (
              "Use this file"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
