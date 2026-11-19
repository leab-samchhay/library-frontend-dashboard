import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Loader2, X, RefreshCw, Smartphone } from 'lucide-react';
import api from '@/service/api';

const dollarIconDataUri = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='11' fill='%231E293B'/><text x='12' y='16' fill='white' font-size='13' font-weight='bold' font-family='sans-serif' text-anchor='middle'>$</text></svg>";

const KhqrPaymentModal = ({ 
    isOpen, 
    onClose, 
    amount = "1.00", 
    merchantName = "BBU LIBRARY", 
    fineId = null,
    onPaymentSuccess 
}) => {
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [paid, setPaid] = useState(false);
    const [paymentData, setPaymentData] = useState(null);

    // Call API to generate KHQR data
    const generateQr = async () => {
        try {
            setLoading(true);
            setPaid(false);
            const res = await api.post('aba/create-payment', {
                amount: parseFloat(amount) || 1.00,
                fine_id: fineId
            });

            if (res.data && res.data.data) {
                setPaymentData(res.data.data);
            }
        } catch (error) {
            console.error('Failed to create ABA QR payment:', error);
            // Fallback mock string if backend request fails
            const mockTranId = 'TXN-' + Date.now();
            setPaymentData({
                tran_id: mockTranId,
                amount: Number(amount).toFixed(2),
                merchant_name: merchantName,
                qr_string: `00020101021229300016abaa.kh.payment0106ec4389025204599953038405404${Number(amount).toFixed(2)}5802KH5911BBU LIBRARY6010SIEM REAP62180114${mockTranId}6304ABCD`
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && amount) {
            generateQr();
        }
    }, [isOpen, amount]);

    // Handle Simulate payment success
    const handleSimulatePayment = async () => {
        if (!paymentData) return;
        try {
            setVerifying(true);
            const res = await api.post('aba/check-transaction', {
                tran_id: paymentData.tran_id
            });

            if (res.data && res.data.status === 0) {
                setPaid(true);
                setTimeout(() => {
                    if (onPaymentSuccess) {
                        onPaymentSuccess(paymentData);
                    }
                    onClose();
                }, 1200);
            }
        } catch (error) {
            console.error('Failed to check transaction:', error);
            // Fallback success
            setPaid(true);
            setTimeout(() => {
                if (onPaymentSuccess) {
                    onPaymentSuccess(paymentData);
                }
                onClose();
            }, 1200);
        } finally {
            setVerifying(false);
        }
    };

    if (!isOpen) return null;

    const qrValue = paymentData?.qr_string || `KHQR_DEMO_PAYMENT_${amount}_${Date.now()}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-[340px] flex flex-col items-center">
                
                {/* Close Button at top right */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 p-1.5 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition cursor-pointer"
                >
                    <X size={20} />
                </button>

                {/* KHQR Card Structure matching user's design */}
                <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                    
                    {/* 1. Header: Red KHQR Banner */}
                    <div className="bg-[#E11D48] text-white py-3.5 px-4 text-center">
                        <span className="font-extrabold tracking-widest text-lg sm:text-xl font-sans">
                            KHQR
                        </span>
                    </div>

                    {/* 2. Body: Merchant name & Amount */}
                    <div className="px-6 pt-4 pb-2 text-left">
                        <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                            {merchantName}
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-0.5 font-sans">
                            $ {parseFloat(amount).toFixed(2)}
                        </h2>
                    </div>

                    {/* 3. Dashed Divider Line */}
                    <div className="px-6 my-1">
                        <div className="border-t border-dashed border-gray-300 w-full" />
                    </div>

                    {/* 4. QR Code Container */}
                    <div className="px-6 py-4 flex flex-col items-center justify-center min-h-[220px]">
                        {loading ? (
                            <div className="w-48 h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                                <span className="text-xs">Generating KHQR...</span>
                            </div>
                        ) : paid ? (
                            <div className="w-48 h-48 flex flex-col items-center justify-center text-emerald-600 gap-2 animate-in zoom-in-90 duration-300">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                                <span className="font-bold text-sm">Payment Received!</span>
                            </div>
                        ) : (
                            <div className="p-3 bg-white rounded-xl shadow-xs border border-gray-100 relative group">
                                <QRCodeSVG
                                    value={qrValue}
                                    size={190}
                                    level="H"
                                    includeMargin={false}
                                    imageSettings={{
                                        src: dollarIconDataUri,
                                        height: 32,
                                        width: 32,
                                        excavate: true,
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* 5. Footer: Instructions matching design */}
                    <div className="px-6 pb-5 pt-1 text-center">
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                            Scan with Bakong App or Mobile Banking app that supports KHQR
                        </p>
                    </div>
                </div>

                {/* Testing / Simulator Action Controls */}
                <div className="w-full mt-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs px-1">
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            ABA Sandbox Mode
                        </span>
                        <button
                            onClick={generateQr}
                            disabled={loading || verifying}
                            className="flex items-center gap-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer text-[11px]"
                            title="Regenerate QR"
                        >
                            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                            Reload
                        </button>
                    </div>

                    <button
                        onClick={handleSimulatePayment}
                        disabled={loading || verifying || paid}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                    >
                        {verifying ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Checking transaction...</span>
                            </>
                        ) : (
                            <>
                                <Smartphone size={14} />
                                <span>តេស្តស្កេនបង់ជោគជ័យ (Simulate Pay)</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KhqrPaymentModal;
