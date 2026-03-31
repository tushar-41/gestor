"use client";

export default function ConfirmationModal({
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onCancel} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-[18px] font-semibold text-slate-900">
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-[14px] text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-[14px] font-medium text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg text-[14px] font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDestructive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
