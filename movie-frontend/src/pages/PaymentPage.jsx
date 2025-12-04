import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state || {
    totalPrice: 0,
    movie: { movieName: '未知電影' },
    theater: { name: '' },
    date: '',
    time: ''
  };

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.cardNumber.length < 10) newErrors.cardNumber = '卡號長度不足';
    if (formData.cardName.length < 2) newErrors.cardName = '請輸入完整姓名';
    if (formData.expiry.length < 4) newErrors.expiry = '格式錯誤 (MM/YY)';
    if (formData.cvv.length < 3) newErrors.cvv = '請輸入 3 碼安全碼';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        alert(`付款成功！總金額 $${bookingData.totalPrice}\n感謝您的購買，您的訂單已確認。`);
        navigate('/'); 
      }, 1500);
    }
  };

  if (!location.state) {
    return (
        <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center flex-col">
            <Navbar />
            <h2 className="text-2xl mb-4 mt-20">無效的付款頁面</h2>
            <button onClick={() => navigate('/')} className="text-purple-400 underline">回首頁</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 md:px-20 py-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-8">結帳付款</h1>

        {/* 修改容器寬度，移除右側欄位後，讓表單置中 */}
        <div className="w-full max-w-2xl">
          
          <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-6 bg-purple-600 mr-3 rounded-full"></span>
              信用卡資訊
            </h2>

            {/* 加入 autoComplete="off" 以嘗試隱藏瀏覽器的安全警告 */}
            <form onSubmit={handlePay} className="space-y-6" autoComplete="off">
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">信用卡號碼</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength={19}
                  autoComplete="off"
                  className={`w-full bg-neutral-900 border ${errors.cardNumber ? 'border-red-500' : 'border-neutral-600'} rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                />
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">持卡人姓名</label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="請輸入持卡人姓名"
                  value={formData.cardName}
                  onChange={handleChange}
                  autoComplete="off"
                  className={`w-full bg-neutral-900 border ${errors.cardName ? 'border-red-500' : 'border-neutral-600'} rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                />
                {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-400 text-sm mb-2">到期日 (MM/YY)</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    maxLength={5}
                    autoComplete="off"
                    className={`w-full bg-neutral-900 border ${errors.expiry ? 'border-red-500' : 'border-neutral-600'} rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  />
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>

                <div className="w-1/2">
                  <label className="block text-gray-400 text-sm mb-2">安全碼 (CVV)</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={4}
                    autoComplete="off"
                    className={`w-full bg-neutral-900 border ${errors.cvv ? 'border-red-500' : 'border-neutral-600'} rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-4">
                  <button 
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-1/3 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-4 rounded-full transition duration-300"
                  >
                    返回
                  </button>

                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className={`w-2/3 font-bold py-4 rounded-full transition duration-300 text-lg shadow-lg flex justify-center items-center gap-2
                      ${isProcessing 
                        ? 'bg-neutral-600 text-gray-400 cursor-wait' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/50 transform hover:-translate-y-1'
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        處理中...
                      </>
                    ) : (
                      `確認付款 $ ${bookingData.totalPrice}`
                    )}
                  </button>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}

export default PaymentPage;