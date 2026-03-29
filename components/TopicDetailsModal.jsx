"use client";

export default function TopicDetailsModal({ topic, childTopics, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-[20px] font-semibold text-slate-900">
            Topic Details
          </h2>
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
          {/* Main Info */}
          <div>
            <h3 className="text-[24px] font-semibold text-slate-900 mb-2">
              {topic.name}
            </h3>
            <p className="text-[14px] text-slate-600 mb-4">{topic.category}</p>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold ${
                  topic.difficulty === "BEGINNER"
                    ? "bg-green-50 text-green-700"
                    : topic.difficulty === "INTERMEDIATE"
                      ? "bg-blue-50 text-blue-700"
                      : topic.difficulty === "ADVANCED"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-red-50 text-red-700"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {topic.difficulty}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[12px] text-slate-600 font-medium mb-1">
                Confidence Level
              </p>
              <p className="text-[24px] font-semibold text-blue-600">
                {topic.confidenceLevel}/5
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[12px] text-slate-600 font-medium mb-1">
                Learned Date
              </p>
              <p className="text-[14px] font-semibold text-slate-900">
                {topic.learnedDate
                  ? new Date(topic.learnedDate).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
          </div>

          {/* Tags */}
          {topic.tags && (
            <div>
              <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {topic.tags.split(",").map((tag, idx) => (
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

          {/* Child Topics */}
          <div>
            <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Child Topics ({childTopics.length})
            </p>
            {childTopics.length === 0 ? (
              <p className="text-[13px] text-slate-500 py-3">
                No child topics yet
              </p>
            ) : (
              <div className="space-y-2">
                {childTopics.map((child) => (
                  <div
                    key={child.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <p className="text-[13px] font-medium text-slate-900">
                      {child.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[12px] text-slate-500">
                        {child.category}
                      </p>
                      <span className="text-[12px] font-semibold text-blue-600">
                        {child.confidenceLevel}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-[12px] font-semibold text-blue-900 mb-2">
              ℹ️ Topic Information
            </p>
            <ul className="text-[12px] text-blue-800 space-y-1">
              <li>• Topic ID: {topic.id}</li>
              {topic.parentTopicId && (
                <li>• Parent Topic ID: {topic.parentTopicId}</li>
              )}
              <li>• Created: {new Date().toLocaleDateString()}</li>
            </ul>
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
