import { Trash2, AlertTriangle } from "lucide-react";

/**
 * Reusable dialog for delete confirmation and non-actionable warnings.
 *
 * Props:
 *   open        — boolean, controls visibility
 *   title       — dialog heading
 *   message     — body text
 *   onConfirm   — called when the user clicks the red Xóa button (confirm mode only)
 *   onCancel    — called when the user clicks Hủy / Đã hiểu / backdrop
 *   warningOnly — when true, shows a yellow warning icon and a single "Đã hiểu" button
 *                 (use this for edge cases where the action is blocked, not just risky)
 */
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, warningOnly = false }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${warningOnly ? "bg-yellow-100" : "bg-red-100"}`}>
          {warningOnly
            ? <AlertTriangle className="w-6 h-6 text-yellow-600" />
            : <Trash2 className="w-6 h-6 text-red-600" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

        {warningOnly ? (
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium"
          >
            Đã hiểu
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Xóa
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmDialog;
