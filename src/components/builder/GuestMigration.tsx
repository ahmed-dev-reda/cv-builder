"use client";

import * as React from "react";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { selectAuthUser } from "@/lib/features/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllGuestCvData,
  getGuestCvs,
  importGuestCvsToAccount,
  deleteGuestCv,
  type CvListItem,
} from "@/lib/persistence";
import { toast } from "sonner";
import { Upload, Trash2, CheckCircle, AlertCircle, FileText } from "lucide-react";

export default function GuestMigration() {
  const user = useAppSelector(selectAuthUser);
  const [guestCvs, setGuestCvs] = useState<CvListItem[]>(() => {
    if (typeof window !== "undefined") {
      return getGuestCvs();
    }
    return [];
  });
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<Array<{ name: string; success: boolean; id?: string; error?: string }>>([]);
  const [showResults, setShowResults] = useState(false);

  const handleImport = async () => {
    if (guestCvs.length === 0) return;

    setImporting(true);
    try {
      const cvData = getAllGuestCvData();
      const importResults = await importGuestCvsToAccount(cvData);
      setResults(importResults);
      setShowResults(true);

      const successCount = importResults.filter((r) => r.success).length;
      const failCount = importResults.filter((r) => !r.success).length;

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} CV(s)`);
      }
      if (failCount > 0) {
        toast.error(`Failed to import ${failCount} CV(s)`);
      }

      // Clear guest CVs after successful import
      if (successCount > 0) {
        guestCvs.forEach((cv) => deleteGuestCv(cv.id));
        setGuestCvs([]);
      }
    } catch {
      toast.error("Failed to import CVs. Your local data is safe.");
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteGuest = (id: string) => {
    deleteGuestCv(id);
    setGuestCvs((prev) => prev.filter((cv) => cv.id !== id));
    toast.success("Guest CV deleted");
  };

  if (!user || guestCvs.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Guest CVs
        </CardTitle>
        <CardDescription>
          You have {guestCvs.length} CV(s) saved in guest mode. Import them to your account to keep them safe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {guestCvs.map((cv) => (
            <div key={cv.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted" />
                <div>
                  <p className="text-sm font-medium">{cv.name}</p>
                  <p className="text-xs text-muted">
                    Updated {new Date(cv.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteGuest(cv.id)}
                className="text-error hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <Button onClick={handleImport} disabled={importing} className="flex-1">
            {importing ? "Importing..." : `Import ${guestCvs.length} CV(s)`}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              guestCvs.forEach((cv) => deleteGuestCv(cv.id));
              setGuestCvs([]);
            }}
          >
            Discard All
          </Button>
        </div>

        {showResults && results.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Import Results:</p>
            {results.map((result, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-md p-2 text-sm ${
                  result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>
                  {result.name}: {result.success ? "Imported" : result.error}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
