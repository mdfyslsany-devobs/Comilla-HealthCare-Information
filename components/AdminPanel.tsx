import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Upload,
  CheckCircle,
  AlertCircle,
  Users,
  Building,
  Ambulance as AmbulanceIcon,
  CalendarCheck,
  PhoneCall,
  RefreshCw,
  LogOut,
  Lock,
  Search,
  ExternalLink
} from 'lucide-react';
import { api } from '../api';
import { Doctor, Hospital, Ambulance, Department, Appointment, EmergencyRequest } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onDataChanged }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('comilla_admin_token'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'hospitals' | 'ambulances' | 'appointments' | 'emergencies'>('overview');

  // Data states
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Doctor Form Modal
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    speciality: Department.MEDICINE as Department,
    hospital: '',
    timing: 'বিকাল ৫:০০ - রাত ৮:০০',
    phone: '',
    fee: '১০০০ টাকা',
    degree: 'MBBS, FCPS',
    image: '',
  });

  // Hospital Form Modal
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    address: '',
    phone: '',
    specialties: [Department.MEDICINE, Department.SURGERY] as Department[],
    image: '',
  });

  // Search in admin
  const [adminSearch, setAdminSearch] = useState('');

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [docs, hosps, ambs, apps, emgs, st] = await Promise.all([
        api.getDoctors(),
        api.getHospitals(),
        api.getAmbulances(),
        api.getAppointments(),
        api.getEmergencies(),
        api.getStats(),
      ]);
      setDoctors(docs);
      setHospitals(hosps);
      setAmbulances(ambs);
      setAppointments(apps);
      setEmergencies(emgs);
      setStats(st);
    } catch (err: any) {
      showMsg('ডাটা লোড করতে সমস্যা হয়েছে: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.adminLogin(password);
      if (res.success && res.token) {
        setToken(res.token);
        localStorage.setItem('comilla_admin_token', res.token);
        setPassword('');
        showMsg('এডমিন লগইন সফল হয়েছে!');
      } else {
        setLoginError(res.error || 'ভুল পাসওয়ার্ড');
      }
    } catch {
      setLoginError('সার্ভারের সাথে সংযোগ ব্যর্থ');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('comilla_admin_token');
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'doctor' | 'hospital') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      showMsg('ছবি আপলোড হচ্ছে...', 'success');
      const url = await api.uploadImage(file);
      if (target === 'doctor') {
        setDoctorForm(prev => ({ ...prev, image: url }));
      } else {
        setHospitalForm(prev => ({ ...prev, image: url }));
      }
      showMsg('ছবি সফলভাবে আপলোড করা হয়েছে!');
    } catch (err: any) {
      showMsg(err.message || 'ছবি আপলোডে ব্যর্থতা', 'error');
    }
  };

  // Doctor Actions
  const openDoctorModal = (doc?: Doctor) => {
    if (doc) {
      setEditingDoctor(doc);
      setDoctorForm({
        name: doc.name,
        speciality: doc.speciality,
        hospital: doc.hospital,
        timing: doc.timing,
        phone: doc.phone,
        fee: doc.fee || '',
        degree: doc.degree || '',
        image: doc.image || '',
      });
    } else {
      setEditingDoctor(null);
      setDoctorForm({
        name: '',
        speciality: Department.MEDICINE,
        hospital: hospitals[0]?.name || 'CD Path & Hospital Pvt. Ltd.',
        timing: 'বিকাল ৫:০০ - রাত ৮:০০',
        phone: '01716-277211',
        fee: '১০০০ টাকা',
        degree: 'MBBS, FCPS',
        image: 'https://picsum.photos/seed/' + Date.now() + '/200/200',
      });
    }
    setIsDoctorModalOpen(true);
  };

  const saveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingDoctor) {
        await api.updateDoctor(editingDoctor.id, doctorForm, token);
        showMsg('ডাক্তারের তথ্য সফলভাবে হালনাগাদ করা হয়েছে!');
      } else {
        await api.createDoctor(doctorForm, token);
        showMsg('নতুন ডাক্তার সফলভাবে যুক্ত করা হয়েছে!');
      }
      setIsDoctorModalOpen(false);
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const deleteDoctor = async (id: string, name: string) => {
    if (!token || !confirm(`আপনি কি নিশ্চিত যে "${name}" কে মুছে ফেলতে চান?`)) return;
    try {
      await api.deleteDoctor(id, token);
      showMsg('ডাক্তার মুছে ফেলা হয়েছে');
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  // Hospital Actions
  const openHospitalModal = (hosp?: Hospital) => {
    if (hosp) {
      setEditingHospital(hosp);
      setHospitalForm({
        name: hosp.name,
        address: hosp.address,
        phone: hosp.phone,
        specialties: hosp.specialties,
        image: hosp.image,
      });
    } else {
      setEditingHospital(null);
      setHospitalForm({
        name: '',
        address: 'কান্দিরপাড়, কুমিল্লা',
        phone: '01716-277211',
        specialties: [Department.MEDICINE, Department.CARDIOLOGY],
        image: 'https://picsum.photos/seed/' + Date.now() + '/800/600',
      });
    }
    setIsHospitalModalOpen(true);
  };

  const saveHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingHospital) {
        await api.updateHospital(editingHospital.id, hospitalForm, token);
        showMsg('হাসপাতালের তথ্য হালনাগাদ করা হয়েছে!');
      } else {
        await api.createHospital(hospitalForm, token);
        showMsg('নতুন হাসপাতাল যুক্ত করা হয়েছে!');
      }
      setIsHospitalModalOpen(false);
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const deleteHospital = async (id: string, name: string) => {
    if (!token || !confirm(`আপনি কি নিশ্চিত যে "${name}" হাসপাতালটি মুছে ফেলতে চান?`)) return;
    try {
      await api.deleteHospital(id, token);
      showMsg('হাসপাতাল মুছে ফেলা হয়েছে');
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  // Appointment Status Change
  const changeAppointmentStatus = async (id: string, status: 'অপেক্ষমাণ' | 'নিশ্চিত' | 'বাতিল') => {
    if (!token) return;
    try {
      await api.updateAppointmentStatus(id, status, token);
      showMsg(`সিরিয়াল স্ট্যাটাস '${status}' করা হয়েছে`);
      loadAllData();
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  // Emergency Status Change
  const changeEmergencyStatus = async (id: string, status: 'জরুরি' | 'সম্পন্ন' | 'বাতিল') => {
    if (!token) return;
    try {
      await api.updateEmergencyStatus(id, status, token);
      showMsg(`জরুরি কল স্ট্যাটাস '${status}' করা হয়েছে`);
      loadAllData();
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  // Reset Database
  const handleResetDb = async () => {
    if (!token || !confirm('সতর্কতা: এটি সম্পূর্ণ ডাটাবেজ প্রাথমিক অবস্থায় রিসেট করবে! আপনি কি চালিয়ে যেতে চান?')) return;
    try {
      await api.resetDatabase(token);
      showMsg('ডাটাবেজ সফলভাবে রিসেট করা হয়েছে!');
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">কুমিল্লা হেলথকেয়ার হাব - এডমিন ও ব্যাকএন্ড ম্যানেজমেন্ট</h3>
              <p className="text-xs text-blue-200">ডাক্তার, হাসপাতাল, সিরিয়াল ও জরুরি কল নিয়ন্ত্রণ কেন্দ্র</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Action toast */}
        {actionMessage && (
          <div className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 ${actionMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {actionMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Body */}
        {!token ? (
          // Login Form
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 bg-blue-50 text-[#0056b3] rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">এডমিন প্যানেলে প্রবেশ করুন</h4>
            <p className="text-sm text-gray-500 mb-6">
              সিস্টেম পরিচালনার জন্য এডমিন পাসওয়ার্ড লিখুন। (ডেমো পাসওয়ার্ড: <span className="font-mono font-bold text-blue-600">admin123</span>)
            </p>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="এডমিন পাসওয়ার্ড দিন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0056b3] focus:border-transparent outline-none text-center text-lg"
                  autoFocus
                />
              </div>
              {loginError && <p className="text-xs text-red-600 font-semibold">{loginError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-[#0056b3] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                লগইন করুন
              </button>
            </form>
          </div>
        ) : (
          // Logged-in Dashboard
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar navigation */}
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#0056b3] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>ওভারভিউ ও স্ট্যাটাস</span>
              </button>
              <button
                onClick={() => setActiveTab('doctors')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'doctors' ? 'bg-[#0056b3] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <Users className="w-4 h-4" />
                <span>ডাক্তার তালিকা ({doctors.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'hospitals' ? 'bg-[#0056b3] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <Building className="w-4 h-4" />
                <span>হাসপাতাল সমূহ ({hospitals.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'appointments' ? 'bg-[#0056b3] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>সিরিয়াল বুকিং ({appointments.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('emergencies')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'emergencies' ? 'bg-[#0056b3] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>জরুরি কল রিকোয়েস্ট ({emergencies.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('ambulances')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'ambulances' ? 'bg-[#0056b3] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <AmbulanceIcon className="w-4 h-4" />
                <span>অ্যাম্বুলেন্স ({ambulances.length})</span>
              </button>

              <div className="hidden md:block mt-auto pt-4 border-t border-gray-200">
                <button
                  onClick={handleResetDb}
                  className="w-full text-xs text-red-600 hover:bg-red-50 p-2 rounded-lg border border-red-200 flex items-center justify-center gap-1.5 transition-colors font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ডাটাবেজ রিসেট করুন</span>
                </button>
              </div>
            </div>

            {/* Main content pane */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
              {loading && (
                <div className="text-center py-4 text-blue-600 font-semibold flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> ডাটা লোড হচ্ছে...
                </div>
              )}

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">সিস্টেম পরিসংখ্যান</h4>
                    <p className="text-xs text-gray-500">কুমিল্লা হেলথকেয়ার হাবের লাইভ ব্যাকএন্ড ডাটা ও অ্যাক্টিভিটি</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                      <div className="text-xs font-bold text-blue-700 uppercase mb-1">মোট ডাক্তার</div>
                      <div className="text-3xl font-extrabold text-[#0056b3]">{doctors.length}</div>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                      <div className="text-xs font-bold text-green-700 uppercase mb-1">হাসপাতাল ও সেন্টার</div>
                      <div className="text-3xl font-extrabold text-green-800">{hospitals.length}</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                      <div className="text-xs font-bold text-purple-700 uppercase mb-1">রোগীর সিরিয়াল রিকোয়েস্ট</div>
                      <div className="text-3xl font-extrabold text-purple-800">{appointments.length}</div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                      <div className="text-xs font-bold text-red-700 uppercase mb-1">জরুরি কল নোটিফিকেশন</div>
                      <div className="text-3xl font-extrabold text-red-700">{emergencies.length}</div>
                    </div>
                  </div>

                  {/* Backend System Specs */}
                  <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
                    <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      ব্যাকএন্ড ইঞ্জিন স্ট্যাটাস
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-500 block">সার্ভার ফ্রেমওয়ার্ক:</span>
                        <span className="font-bold text-gray-800">Node.js + Express (REST API /api/*)</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-500 block">ডাটা পারসিস্টেন্স:</span>
                        <span className="font-bold text-gray-800">অটোমেটিক ফাইল সিংক স্টোরেজ (server/data/db.json)</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-500 block">মিডিয়া আপলোড:</span>
                        <span className="font-bold text-gray-800">মাল্টার (Multer) লোকাল স্টোরেজ (/uploads/*)</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-500 block">নিরাপত্তা ও অথেন্টিকেশন:</span>
                        <span className="font-bold text-gray-800">Bearer Token প্রটেকশন (Admin CRUD)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCTORS TAB */}
              {activeTab === 'doctors' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">ডাক্তার তালিকা ও ব্যবস্থাপনা</h4>
                      <p className="text-xs text-gray-500">নতুন ডাক্তার যোগ করুন, ডিগ্রি বা ভিজিটিং ফি পরিবর্তন করুন</p>
                    </div>
                    <button
                      onClick={() => openDoctorModal()}
                      className="bg-[#0056b3] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> নতুন ডাক্তার যোগ করুন
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="ডাক্তারের নাম, বিভাগ বা হাসপাতাল দিয়ে খুঁজুন..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
                    />
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                        <tr>
                          <th className="p-3">ডাক্তার</th>
                          <th className="p-3">বিভাগ / স্পেশালিটি</th>
                          <th className="p-3">হাসপাতাল</th>
                          <th className="p-3">সময় ও ফি</th>
                          <th className="p-3">ফোন</th>
                          <th className="p-3 text-right">একশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {doctors
                          .filter(d => 
                            d.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                            d.hospital.toLowerCase().includes(adminSearch.toLowerCase()) ||
                            d.speciality.toLowerCase().includes(adminSearch.toLowerCase())
                          )
                          .map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/80">
                              <td className="p-3 flex items-center gap-2">
                                <img src={doc.image} alt={doc.name} className="w-9 h-9 rounded-lg object-cover border" />
                                <div>
                                  <span className="font-bold text-gray-900 block">{doc.name}</span>
                                  <span className="text-[10px] text-gray-500">{doc.degree}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="bg-blue-50 text-[#0056b3] px-2 py-0.5 rounded font-semibold text-[10px]">
                                  {doc.speciality}
                                </span>
                              </td>
                              <td className="p-3 font-medium text-gray-700">{doc.hospital}</td>
                              <td className="p-3">
                                <div>{doc.timing}</div>
                                <div className="text-gray-500 font-semibold">{doc.fee}</div>
                              </td>
                              <td className="p-3 text-gray-600">{doc.phone}</td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => openDoctorModal(doc)}
                                    className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                    title="সম্পাদনা"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteDoctor(doc.id, doc.name)}
                                    className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                    title="মুছুন"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* HOSPITALS TAB */}
              {activeTab === 'hospitals' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">হাসপাতাল ও ডায়াগনস্টিক সেন্টার</h4>
                      <p className="text-xs text-gray-500">হাসপাতালের তালিকা, ঠিকানা ও যোগাযোগ নম্বর পরিচালনা</p>
                    </div>
                    <button
                      onClick={() => openHospitalModal()}
                      className="bg-[#0056b3] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> নতুন হাসপাতাল যোগ করুন
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hospitals.map(hosp => (
                      <div key={hosp.id} className="border border-gray-200 rounded-2xl p-4 flex gap-4 bg-white hover:shadow-md transition-shadow">
                        <img src={hosp.image} alt={hosp.name} className="w-24 h-24 rounded-xl object-cover border" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-gray-900 text-sm truncate">{hosp.name}</h5>
                          <p className="text-xs text-gray-500 mb-2 truncate">{hosp.address}</p>
                          <p className="text-xs font-semibold text-blue-700 mb-2">ফোন: {hosp.phone}</p>
                          <div className="flex items-center gap-2 mt-auto">
                            <button
                              onClick={() => openHospitalModal(hosp)}
                              className="text-xs bg-gray-100 hover:bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" /> এডিট
                            </button>
                            <button
                              onClick={() => deleteHospital(hosp.id, hosp.name)}
                              className="text-xs bg-gray-100 hover:bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> মুছুন
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* APPOINTMENTS TAB */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">রোগীর সিরিয়াল ও অ্যাপয়েন্টমেন্ট রিকোয়েস্ট</h4>
                    <p className="text-xs text-gray-500">ওয়েবসাইট থেকে আসা সকল রোগীর সিরিয়াল আবেদন</p>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm">কোনো সিরিয়াল আবেদন নেই।</div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map(app => (
                        <div key={app.id} className="p-4 border border-gray-200 rounded-2xl bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900 text-sm">{app.patientName}</span>
                              <span className="text-xs text-gray-500">({app.patientPhone})</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${app.status === 'নিশ্চিত' ? 'bg-green-100 text-green-800' : app.status === 'বাতিল' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              ডাক্তার: <span className="font-semibold">{app.doctorName}</span> ({app.hospitalName})
                            </p>
                            <p className="text-xs text-gray-500">
                              পছন্দের তারিখ: <span className="font-medium">{app.preferredDate}</span>
                              {app.problemSummary && ` • সমস্যা: "${app.problemSummary}"`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${app.patientPhone}`}
                              className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100"
                            >
                              কল করুন
                            </a>
                            <select
                              value={app.status}
                              onChange={(e) => changeAppointmentStatus(app.id, e.target.value as any)}
                              className="text-xs border border-gray-300 rounded-lg p-1.5 bg-white font-medium"
                            >
                              <option value="অপেক্ষমাণ">অপেক্ষমাণ</option>
                              <option value="নিশ্চিত">নিশ্চিত</option>
                              <option value="বাতিল">বাতিল</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* EMERGENCIES TAB */}
              {activeTab === 'emergencies' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">জরুরি সহায়তা ও ডিসপ্যাচ রিকোয়েস্ট</h4>
                    <p className="text-xs text-gray-500">রোগীর তাৎক্ষণিক অ্যাম্বুলেন্স বা জরুরি কল বার্তা</p>
                  </div>

                  {emergencies.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm">কোনো জরুরি কল রিকোয়েস্ট নেই।</div>
                  ) : (
                    <div className="space-y-3">
                      {emergencies.map(emg => (
                        <div key={emg.id} className="p-4 border-2 border-red-100 bg-red-50/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{emg.callerName}</span>
                              <span className="font-mono text-xs font-bold text-red-600">{emg.callerPhone}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${emg.status === 'জরুরি' ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-200 text-gray-700'}`}>
                                {emg.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700">স্থান: <span className="font-bold">{emg.location}</span></p>
                            <p className="text-xs text-gray-500">সার্ভিস: {emg.serviceType} {emg.notes && `• নোট: ${emg.notes}`}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${emg.callerPhone}`}
                              className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-700 shadow-sm"
                            >
                              তাৎক্ষণিক কল
                            </a>
                            <button
                              onClick={() => changeEmergencyStatus(emg.id, emg.status === 'জরুরি' ? 'সম্পন্ন' : 'জরুরি')}
                              className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-50"
                            >
                              {emg.status === 'জরুরি' ? 'সম্পন্ন চিহ্নিত করুন' : 'পুনরায় চালু'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AMBULANCES TAB */}
              {activeTab === 'ambulances' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">অ্যাম্বুলেন্স তালিকা</h4>
                      <p className="text-xs text-gray-500">কুমিল্লা শহরের জরুরি অ্যাম্বুলেন্স সেবা</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ambulances.map(amb => (
                      <div key={amb.id} className="p-4 border rounded-xl bg-white flex justify-between items-center">
                        <div>
                          <h5 className="font-bold text-gray-900 text-sm">{amb.name}</h5>
                          <p className="text-xs text-gray-500">টাইপ: {amb.type} • প্রাপ্তি: {amb.availability}</p>
                          <p className="text-xs font-bold text-red-600 mt-1">{amb.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* DOCTOR CREATE/EDIT MODAL */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h4 className="font-bold text-gray-900">
                {editingDoctor ? 'ডাক্তারের তথ্য হালনাগাদ' : 'নতুন ডাক্তার যোগ করুন'}
              </h4>
              <button onClick={() => setIsDoctorModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">ডাক্তারের নাম *</label>
                <input
                  type="text"
                  required
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  placeholder="যেমন: Prof. Dr. Shahab Uddin"
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">বিশেষজ্ঞ বিভাগ *</label>
                  <select
                    value={doctorForm.speciality}
                    onChange={(e) => setDoctorForm({ ...doctorForm, speciality: e.target.value as Department })}
                    className="w-full p-2.5 border rounded-xl text-xs bg-white"
                  >
                    {Object.values(Department).map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">হাসপাতাল *</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.hospital}
                    onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
                    placeholder="যেমন: CD Path & Hospital"
                    className="w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">ডিগ্রি / কোয়ালিফিকেশন</label>
                <input
                  type="text"
                  value={doctorForm.degree}
                  onChange={(e) => setDoctorForm({ ...doctorForm, degree: e.target.value })}
                  placeholder="যেমন: MBBS, FCPS (Internal Medicine)"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">ভিজিটিং সময়</label>
                  <input
                    type="text"
                    value={doctorForm.timing}
                    onChange={(e) => setDoctorForm({ ...doctorForm, timing: e.target.value })}
                    placeholder="সকাল ৯:০০ - দুপুর ২:০০"
                    className="w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">ভিজিট ফি</label>
                  <input
                    type="text"
                    value={doctorForm.fee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, fee: e.target.value })}
                    placeholder="১০০০ টাকা"
                    className="w-full p-2.5 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">মোবাইল নম্বর *</label>
                <input
                  type="text"
                  required
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                  placeholder="01716-277211"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              {/* Photo Upload / URL */}
              <div className="border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50">
                <label className="block text-gray-700 font-semibold mb-1">ডাক্তারের ছবি (আপলোড করুন অথবা URL দিন)</label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'doctor')}
                    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0056b3] file:text-white hover:file:bg-blue-700"
                  />
                </div>
                <input
                  type="text"
                  value={doctorForm.image}
                  onChange={(e) => setDoctorForm({ ...doctorForm, image: e.target.value })}
                  placeholder="ছবির লিংক বা প্রিভিউ"
                  className="w-full p-2 border rounded-lg text-xs bg-white"
                />
                {doctorForm.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={doctorForm.image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border" />
                    <span className="text-[10px] text-green-700">ছবি প্রস্তুত রয়েছে</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0056b3] text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOSPITAL CREATE/EDIT MODAL */}
      {isHospitalModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h4 className="font-bold text-gray-900">
                {editingHospital ? 'হাসপাতালের তথ্য হালনাগাদ' : 'নতুন হাসপাতাল যোগ করুন'}
              </h4>
              <button onClick={() => setIsHospitalModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveHospital} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">হাসপাতালের নাম *</label>
                <input
                  type="text"
                  required
                  value={hospitalForm.name}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                  placeholder="যেমন: Moon Hospital Pvt. Ltd."
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">ঠিকানা / লোকেশন *</label>
                <input
                  type="text"
                  required
                  value={hospitalForm.address}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                  placeholder="ঝাউতলা, কুমিল্লা"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">হেল্পলাইন / ফোন নম্বর *</label>
                <input
                  type="text"
                  required
                  value={hospitalForm.phone}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                  placeholder="01822-234567"
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              {/* Hospital Banner/Logo Upload */}
              <div className="border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50">
                <label className="block text-gray-700 font-semibold mb-1">হাসপাতাল ব্যানার / লোগো আপলোড</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'hospital')}
                  className="text-xs text-gray-500 mb-2 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0056b3] file:text-white"
                />
                <input
                  type="text"
                  value={hospitalForm.image}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, image: e.target.value })}
                  placeholder="ছবির লিংক বা প্রিভিউ"
                  className="w-full p-2 border rounded-lg text-xs bg-white"
                />
                {hospitalForm.image && (
                  <img src={hospitalForm.image} alt="Preview" className="mt-2 w-full h-20 rounded-lg object-cover border" />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsHospitalModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0056b3] text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
