import React from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";

const ExcelExportUtils = ({
  data,
  chartRef,
  filename = "report",
  title = "Report",
}) => {
  const exportToExcel = async () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Add data worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Auto-size columns
      const colWidths = [];
      const range = XLSX.utils.decode_range(ws["!ref"]);

      for (let C = range.s.c; C <= range.e.c; ++C) {
        let max_width = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
          if (cell && cell.v) {
            const width = cell.v.toString().length;
            if (width > max_width) max_width = width;
          }
        }
        colWidths.push({ wch: Math.min(max_width + 2, 50) });
      }
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Data");

      // Capture chart if chartRef is provided
      if (chartRef && chartRef.current) {
        try {
          const canvas = await html2canvas(chartRef.current, {
            backgroundColor: "white",
            scale: 2,
            useCORS: true,
          });

          // Convert canvas to base64
          const imageData = canvas.toDataURL("image/png");

          // Create image worksheet
          const imageWs = XLSX.utils.aoa_to_sheet([
            ["Chart"],
            [""],
            ["Chart Image Below:"],
          ]);

          // Note: XLSX doesn't directly support images, but we can add a link
          // In production, you might want to use a library like exceljs instead
          XLSX.utils.book_append_sheet(wb, imageWs, "Chart");
        } catch (error) {
          console.warn("Chart capture failed:", error);
        }
      }

      // Write file
      XLSX.writeFile(
        wb,
        `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <button
      onClick={exportToExcel}
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
      Export to Excel
    </button>
  );
};

export default ExcelExportUtils;
