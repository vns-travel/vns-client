import { useSearchParams } from "react-router-dom";
import { XCircle, Home } from "lucide-react";

// PayOS redirects here when the user presses "Cancel" on the PayOS checkout page.
// Query params provided by PayOS: orderCode, status, cancel=true
export default function PaymentCancel() {
  const [params] = useSearchParams();
  const orderCode = params.get("orderCode");

  return (
    <div className="bg-bg-light min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="bg-yellow-100 w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đã huỷ thanh toán
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Bạn đã huỷ giao dịch. Đơn hàng vẫn đang ở trạng thái chờ — bạn có
            thể thanh toán lại bất kỳ lúc nào.
          </p>
          {orderCode && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 text-sm">
              <span className="text-gray-500">Mã đơn hàng: </span>
              <span className="font-mono font-semibold text-gray-800">
                {orderCode}
              </span>
            </div>
          )}

          <button
            onClick={() => window.close()}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-colors mb-3"
          >
            <Home className="w-4 h-4" />
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
