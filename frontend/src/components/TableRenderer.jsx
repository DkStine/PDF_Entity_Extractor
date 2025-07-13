import React from 'react';

const TableRenderer = ({ tables }) => {
  if (!tables || !Array.isArray(tables) || tables.length === 0) {
    return <div className="text-gray-500">No tables found</div>;
  }

  return (
    <div className="space-y-6">
      {tables.map((table, tableIndex) => {
        // Assume table is an array of objects or arrays; extract headers from first row if needed
        const headers = table[0] && typeof table[0] === 'object' && !Array.isArray(table[0])
          ? Object.keys(table[0])
          : table[0] || ['Column 1', 'Column 2']; // Fallback headers

        return (
          <div key={tableIndex} className="overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">Table {tableIndex + 1}</h3>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {Array.isArray(row)
                      ? row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm text-gray-600">
                            {cell || '-'}
                          </td>
                        ))
                      : headers.map((header, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm text-gray-600">
                            {row[header] || '-'}
                          </td>
                        ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default TableRenderer;