// src/components/ResultsDisplay.jsx
export default function ResultsDisplay({ data, viewMode = "all" }) {
  // Determine what to show based on view mode
  const showEntities = viewMode === "all" || viewMode === "entities";
  const showTables = viewMode === "all" || viewMode === "tables";

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
      <div className="flex border-b mb-4">
        {data.pages.map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-medium ${
              index === 0
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Page {index + 1}
          </button>
        ))}
      </div>

      {/* Entities Display - conditionally rendered */}
      {showEntities && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Entities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EntitySection title="Names" items={data.pages[0].entities.names} />
            <EntitySection title="Dates" items={data.pages[0].entities.dates} />
            <EntitySection
              title="Addresses"
              items={data.pages[0].entities.addresses}
            />
          </div>
        </div>
      )}

      {/* Tables Display - conditionally rendered */}
      {showTables && data.pages[0].tables.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Tables</h3>
          {data.pages[0].tables.map((table, index) => (
            <TablePreview key={index} table={table} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
