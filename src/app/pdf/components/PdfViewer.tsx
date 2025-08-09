"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
//import "pdfjs-dist/web/pdf_viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  fileUrl: string;
  initialPage: number;
  onPageChange: (page: number) => void;
}

export default function PdfViewer({ fileUrl, initialPage, onPageChange }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (pageNumber > numPages) setPageNumber(1);
  }

  useEffect(() => {
    onPageChange(pageNumber);
  }, [pageNumber, onPageChange]);

  const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages));
  const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls mb-2 flex gap-2 items-center justify-center">
        <button onClick={prevPage} disabled={pageNumber <= 1}>← Prev</button>
        <span>Page {pageNumber} / {numPages}</span>
        <button onClick={nextPage} disabled={pageNumber >= numPages}>Next →</button>
        <button onClick={zoomOut}>- Zoom</button>
        <button onClick={zoomIn}>+ Zoom</button>
      </div>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Chargement du document..."
        error={<p>Erreur chargement PDF</p>}
        noData={<p>Aucun document à afficher</p>}
      >
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>
    </div>
  );
}
