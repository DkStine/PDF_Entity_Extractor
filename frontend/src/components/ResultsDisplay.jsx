// src/components/ResultsDisplay.jsx
import { useState } from "react";

export default function ResultsDisplay({ data, viewMode = "all" }) {
  const [activePageIndex, setActivePageIndex] = useState(0);

  const showEntities = viewMode === "all" || viewMode === "entities";
  const showTables = viewMode === "all" || viewMode === "tables";

  const currentPage = data.pages[activePageIndex];

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      {/* Process ID */}
      <div className="mb-4">
        <span className="font-semibold">Process ID:</span>
        <span className="ml-2 font-mono text-sm bg-gray-100 p-1 rounded">
          {data.process_id}
        </span>
      </div>

      {/* Page Tabs */}
      <div className="flex border-b mb-4 overflow-x-auto">
        {data.pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setActivePageIndex(index)}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activePageIndex === index
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Page {index + 1}
          </button>
        ))}
      </div>

      {/* Entities */}
      {showEntities && currentPage?.entities && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Entities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(currentPage.entities).map(([type, items]) => (
              <EntitySection key={type} title={type} items={items} />
            ))}
          </div>
        </div>
      )}

      {/* Tables */}
      {showTables && currentPage?.tables?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Tables</h3>
          {currentPage.tables.map((table, index) => (
            <TablePreview key={index} table={table} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function EntitySection({ title, items = [] }) {
  return (
    <div>
      <h4 className="font-medium mb-1">{title}</h4>
      {items.length > 0 ? (
        <ul className="text-sm list-disc list-inside space-y-1">
          {items.map((item, index) => (
            <li key={index}>{item.text || item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">No {title.toLowerCase()} found.</p>
      )}
    </div>
  );
}

function TablePreview({ table, index }) {
  const headers = table.length > 0 ? Object.keys(table[0]) : [];
  return (
    <div className="overflow-x-auto border rounded mb-4">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, rIdx) => (
            <tr key={rIdx} className="border-t">
              {headers.map((h) => (
                <td key={h} className="px-3 py-1">
                  {row[h] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
