import React, { useState } from 'react';
import { X, Phone, AlertTriangle, MapPin, Ambulance, CheckCircle, ShieldAlert } from 'lucide-react';
import { api } from '../api';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('আইসিইউ অ্যাম্বুলেন্স');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await api.sendEmergencyRequest({
        callerName,
        callerPhone,
        location,
        serviceType,
        notes,
      });
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'রিকোয়েস্ট গ্রহণ করা যায়নি');
      }
    } catch (err: any) {
      setError(err.message || 'সার্ভার সমস্যা, অনুগ্রহ করে সরাসরি ফোন করুন');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-red-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">জরুরি স্বাস্থ্যসেবা ও অ্যাম্বুলেন্স সহায়তা</h3>
              <p className="text-xs text-red-100">কুমিল্লা জেলা জরুরি রেসপন্স ইউনিট</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Call Emergency Numbers */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
              তাৎক্ষণিক হটলাইন (সরাসরি কল করুন)
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:999"
                className="bg-red-50 hover:bg-red-100 border border-red-200 p-3 rounded-xl flex items-center gap-2.5 transition-colors group"
              >
                <div className="p-2 bg-red-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-700">জাতীয় জরুরি সেবা</div>
                  <div className="text-base font-extrabold text-red-900 font-mono">৯৯৯ (999)</div>
                </div>
              </a>

              <a
                href="tel:01716277211"
                className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-3 rounded-xl flex items-center gap-2.5 transition-colors group"
              >
                <div className="p-2 bg-[#0056b3] text-white rounded-lg group-hover:scale-105 transition-transform">
                  <Ambulance className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-700">কুমিল্লা অ্যাম্বুলেন্স হাব</div>
                  <div className="text-xs font-bold text-blue-900 font-mono">01716-277211</div>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Dispatch Form */}
          <div className="border-t pt-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h4 className="text-sm font-bold text-gray-900">
                জরুরি অ্যাম্বুলেন্স বা কলব্যাক রিকোয়েস্ট পাঠান
              </h4>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                <h5 className="font-bold text-green-900 text-base">আপনার বার্তা ব্যাকএন্ডে গৃহীত হয়েছে!</h5>
                <p className="text-xs text-green-800">
                  নিকটস্থ অ্যাম্বুলেন্স টিম ও হেল্পডেস্ক কন্ট্রোল রুম থেকে কিছুক্ষণের মধ্যে উল্লেখিত নম্বরে কল করা হচ্ছে।
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 px-5 py-2 bg-green-700 text-white rounded-xl text-xs font-bold hover:bg-green-800"
                >
                  উইন্ডো বন্ধ করুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmergencySubmit} className="space-y-3 text-xs">
                {error && (
                  <div className="p-2.5 bg-red-50 text-red-700 rounded-lg font-semibold border border-red-200">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">যোগাযোগকারীর নাম *</label>
                    <input
                      type="text"
                      required
                      value={callerName}
                      onChange={(e) => setCallerName(e.target.value)}
                      placeholder="নাম লিখুন"
                      className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={callerPhone}
                      onChange={(e) => setCallerPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">বর্তমান ঠিকানা / অবস্থান (কুমিল্লায়) *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="যেমন: টমছম ব্রিজ মোড় / কান্দিরপাড়, কুমিল্লা"
                      className="w-full pl-9 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">সেবার ধরণ</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-white outline-none"
                    >
                      <option value="আইসিইউ অ্যাম্বুলেন্স">আইসিইউ অ্যাম্বুলেন্স</option>
                      <option value="সাধারণ অ্যাম্বুলেন্স">সাধারণ অ্যাম্বুলেন্স</option>
                      <option value="জরুরি ডাক্তার পরামর্শ">জরুরি ডাক্তার পরামর্শ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">রোগীর অবস্থা (সংক্ষেপে)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="যেমন: অক্সিজেন প্রয়োজন"
                      className="w-full p-2.5 border rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {isSubmitting ? 'প্রেরণ হচ্ছে...' : 'তাৎক্ষণিক জরুরি বার্তা পাঠান'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
