import React, { useState } from 'react';
import { X, Calendar, User, Phone, FileText, CheckCircle, Clock, Banknote, Building } from 'lucide-react';
import { Doctor } from '../types';
import { api } from '../api';

interface AppointmentModalProps {
  doctor: Doctor | null;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ doctor, onClose }) => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [problemSummary, setProblemSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!doctor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const res = await api.bookAppointment({
        patientName,
        patientPhone,
        doctorId: doctor.id,
        doctorName: doctor.name,
        hospitalName: doctor.hospital,
        preferredDate,
        problemSummary,
      });

      if (res.success && res.data) {
        setSuccessData({
          id: res.data.id,
          message: res.message || 'সিরিয়াল আবেদন সফলভাবে সম্পন্ন হয়েছে।',
        });
      } else {
        setErrorMessage(res.message || 'সিরিয়াল বুকিং সম্পন্ন করা যায়নি।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'সার্ভার সমস্যা, অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0056b3] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">ডাক্তারের অ্যাপয়েন্টমেন্ট / সিরিয়াল</h3>
            <p className="text-xs text-blue-100">সরাসরি হাসপাতালে সিরিয়াল নিশ্চিত করুন</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">সিরিয়াল সফলভাবে গৃহীত হয়েছে!</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">{successData.message}</p>
              
              <div className="bg-gray-50 p-4 rounded-xl text-left border text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-500">বুকিং রেফারেন্স:</span>
                  <span className="font-mono font-bold text-blue-700">{successData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ডাক্তার:</span>
                  <span className="font-semibold">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">তারিখ:</span>
                  <span className="font-semibold">{preferredDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">হাসপাতাল:</span>
                  <span className="font-semibold">{doctor.hospital}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#0056b3] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                ঠিক আছে
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Doctor snippet */}
              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 flex items-start gap-3">
                <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-lg object-cover border" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-gray-900 text-sm truncate">{doctor.name}</h5>
                  <span className="text-[10px] text-[#0056b3] font-semibold block">{doctor.speciality}</span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-600">
                    <span className="flex items-center gap-1"><Building className="w-3 h-3 text-gray-400" /> {doctor.hospital}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" /> {doctor.timing}</span>
                    {doctor.fee && <span className="flex items-center gap-1 font-semibold text-gray-800"><Banknote className="w-3 h-3 text-green-600" /> {doctor.fee}</span>}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl font-semibold text-xs border border-red-200">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-bold mb-1">রোগীর পূর্ণ নাম *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="যেমন: মোঃ কামরুল ইসলাম"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-[#0056b3] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">মোবাইল নম্বর (সিরিয়াল কনফার্মেশনের জন্য) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-[#0056b3] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">সাক্ষাতের পছন্দসই তারিখ *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-[#0056b3] outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">শারীরিক সমস্যার সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={problemSummary}
                    onChange={(e) => setProblemSummary(e.target.value)}
                    placeholder="যেমন: ৩ দিন ধরে তীব্র জ্বর ও কাশি..."
                    className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-[#0056b3] outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 border rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 bg-[#0056b3] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'সিরিয়াল নিশ্চিত করুন'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
