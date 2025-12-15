import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { CheckCircle, Download, ArrowLeft, Heart } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DonationSuccess = () => {
    const { id } = useParams();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const receiptRef = useRef(null);

    useEffect(() => {
        const fetchDonation = async () => {
            try {
                const data = await donationService.getDonationById(id);
                setDonation(data);
            } catch (err) {
                console.error('Error fetching donation:', err);
                setError('Failed to load donation details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDonation();
        }
    }, [id]);

    const downloadReceipt = async () => {
        if (!receiptRef.current) return;

        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Donation_Receipt_${donation._id}.pdf`);
        } catch (err) {
            console.error('Error generating PDF:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !donation) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-red-500 mb-4">{error || 'Donation not found'}</div>
                <Link to="/" className="btn-primary">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Donation!</h1>
                    <p className="text-gray-600">Your generosity helps make a real difference.</p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8" ref={receiptRef}>
                    {/* Receipt Header */}
                    <div className="bg-primary p-8 text-white text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Heart className="w-6 h-6 fill-current" />
                            <span className="text-xl font-bold">GiveEasy Receipt</span>
                        </div>
                        <p className="opacity-90">Donation ID: {donation._id}</p>
                    </div>

                    {/* Receipt Body */}
                    <div className="p-8">
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Date</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Amount</p>
                                <p className="text-2xl font-bold text-primary-700">
                                    ₹{donation.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-b border-gray-100 py-6 mb-6">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                Donation Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Campaign</p>
                                    <p className="font-medium text-gray-900">{donation.campaign?.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">NGO / Organization</p>
                                    <p className="font-medium text-gray-900">{donation.campaign?.ngo}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Donor Name</p>
                                    <p className="font-medium text-gray-900">{donation.user?.name}</p>
                                </div>
                                {donation.transactionId && (
                                    <div>
                                        <p className="text-sm text-gray-500">Transaction ID</p>
                                        <p className="font-medium text-gray-900 font-mono text-sm">
                                            {donation.transactionId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            <p>This is a computer enabled receipt.</p>
                            <p>Thank you for supporting this cause.</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={downloadReceipt}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Download Receipt
                    </button>
                    <Link
                        to="/campaigns"
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Explore More Causes
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DonationSuccess;
