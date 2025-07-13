export default function ErrorMessage({ message }) {
  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-medium text-red-800">Processing Error</h3>
          <p className="text-red-700 mt-1">{message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-800 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
