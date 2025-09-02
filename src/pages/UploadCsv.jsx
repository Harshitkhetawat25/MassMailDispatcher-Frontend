"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, Eye, Trash2, FileSpreadsheet } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import UploadCsvDialog from "@/components/UploadCsvDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Papa from "papaparse";
import { setUserData, addFile, deleteFile } from "@/redux/userSlice";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import axios from "axios";
import { API_URL } from "../../constants/config";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader";
import { useApiCall } from "@/hooks/useApiCall";
import { useIsMobile } from "../hooks/use-mobile";

export default function UploadCsv() {
  const isMobile = useIsMobile();
  const { refetchUser } = useGetCurrentUser();
  const [viewingFileIdx, setViewingFileIdx] = useState(null);
  const [csvRows, setCsvRows] = useState([]);
  const [csvFields, setCsvFields] = useState([]);
  const [fetchingCsv, setFetchingCsv] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [recentlyUploadedFiles, setRecentlyUploadedFiles] = useState(new Set());
  const [localFileData, setLocalFileData] = useState(new Map()); // Store local CSV data

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const files = userData?.files || [];

  const { execute: executeDeleteFile } = useApiCall();

  // Callback when CSV is uploaded successfully
  const handleUploadSuccess = (fileInfo) => {
    console.log("CSV uploaded with Cloudinary URL:", fileInfo.cloudinaryUrl);
    // Refetch user data from backend to update Redux and UI
    refetchUser();

    // Optionally, keep local instant preview for a snappy UI
    if (fileInfo.fileId) {
      setRecentlyUploadedFiles((prev) => new Set([...prev, fileInfo.fileId]));
      if (fileInfo.data && fileInfo.fields) {
        setLocalFileData(
          (prev) =>
            new Map(
              prev.set(fileInfo.fileId, {
                rows: fileInfo.data,
                fields: fileInfo.fields,
              })
            )
        );
      }
      setTimeout(() => {
        setRecentlyUploadedFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileInfo.fileId);
          return newSet;
        });
        setLocalFileData((prev) => {
          const newMap = new Map(prev);
          newMap.delete(fileInfo.fileId);
          return newMap;
        });
      }, 30000);
    }
  };

  // Fetch & parse CSV from Cloudinary with fallback to local data
  const handleViewCsv = async (fileUrl, idx, fileId, retryCount = 0) => {
    setFetchingCsv(true);

    // First, try to use local data if available (for recently uploaded files)
    if (localFileData.has(fileId)) {
      const localData = localFileData.get(fileId);
      setCsvRows(localData.rows);
      setCsvFields(localData.fields);
      setViewingFileIdx(idx);
      setFetchingCsv(false);
      return;
    }

    try {
      const response = await fetch(fileUrl);

      // Check if response is successful
      if (!response.ok) {
        if (retryCount < 2) {
          // Retry after a short delay
          setTimeout(() => {
            handleViewCsv(fileUrl, idx, fileId, retryCount + 1);
          }, 2000);
          return;
        }
        throw new Error(
          `Failed to fetch file after ${retryCount + 1} attempts`
        );
      }

      const text = await response.text();

      // Check if the response contains HTML (error page) instead of CSV
      if (
        text.trim().toLowerCase().startsWith("<!doctype") ||
        text.trim().toLowerCase().startsWith("<html")
      ) {
        if (retryCount < 2) {
          // Retry after a short delay
          setTimeout(() => {
            handleViewCsv(fileUrl, idx, fileId, retryCount + 1);
          }, 3000);
          return;
        }
        throw new Error(
          "File not accessible. Please try again later or refresh the page."
        );
      }

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors && result.errors.length > 0) {
            console.warn("CSV parsing warnings:", result.errors);
          }
          setCsvRows(result.data);
          setCsvFields(result.meta.fields || []);
          setViewingFileIdx(idx);
        },
        error: (error) => {
          throw new Error(`Failed to parse CSV: ${error.message}`);
        },
      });
    } catch (err) {
      console.error("Error viewing CSV:", err);
      toast.error(
        err.message || "Failed to fetch CSV file. Please try again later."
      );
      setViewingFileIdx(null);
      setCsvRows([]);
      setCsvFields([]);
    } finally {
      setFetchingCsv(false);
    }
  };

  // Delete CSV from backend + update Redux
  const handleDeleteCsv = (fileId) => {
    const fileToDelete = files.find((f) => f.fileId === fileId);

    if (!fileId || !fileToDelete) {
      toast.error("Cannot delete: File ID not found");
      return;
    }

    setDeletingFileId(fileId);

    executeDeleteFile(
      () =>
        axios.delete(
          API_URL + "/api/upload/deletecsv/" + encodeURIComponent(fileId),
          { withCredentials: true }
        ),
      {
        successMessage: "CSV deleted successfully",
        errorMessage: "Failed to delete CSV file",
        onSuccess: (response) => {
          if (response.status === 200) {
            dispatch(deleteFile(fileId));

            // Reset viewing state if the deleted file was being viewed
            if (
              viewingFileIdx !== null &&
              files[viewingFileIdx]?.fileId === fileId
            ) {
              setViewingFileIdx(null);
              setCsvRows([]);
              setCsvFields([]);
            }
          }
        },
        onError: () => {
          // Reset loading state on error
          setDeletingFileId(null);
        },
      }
    ).finally(() => {
      setDeletingFileId(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          <h2 className="text-xl md:text-2xl font-bold">Upload CSV</h2>
        </div>
        <UploadCsvDialog onUploadSuccess={handleUploadSuccess}>
          <Button className="flex items-center w-full sm:w-auto">
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
        </UploadCsvDialog>
      </div>

      {/* Show all uploaded files */}
      {files.length > 0 ? (
        <div className="space-y-4">
          {recentlyUploadedFiles.size > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              <span className="text-green-500">✓</span> Recently uploaded files
              are ready for instant viewing using local data.
            </div>
          )}

          {/* Mobile Card View */}
          {isMobile ? (
            <div className="space-y-4">
              {files.map((file, idx) => (
                <Card key={file.fileId || idx} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate flex items-center">
                          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                          {file.fileName || file.name}
                        </h3>
                        {file.rowCount && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {file.rowCount} rows
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            viewingFileIdx === idx
                              ? setViewingFileIdx(null)
                              : handleViewCsv(
                                  file.fileUrl || file.cloudinaryUrl,
                                  idx,
                                  file.fileId
                                )
                          }
                          disabled={fetchingCsv && viewingFileIdx !== idx}
                          className="flex-1"
                        >
                          {fetchingCsv && viewingFileIdx === idx ? (
                            <>
                              <Loader className="mr-2 h-4 w-4" />
                              Loading...
                            </>
                          ) : viewingFileIdx === idx ? (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                              {recentlyUploadedFiles.has(file.fileId) && (
                                <span className="ml-1 text-xs text-orange-500">
                                  *
                                </span>
                              )}
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCsv(file.fileId)}
                          disabled={deletingFileId === file.fileId}
                        >
                          {deletingFileId === file.fileId ? (
                            <Loader className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <a
                          href={file.fileUrl || file.cloudinaryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </Button>
                    </div>

                    {/* CSV Table Preview for Mobile */}
                    {viewingFileIdx === idx && csvFields.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">
                          Preview (first 10 rows)
                        </h4>
                        <div className="overflow-x-auto border rounded-md max-h-64">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-muted">
                                {csvFields.map((f) => (
                                  <th
                                    key={f}
                                    className="px-2 py-2 text-left font-medium min-w-[100px]"
                                  >
                                    {f}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {csvRows.slice(0, 10).map((row, i) => (
                                <tr key={i} className="border-b">
                                  {csvFields.map((f) => (
                                    <td key={f} className="px-2 py-2">
                                      <div className="max-w-[100px] truncate">
                                        {String(row[f] ?? "")}
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop Table View */
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Uploaded CSVs</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">File Name</th>
                        <th className="text-left p-4 font-medium">Rows</th>
                        <th className="text-center p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file, idx) => (
                        <tr
                          key={file.fileId || idx}
                          className="border-b hover:bg-muted/25"
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                              <div className="max-w-[250px] truncate font-medium">
                                {file.fileName || file.name}
                                {recentlyUploadedFiles.has(file.fileId) && (
                                  <span className="ml-1 text-xs text-orange-500">
                                    *
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {file.rowCount || "-"}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  viewingFileIdx === idx
                                    ? setViewingFileIdx(null)
                                    : handleViewCsv(
                                        file.fileUrl || file.cloudinaryUrl,
                                        idx,
                                        file.fileId
                                      )
                                }
                                disabled={fetchingCsv && viewingFileIdx !== idx}
                              >
                                {fetchingCsv && viewingFileIdx === idx ? (
                                  <Loader className="h-4 w-4" />
                                ) : viewingFileIdx === idx ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={file.fileUrl || file.cloudinaryUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Download
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCsv(file.fileId)}
                                disabled={deletingFileId === file.fileId}
                                className="text-red-600 hover:text-red-700"
                              >
                                {deletingFileId === file.fileId ? (
                                  <Loader className="h-4 w-4" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CSV Table Preview for Desktop */}
                {viewingFileIdx !== null && csvFields.length > 0 && (
                  <div className="border-t p-4">
                    <h4 className="font-medium mb-3">CSV Preview</h4>
                    <div className="overflow-auto border rounded-md max-h-96">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted">
                            {csvFields.map((f) => (
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
                          {csvRows.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-muted/25">
                              {csvFields.map((f) => (
                                <td key={f} className="px-3 py-2">
                                  {String(row[f] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileSpreadsheet className="mx-auto mt-4 h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                No CSV files uploaded yet
              </p>
              <p className="text-sm text-muted-foreground">
                Upload your first CSV file to get started with mass email
                campaigns.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
