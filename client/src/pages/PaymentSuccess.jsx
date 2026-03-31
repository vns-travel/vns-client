import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Home } from "lucide-react";

// PayOS redirects here after the user completes (or attempts) a payment.
// Query params provided by PayOS: orderCode, status, code, id, cancel
// code === '00' means the payment was successful.
export default function PaymentSuccess() {
  const [params] = useSearchParams();

  const code = params.get("code");
  const orderCode = params.get("orderCode");
  const isSuccess = code === "00";

  return (
    <div className="bg-bg-light min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {isSuccess ? (
            <>
              <div className="bg-green-100 w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thanh toán thành công
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Đơn hàng của bạn đã được xác nhận. Cảm ơn bạn đã sử dụng dịch
                vụ VNS.
              </p>
              {orderCode && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 text-sm">
                  <span className="text-gray-500">Mã đơn hàng: </span>
                  <span className="font-mono font-semibold text-gray-800">
                    {orderCode}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="bg-red-100 w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thanh toán thất bại
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương
                thức thanh toán khác.
              </p>
              {orderCode && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 text-sm">
                  <span className="text-gray-500">Mã đơn hàng: </span>
                  <span className="font-mono font-semibold text-gray-800">
                    {orderCode}
                  </span>
                </div>
              )}
            </>
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
