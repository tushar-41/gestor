"use client";

export default function NoteDetailsModal({ note, onClose }) {
  const getLanguageBadgeColor = (language) => {
    const colors = {
      javascript: "bg-yellow-50 text-yellow-700",
      typescript: "bg-blue-50 text-blue-700",
      python: "bg-green-50 text-green-700",
      java: "bg-red-50 text-red-700",
      cpp: "bg-purple-50 text-purple-700",
    };
    return colors[language] || "bg-slate-50 text-slate-700";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex-1">
            <h2 className="text-[20px] font-semibold text-slate-900 mb-2">
              {note.title}
            </h2>
            {note.language && (
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-semibold ${getLanguageBadgeColor(note.language)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                {note.language.toUpperCase()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Note Content */}
          {note.content && (
            <div>
              <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Note Content
              </p>
              <div className="prose prose-sm max-w-none">
                <p className="text-[14px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>
            </div>
          )}

          {/* Code Snippet */}
          {note.codeSnippet && (
            <div>
              <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Code Snippet ({note.language})
              </p>
              <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                <pre className="text-[12px] text-slate-200 font-mono">
                  <code>{note.codeSnippet}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Tags */}
          {note.tags && (
            <div>
              <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {note.tags.split(",").map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-[12px] bg-blue-100 text-blue-700 rounded-lg"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
              Information
            </p>
            <div className="space-y-2 text-[13px] text-slate-600">
              <p>📝 <span className="font-medium">Title:</span> {note.title}</p>
              {note.language && (
                <p>💻 <span className="font-medium">Language:</span> {note.language}</p>
              )}
              {note.tags && (
                <p>🏷️ <span className="font-medium">Tags:</span> {note.tags}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
