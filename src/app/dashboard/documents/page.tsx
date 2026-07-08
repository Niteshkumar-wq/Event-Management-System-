"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { demoDocuments } from "@/lib/demo-data";
import { downloadText, safeFilename } from "@/lib/download-utils";
import { Search, Upload, LayoutGrid, List, FileText, Image, File, FolderOpen, Download, Trash2, Eye } from "lucide-react";

const folders = ["All", "Contracts", "Proposals", "Floor Plans", "Photos", "Insurance", "Branding"];
const typeIcons: Record<string, typeof FileText> = { Contract: FileText, Proposal: FileText, Floorplan: Image, "Run Sheet": File, Insurance: FileText, Branding: Image };

function buildDocumentContent(doc: (typeof demoDocuments)[0]) {
  return [
    "EventPro — Document Export",
    "==========================",
    "",
    `Document: ${doc.name}`,
    `Type: ${doc.type}`,
    `Size: ${doc.size}`,
    `Event: ${doc.eventName || "General"}`,
    `Uploaded By: ${doc.uploadedBy}`,
    `Date: ${doc.createdAt}`,
    "",
    "--- Demo Content ---",
    "",
    `This is a demo export for "${doc.name}".`,
    "In production, the actual file would be downloaded from cloud storage.",
    "",
    `Generated: ${new Date().toLocaleString()}`,
  ].join("\n");
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeFolder, setActiveFolder] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleDownload = (doc: (typeof demoDocuments)[0]) => {
    downloadText(buildDocumentContent(doc), safeFilename(doc.name, "txt"));
    showToast(`Downloaded "${doc.name}"`);
  };

  const filtered = demoDocuments.filter((d) => {
    const ms = d.name.toLowerCase().includes(search.toLowerCase());
    const mf = activeFolder === "All" || d.type.toLowerCase().includes(activeFolder.toLowerCase());
    return ms && mf;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm shadow-lg">{toast}</div>
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Documents</h1><p className="text-sm text-slate-500 mt-0.5">Manage all event documents and files</p></div>
        <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"><Upload className="w-4 h-4" /> Upload</button>
      </div>

      {showUpload && (
        <div className="glass-card p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-teal-500/50 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-slate-700">Drag & drop files here or click to browse</p>
            <p className="text-xs text-slate-500 mt-1">PDF, DOCX, Images up to 50MB</p>
          </div>
          <div className="flex gap-3 mt-4"><button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg">Upload Files</button><button onClick={() => setShowUpload(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg">Cancel</button></div>
        </div>
      )}

      <div className="flex gap-6">
        <div className="w-48 shrink-0 space-y-1">
          {folders.map((f) => (
            <button key={f} onClick={() => setActiveFolder(f)} className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left", activeFolder === f ? "bg-teal-600/15 text-teal-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800")}>
              <FolderOpen className="w-4 h-4" />{f}
            </button>
          ))}
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative max-w-xs w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" /></div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-teal-600 text-white" : "text-slate-400")}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setView("list")} className={cn("p-1.5 rounded-md transition-colors", view === "list" ? "bg-teal-600 text-white" : "text-slate-400")}><List className="w-4 h-4" /></button>
            </div>
          </div>

          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((doc) => {
                const Icon = typeIcons[doc.type] || FileText;
                return (
                  <div key={doc.id} className="glass-card p-4 group cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-teal-50"><Icon className="w-5 h-5 text-teal-600" /></div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded hover:bg-slate-100" title="Preview"><Eye className="w-3.5 h-3.5 text-slate-400" /></button>
                        <button onClick={() => handleDownload(doc)} className="p-1 rounded hover:bg-slate-100" title="Download"><Download className="w-3.5 h-3.5 text-slate-400" /></button>
                        <button className="p-1 rounded hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5 text-red-600" /></button>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-slate-800 mt-3 line-clamp-1">{doc.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{doc.type}</span>
                      <span className="text-[10px] text-slate-600">{doc.size}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-600">
                      <span>{doc.uploadedBy}</span><span>{doc.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="w-full"><thead><tr className="border-b border-slate-200/50">
                {["Name", "Type", "Size", "Uploaded By", "Event", "Date", ""].map((h) => <th key={h || "actions"} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
              </tr></thead><tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-100 table-row-hover">
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-teal-600" /><span className="text-sm text-slate-800">{doc.name}</span></div></td>
                    <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{doc.type}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{doc.size}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{doc.uploadedBy}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{doc.eventName || "General"}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{doc.createdAt}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDownload(doc)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-teal-600" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
