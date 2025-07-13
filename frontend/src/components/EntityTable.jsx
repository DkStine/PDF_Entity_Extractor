import React from 'react';

const EntityTable = ({ entities }) => {
  if (!entities || !Array.isArray(entities) || entities.length === 0) {
    return <div className="text-gray-500">No entities found</div>;
  }

  // Assume entities have common fields; adjust based on actual API response
  const headers = ['ID', 'Name', 'Type', 'Value'];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entities.map((entity, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2 text-sm text-gray-600">{entity.id || index + 1}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{entity.name || '-'}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{entity.type || '-'}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{entity.value || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntityTable;