import { useState } from 'react';
import { X, ArrowLeft, CheckCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react'; // Using QRCodeCanvas for better rendering
import { donationService } from '../services/donationService';

const DonationModal = ({ campaign, isOpen, onClose, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Amount, 2: QR Code

    const presetAmounts = [500, 1000, 2500, 5000];

    const generateUPIString = () => {
        if (!campaign.upiId || !amount) return '';
        // UPI Link format: upi://pay?pa={upiId}&am={amount}&cu=INR
        // &pn={campaign.ngo} (Payee Name - optional but good)
        // &tn={campaign.title.substring(0, 20)} (Transaction Note)
        return `upi://pay?pa=${campaign.upiId}&pn=${encodeURIComponent(campaign.ngo)}&tn=Donation&am=${amount}&cu=INR`;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!amount) return;
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleConfirmPayment = async () => {
        setError('');
        setLoading(true);

        try {
            await donationService.createDonation({
                campaign: campaign._id,
                amount: Number(amount),
                message,
                transactionId: `UPI-${Date.now()}-${Math.floor(Math.random() * 1000)}` // Mock transaction ID
            });
            onSuccess?.();
            onClose();
            // Reset form
            setAmount('');
            setMessage('');
            setStep(1);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process donation');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        {step === 2 && (
                            <button
                                onClick={handleBack}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 1 ? 'Make a Donation' : 'Scan to Pay'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Campaign Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Donating to</p>
                        <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                        <p className="text-sm text-primary-700">{campaign.ngo}</p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleNext} className="space-y-6">
                            {/* Preset Amounts */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Amount
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {presetAmounts.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset.toString())}
                                            className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${amount === preset.toString()
                                                ? 'border-primary bg-primary/10 text-gray-900'
                                                : 'border-gray-200 hover:border-primary/50'
                                                }`}
                                        >
                                            ₹{preset.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Or Enter Custom Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="input-field pl-8"
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message (Optional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="input-field resize-none"
                                    rows="3"
                                    placeholder="Leave a message of support..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!amount}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3"
                            >
                                Proceed to Pay
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center space-y-6">
                            <div className="text-center">
                                <p className="text-gray-600 mb-2">Scan this QR code with any UPI app</p>
                                <p className="text-2xl font-bold text-gray-900">₹{Number(amount).toLocaleString()}</p>
                            </div>

                            <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
                                {campaign.upiId ? (
                                    <QRCodeCanvas
                                        value={generateUPIString()}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                ) : (
                                    <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-center p-4">
                                        UPI ID not available for this campaign
                                    </div>
                                )}
                            </div>

                            {campaign.upiId && (
                                <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-mono">
                                    UPI ID: {campaign.upiId}
                                </p>
                            )}

                            {error && (
                                <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="w-full space-y-3">
                                <button
                                    onClick={handleConfirmPayment}
                                    disabled={loading}
                                    className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-3"
                                >
                                    {loading ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            I Have Paid
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleBack}
                                    className="w-full btn-secondary py-3"
                                >
                                    Change Amount
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
