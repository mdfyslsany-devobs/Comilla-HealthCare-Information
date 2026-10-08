import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Phone, 
  MapPin, 
  Clock, 
  Stethoscope, 
  Hospital as HospitalIcon, 
  Ambulance as AmbulanceIcon, 
  Microscope, 
  Menu, 
  X, 
  AlertTriangle, 
  Calendar,
  User, 
  Banknote, 
  GraduationCap, 
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  Map,
  CheckCircle2,
  Award,
  Bed,
  Activity,
  HeartPulse,
  Filter
} from 'lucide-react';
import { api } from './api';
import { Department, Category, Doctor, Hospital, Ambulance, UpazilaHealthData } from './types';
import { UPAZILA_DIRECTORY, HEALTHCARE_CLUSTERS } from './data';
import { AdminPanel } from './components/AdminPanel';
import { AppointmentModal } from './components/AppointmentModal';
import { EmergencyModal } from './components/EmergencyModal';

const POPULAR_AREAS = [
  'সবগুলো এলাকা',
  'কান্দিরপাড়',
  'ঝাউতলা',
  'বাদুড়তলা',
  'টমসন ব্রিজ',
  'রেইসকোর্স / শাসনগাছা',
  'বাগিচাগাঁও',
  'ক্যান্টনমেন্ট',
  'রানীর বাজার'
];

const App: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<Department | 'সবগুলো'>('সবগুলো');
  const [selectedArea, setSelectedArea] = useState<string>('সবগুলো এলাকা');
  const [onlyICU, setOnlyICU] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.DOCTORS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Live Backend Data
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [upazilas, setUpazilas] = useState<UpazilaHealthData[]>(UPAZILA_DIRECTORY);
  const [clusters, setClusters] = useState<any[]>(HEALTHCARE_CLUSTERS);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  // Fetch initial data from backend API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [docs, hosps, ambs, upz, cls] = await Promise.all([
        api.getDoctors(),
        api.getHospitals(),
        api.getAmbulances(),
        api.getUpazilas(),
        api.getClusters(),
      ]);
      setDoctors(docs);
      setHospitals(hosps);
      setAmbulances(ambs);
      if (upz && upz.length > 0) setUpazilas(upz);
      if (cls && cls.length > 0) setClusters(cls);
    } catch (err) {
      console.error('Failed to load data from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const matchesDept = selectedDept === 'সবগুলো' || d.speciality === selectedDept;
      const matchesSearch = 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.degree && d.degree.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.designation && d.designation.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDept && matchesSearch;
    });
  }, [doctors, selectedDept, searchQuery]);

  // Filtered Hospitals & Diagnostic centers
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => {
      const isDiagCategory = activeCategory === Category.DIAGNOSTIC;
      if (isDiagCategory && !(h.facilityType?.includes('ডায়াগনস্টিক') || h.name.toLowerCase().includes('diagnostic') || h.name.toLowerCase().includes('lab'))) {
        return false;
      }

      const matchesDept = selectedDept === 'সবগুলো' || h.specialties.includes(selectedDept as Department);
      const matchesArea = selectedArea === 'সবগুলো এলাকা' || (h.area && h.area.includes(selectedArea.replace(' / শাসনগাছা', ''))) || h.address.includes(selectedArea.replace(' / শাসনগাছা', ''));
      const matchesICU = !onlyICU || h.hasICU === true;
      const matchesSearch = 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.area && h.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (h.facilityType && h.facilityType.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDept && matchesArea && matchesICU && matchesSearch;
    });
  }, [hospitals, activeCategory, selectedDept, selectedArea, onlyICU, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#0056b3] p-2.5 rounded-xl shadow-md shadow-blue-200">
              <HospitalIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-lg text-[#0056b3] leading-tight">
                কুমিল্লা হেলথকেয়ার হাব
              </h1>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                ১৫০+ হাসপাতাল, বিশেষজ্ঞ ডাক্তার ও জেলা স্বাস্থ্য তথ্যকোষ
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex gap-1">
              {Object.values(Category).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCategory === cat 
                      ? 'text-[#0056b3] bg-blue-50/80 shadow-sm' 
                      : 'text-gray-600 hover:text-[#0056b3] hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
            <div className="relative group">
              <input 
                type="text"
                placeholder="ডাক্তার, হাসপাতাল বা এলাকা..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#0056b3] focus:bg-white w-48 xl:w-56 transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Portal Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all border border-slate-200"
              title="এডমিন ও ব্যাকএন্ড ম্যানেজমেন্ট"
            >
              <ShieldCheck className="w-4 h-4 text-[#0056b3]" />
              <span className="hidden sm:inline">এডমিন প্যানেল</span>
            </button>

            {/* Emergency Button */}
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-md shadow-red-200 transition-all hover:scale-105"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>জরুরি সাহায্য</span>
            </button>

            <button 
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t p-4 flex flex-col gap-3 animate-in slide-in-from-top">
            <div className="relative mb-2">
              <input 
                type="text"
                placeholder="ডাক্তার, হাসপাতাল খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <nav className="flex flex-col gap-1">
              {Object.values(Category).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setIsMenuOpen(false); }}
                  className={`p-2.5 text-left rounded-xl text-sm font-semibold ${
                    activeCategory === cat ? 'bg-blue-50 text-[#0056b3]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-10 lg:py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50/70 overflow-hidden border-b border-blue-50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40 -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 -ml-48 -mb-48"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-100 text-[#0056b3] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> কুমিল্লা জেলা স্বাস্থ্যসেবা মার্কেট ইন্টেলিজেন্স ও ডিরেক্টরি
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-snug">
            কুমিল্লার ১৫০+ হাসপাতাল ও <br className="hidden sm:block" />
            <span className="text-[#0056b3]">সেরা বিশেষজ্ঞ ডাক্তারদের</span> সম্পূর্ণ তথ্যকোষ
          </h2>

          <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
            কুমিল্লা মেডিকেল কলেজ হাসপাতাল, সিডি প্যাথ, টাওয়ার হাসপাতাল, মুন হাসপাতাল, জেনারেল হাসপাতালসহ কুমিল্লা শহরের ৬টি ক্লাস্টার এবং ১৭টি উপজেলার সরকারি ও বেসরকারি স্বাস্থ্য কমপ্লেক্সের লাইভ ডিরেক্টরি।
          </p>
          
          {/* Quick Filters */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-blue-100 border border-gray-100 max-w-3xl mx-auto flex flex-col md:flex-row gap-2.5 items-stretch">
            {/* Dept selector */}
            <div className="flex-1 relative">
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value as Department | 'সবগুলো')}
                className="w-full h-11 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-xs font-medium"
              >
                <option value="সবগুলো">সকল বিভাগ (মেডিসিন, হৃদরোগ, নিউরো...)</option>
                {Object.values(Department).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <Stethoscope className="absolute left-3 top-3.5 w-4 h-4 text-[#0056b3]" />
            </div>

            {/* Area selector */}
            <div className="flex-1 relative">
              <select 
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full h-11 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#0056b3] text-xs font-medium"
              >
                {POPULAR_AREAS.map(ar => (
                  <option key={ar} value={ar}>{ar}</option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-green-600" />
            </div>

            {/* ICU Toggle */}
            <button
              onClick={() => setOnlyICU(!onlyICU)}
              className={`h-11 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                onlyICU 
                  ? 'bg-purple-700 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>{onlyICU ? '✓ শুধুমাত্র ICU সহ' : 'ICU সুবিধা ফিল্টার'}</span>
            </button>

            <button 
              className="bg-[#0056b3] text-white px-6 h-11 rounded-xl text-xs font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5"
              onClick={() => {
                const element = document.getElementById('results-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Search className="w-3.5 h-3.5" />
              অনুসন্ধান
            </button>
          </div>
        </div>
      </section>

      {/* Main Category Tabs Bar */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <CategoryCard 
              icon={<User className="w-5 h-5" />} 
              title="ডাক্তার" 
              count={doctors.length}
              isActive={activeCategory === Category.DOCTORS}
              onClick={() => setActiveCategory(Category.DOCTORS)}
            />
            <CategoryCard 
              icon={<HospitalIcon className="w-5 h-5" />} 
              title="হাসপাতাল" 
              count={hospitals.length}
              isActive={activeCategory === Category.HOSPITALS}
              onClick={() => setActiveCategory(Category.HOSPITALS)}
            />
            <CategoryCard 
              icon={<Microscope className="w-5 h-5" />} 
              title="ডায়াগনস্টিক" 
              count={hospitals.filter(h => h.facilityType?.includes('ডায়াগনস্টিক') || h.name.toLowerCase().includes('diagnostic')).length}
              isActive={activeCategory === Category.DIAGNOSTIC}
              onClick={() => setActiveCategory(Category.DIAGNOSTIC)}
            />
            <CategoryCard 
              icon={<Map className="w-5 h-5" />} 
              title="উপজেলা তথ্যকোষ" 
              count={upazilas.length}
              isActive={activeCategory === Category.UPAZILA}
              onClick={() => setActiveCategory(Category.UPAZILA)}
            />
            <CategoryCard 
              icon={<Layers className="w-5 h-5" />} 
              title="স্বাস্থ্য ক্লাস্টার" 
              count={clusters.length}
              isActive={activeCategory === Category.CLUSTERS}
              onClick={() => setActiveCategory(Category.CLUSTERS)}
            />
            <CategoryCard 
              icon={<AmbulanceIcon className="w-5 h-5" />} 
              title="অ্যাম্বুলেন্স" 
              count={ambulances.length}
              isActive={activeCategory === Category.AMBULANCE}
              onClick={() => setActiveCategory(Category.AMBULANCE)}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <main id="results-section" className="flex-1 py-10 bg-slate-50">
        <div className="container mx-auto px-4">
          
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-blue-100 text-[#0056b3] text-[10px] font-bold rounded-full">
                  লাইভ ডাটাবেজ
                </span>
                {onlyICU && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
                    ICU ফিল্টার সক্রিয়
                  </span>
                )}
                {selectedArea !== 'সবগুলো এলাকা' && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                    এলাকা: {selectedArea}
                  </span>
                )}
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                {activeCategory} {selectedDept !== 'সবগুলো' ? `(${selectedDept})` : ''}
              </h3>
              <p className="text-xs text-gray-500">
                {activeCategory === Category.DOCTORS && `${filteredDoctors.length} জন বিশেষজ্ঞ ডাক্তার তালিকাভুক্ত`}
                {(activeCategory === Category.HOSPITALS || activeCategory === Category.DIAGNOSTIC) && `${filteredHospitals.length} টি চিকিৎসা প্রতিষ্ঠান সক্রিয়`}
                {activeCategory === Category.UPAZILA && `কুমিল্লা জেলার ১৭টি উপজেলার স্বাস্থ্য কমপ্লেক্স তালিকা`}
                {activeCategory === Category.CLUSTERS && `শহরের প্রধান ৫টি স্বাস্থ্য হাব ও ইনফ্রাস্ট্রাকচার তুলনা`}
                {activeCategory === Category.AMBULANCE && `${ambulances.length} টি জরুরি অ্যাম্বুলেন্স সার্বক্ষণিক প্রস্তুত`}
              </p>
            </div>

            {/* Quick Dept Filter Pills (Only for Doctors & Hospitals) */}
            {(activeCategory === Category.DOCTORS || activeCategory === Category.HOSPITALS) && (
              <div className="flex flex-wrap items-center gap-1.5">
                <button 
                  onClick={() => setSelectedDept('সবগুলো')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDept === 'সবগুলো' ? 'bg-[#0056b3] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  সব বিভাগ
                </button>
                {[Department.MEDICINE, Department.CARDIOLOGY, Department.GYNAECOLOGY, Department.NEUROLOGY, Department.ORTHOPEDICS, Department.ONCOLOGY].map(dept => (
                  <button 
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedDept === dept ? 'bg-[#0056b3] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8">
              <RefreshCw className="w-8 h-8 text-[#0056b3] animate-spin mx-auto mb-3" />
              <h4 className="font-bold text-gray-800">সার্ভার থেকে তথ্য সংগ্রহ করা হচ্ছে...</h4>
              <p className="text-xs text-gray-500 mt-1">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন</p>
            </div>
          ) : (
            <>
              {/* DOCTORS GRID */}
              {activeCategory === Category.DOCTORS && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doctor => (
                      <DoctorCard 
                        key={doctor.id} 
                        doctor={doctor} 
                        onBookAppointment={() => setSelectedDoctorForBooking(doctor)} 
                      />
                    ))
                  ) : (
                    <EmptyState message="আপনার দেওয়া ফিল্টারের সাথে মিলে এমন কোনো ডাক্তার পাওয়া যায়নি।" />
                  )}
                </div>
              )}

              {/* HOSPITALS & DIAGNOSTIC GRID */}
              {(activeCategory === Category.HOSPITALS || activeCategory === Category.DIAGNOSTIC) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredHospitals.length > 0 ? (
                    filteredHospitals.map(hospital => (
                      <HospitalCard key={hospital.id} hospital={hospital} />
                    ))
                  ) : (
                    <EmptyState message="আপনার দেওয়া এলাকা বা ফিল্টারের সাথে মিলে এমন কোনো প্রতিষ্ঠান পাওয়া যায়নি।" />
                  )}
                </div>
              )}

              {/* UPAZILA DIRECTORY VIEW */}
              {activeCategory === Category.UPAZILA && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                    <Map className="w-6 h-6 text-[#0056b3] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-950 text-sm">কুমিল্লা জেলা ডিজিএইচএস (DGHS) রেজিস্টার্ড উপজেলা তালিকা</h4>
                      <p className="text-xs text-blue-800 mt-0.5">
                        ১৭টি উপজেলার সরকারি স্বাস্থ্য কমপ্লেক্স, প্রাইভেট ক্লিনিক ও ডায়াগনস্টিক সেন্টারের সরকারি পরিসংখ্যান ও জরুরি তথ্য।
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upazilas.map((u, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2.5">
                          <h4 className="font-bold text-gray-900 text-base">{u.upazila}</h4>
                          <span className="px-2 py-0.5 bg-blue-50 text-[#0056b3] text-[10px] font-bold rounded">
                            {u.totalFacilities}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                          <p><span className="font-semibold text-gray-800">সরকারি স্বাস্থ্যসেবা:</span> {u.governmentFacilities}</p>
                          <p><span className="font-semibold text-gray-800">প্রাইভেট ক্লিনিক:</span> {u.privateFacilities}</p>
                          <p><span className="font-semibold text-gray-800">ডায়াগনস্টিক ল্যাব:</span> {u.diagnosticCentres}</p>
                        </div>
                        <div className="pt-2.5 border-t border-gray-100 text-[11px] text-gray-500">
                          {u.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HEALTHCARE CLUSTERS & COMPARISON VIEW */}
              {activeCategory === Category.CLUSTERS && (
                <div className="space-y-8">
                  {/* Healthcare Clusters */}
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">কুমিল্লা শহরের প্রধান স্বাস্থ্য ক্লাস্টারসমূহ</h4>
                    <p className="text-xs text-gray-500 mb-4">শহরের প্রধান চিকিৎসা বেল্ট এবং প্রতিষ্ঠানসমূহের অবস্থান</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {clusters.map((c, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-[#0056b3] text-sm">{c.name}</h5>
                              <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded">
                                {c.density}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-4 leading-relaxed">{c.description}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight block mb-1.5">প্রধান প্রতিষ্ঠানসমূহ:</span>
                            <div className="flex flex-wrap gap-1">
                              {c.facilities.map((fac: string, fIdx: number) => (
                                <span key={fIdx} className="px-2 py-0.5 bg-gray-50 border rounded text-[10px] text-gray-700 font-medium">
                                  {fac}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advance Infrastructure Comparison Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm overflow-hidden">
                    <h4 className="font-bold text-gray-900 text-base mb-1">শীর্ষ হাসপাতালসমূহের বিশেষায়িত সার্ভিস তুলনা</h4>
                    <p className="text-xs text-gray-500 mb-4">আইসিইউ, সিসিইউ, এনআইসিইউ, ডায়ালাইসিস ও ইমেজিং সুবিধা</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-700 font-bold border-b">
                          <tr>
                            <th className="p-3">হাসপাতালের নাম</th>
                            <th className="p-3">বেড সংখ্যা</th>
                            <th className="p-3 text-center">ICU</th>
                            <th className="p-3 text-center">CCU</th>
                            <th className="p-3 text-center">NICU</th>
                            <th className="p-3 text-center">ডায়ালাইসিস</th>
                            <th className="p-3 text-center">CT Scan / MRI</th>
                            <th className="p-3">অনকোলজি / ক্যান্সার</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="p-3 font-bold text-gray-900">Cumilla Medical College Hospital (COMCH)</td>
                            <td className="p-3 font-semibold text-blue-700">500+</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-gray-700">সরকারি ক্যান্সার ইউনিট</td>
                          </tr>
                          <tr className="bg-blue-50/30">
                            <td className="p-3 font-bold text-gray-900">CD Path & Hospital Pvt. Ltd.</td>
                            <td className="p-3 font-semibold text-blue-700">50</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 font-semibold text-blue-800">রেডিওথেরাপি ও অনকোলজি</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-gray-900">Cumilla Medical Center (Tower Hospital)</td>
                            <td className="p-3 font-semibold text-blue-700">50</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-gray-700">অনকোলজি কনসালট্যান্ট</td>
                          </tr>
                          <tr className="bg-gray-50/30">
                            <td className="p-3 font-bold text-gray-900">Moon Hospital Ltd.</td>
                            <td className="p-3 font-semibold text-blue-700">30</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-gray-400">—</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-gray-900">General Hospital, Cumilla</td>
                            <td className="p-3 font-semibold text-blue-700">35</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-gray-400">—</td>
                          </tr>
                          <tr className="bg-gray-50/30">
                            <td className="p-3 font-bold text-gray-900">Cumilla Trauma Center</td>
                            <td className="p-3 font-semibold text-blue-700">20</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-center text-gray-400">—</td>
                            <td className="p-3 text-center text-gray-400">—</td>
                            <td className="p-3 text-center text-gray-400">—</td>
                            <td className="p-3 text-center text-green-600 font-bold">✓</td>
                            <td className="p-3 text-gray-400">—</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* AMBULANCE GRID */}
              {activeCategory === Category.AMBULANCE && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {ambulances.map(ambulance => (
                    <AmbulanceCard key={ambulance.id} ambulance={ambulance} />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-12 mt-auto border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#0056b3] p-2 rounded-lg">
                  <HospitalIcon className="text-white w-5 h-5" />
                </div>
                <h4 className="text-white font-heading font-bold text-base">কুমিল্লা হেলথকেয়ার হাব</h4>
              </div>
              <p className="text-xs leading-relaxed mb-4 text-gray-400">
                কুমিল্লা জেলার সরকারি ও বেসরকারি স্বাস্থ্যসেবা নেটওয়ার্ক। রোগীরা খুব সহজেই হাসপাতালের তথ্য, বিশেষজ্ঞ ডাক্তারের সিরিয়াল এবং জরুরি অ্যাম্বুলেন্স সেবা গ্রহণ করতে পারেন।
              </p>
              <div className="text-[11px] text-gray-500">
                তথ্য উৎস: ডিজিএইচএস রেজিস্ট্রি, হাসপাতাল ওয়েবসাইট ও পাবলিক ডিরেক্টরি
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-bold text-sm mb-4">দ্রুত লিঙ্ক</h5>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => { setActiveCategory(Category.DOCTORS); setSelectedDept('সবগুলো'); }} className="hover:text-white transition-colors">ডাক্তার তালিকা</button></li>
                <li><button onClick={() => { setActiveCategory(Category.HOSPITALS); setSelectedDept('সবগুলো'); }} className="hover:text-white transition-colors">হাসপাতাল তালিকা</button></li>
                <li><button onClick={() => setActiveCategory(Category.UPAZILA)} className="hover:text-white transition-colors">১৭টি উপজেলা ডিরেক্টরি</button></li>
                <li><button onClick={() => setActiveCategory(Category.CLUSTERS)} className="hover:text-white transition-colors">স্বাস্থ্য ক্লাস্টার ও তুলনা</button></li>
                <li><button onClick={() => setIsEmergencyOpen(true)} className="hover:text-white transition-colors text-red-400">জরুরি অ্যাম্বুলেন্স কল</button></li>
                <li><button onClick={() => setIsAdminOpen(true)} className="hover:text-white transition-colors text-blue-400">এডমিন ও ম্যানেজমেন্ট</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-sm mb-4">জেলা স্বাস্থ্য পরিসংখ্যান</h5>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="block text-base font-bold text-white">১৫০+</span>
                  <span className="text-[10px] text-gray-400">মোট প্রতিষ্ঠান</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="block text-base font-bold text-white">১৭টি</span>
                  <span className="text-[10px] text-gray-400">উপজেলা</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="block text-base font-bold text-white">৫০+ বেড</span>
                  <span className="text-[10px] text-gray-400">মেজর প্রাইভেট</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="block text-base font-bold text-white">২৪/৭</span>
                  <span className="text-[10px] text-gray-400">আইসিইউ ও জরুরি</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold text-sm mb-4">জরুরি হেল্পডেস্ক</h5>
              <p className="text-xs mb-3 text-gray-400">যেকোনো তথ্য ও সহযোগিতার জন্য সরাসরি হেল্পলাইনে যোগাযোগ করুন:</p>
              <a 
                href="tel:01716277211" 
                className="inline-flex items-center gap-2 bg-[#0056b3] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-600 transition-colors shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                ০১৭১৬-২৭৭২১১
              </a>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p>&copy; ২০২৬ কুমিল্লা হেলথকেয়ার হাব। সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex items-center gap-3">
              <span>ফুলস্ট্যাক ব্যাকএন্ড এপিআই সক্রিয়</span>
              <span>•</span>
              <button onClick={() => setIsAdminOpen(true)} className="text-blue-400 hover:underline">
                এডমিন লগইন
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onDataChanged={loadData} 
      />

      {/* Appointment Modal */}
      <AppointmentModal 
        doctor={selectedDoctorForBooking} 
        onClose={() => setSelectedDoctorForBooking(null)} 
      />

      {/* Emergency Modal */}
      <EmergencyModal 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
      />
    </div>
  );
};

const CategoryCard: React.FC<{ icon: React.ReactNode, title: string, count: number, isActive: boolean, onClick: () => void }> = ({ icon, title, count, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center group ${
      isActive 
      ? 'bg-blue-50 border-[#0056b3] shadow-md shadow-blue-100 ring-2 ring-blue-500/20' 
      : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5'
    }`}
  >
    <div className={`mb-2 p-2.5 rounded-xl transition-colors ${
      isActive ? 'bg-[#0056b3] text-white' : 'bg-blue-50 text-[#0056b3] group-hover:bg-[#0056b3] group-hover:text-white'
    }`}>
      {icon}
    </div>
    <h4 className={`font-bold text-xs mb-0.5 ${isActive ? 'text-[#0056b3]' : 'text-gray-900'}`}>{title}</h4>
    <p className="text-[10px] text-gray-500 font-medium">{count} টি তালিকাভুক্ত</p>
  </button>
);

const DoctorCard: React.FC<{ doctor: Doctor, onBookAppointment: () => void }> = ({ doctor, onBookAppointment }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
    <div>
      <div className="flex items-start gap-3.5 mb-3.5">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-100 shadow-sm flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/doc/200/200';
          }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{doctor.name}</h4>
          <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#0056b3] text-[10px] font-bold rounded uppercase mb-1">
            {doctor.speciality}
          </span>
          {doctor.designation && (
            <p className="text-[11px] text-blue-900 font-semibold leading-tight line-clamp-1">
              {doctor.designation}
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-1.5 mb-4 text-xs">
        {doctor.degree && (
          <div className="flex items-start gap-1.5 text-gray-600 leading-snug">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-[11px] font-medium line-clamp-2">{doctor.degree}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-gray-600">
          <HospitalIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="font-medium text-gray-800 truncate">{doctor.hospital}</span>
        </div>
        {doctor.multiFacilities && doctor.multiFacilities.length > 1 && (
          <div className="text-[10px] text-gray-500 pl-5">
            অন্যান্য চেম্বার: {doctor.multiFacilities.slice(1).join(', ')}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-gray-600">
          <Clock className="w-3.5 h-3.5 text-[#0056b3] flex-shrink-0" />
          <span>সময়: <span className="font-semibold text-gray-800">{doctor.timing}</span></span>
        </div>
        {doctor.fee && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <Banknote className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span>ভিজিটিং ফি: <span className="font-bold text-gray-900">{doctor.fee}</span></span>
          </div>
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
      <a 
        href={`tel:${doctor.phone}`}
        className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 text-[#0056b3] rounded-xl font-bold text-xs border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
      >
        <Phone className="w-3.5 h-3.5" />
        কল করুন
      </a>
      <button 
        onClick={onBookAppointment}
        className="flex items-center justify-center gap-1.5 py-2.5 bg-[#0056b3] text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-sm transition-all"
      >
        <Calendar className="w-3.5 h-3.5" />
        সিরিয়াল বুকিং
      </button>
    </div>
  </div>
);

const HospitalCard: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
    <div>
      <div className="relative h-44 bg-gray-100">
        <img 
          src={hospital.image} 
          alt={hospital.name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/hosp/800/600';
          }}
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[85%]">
          {hospital.area && (
            <span className="px-2 py-0.5 bg-blue-900/90 text-white backdrop-blur-sm text-[9px] font-bold rounded shadow-sm">
              {hospital.area}
            </span>
          )}
          {hospital.categoryType && (
            <span className={`px-2 py-0.5 text-white backdrop-blur-sm text-[9px] font-bold rounded shadow-sm ${
              hospital.categoryType === 'সরকারি' ? 'bg-emerald-600' : 'bg-slate-700'
            }`}>
              {hospital.categoryType}
            </span>
          )}
          {hospital.hasICU && (
            <span className="px-2 py-0.5 bg-purple-700 text-white backdrop-blur-sm text-[9px] font-bold rounded shadow-sm">
              ICU সুবিধা আছে
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-gray-900 text-sm leading-snug">{hospital.name}</h4>
        </div>
        
        {hospital.bedCapacity && (
          <div className="text-[11px] font-semibold text-blue-700 mb-2 flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            <span>শয্যা সংখ্যা: {hospital.bedCapacity} বেড</span>
          </div>
        )}

        <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#0056b3] flex-shrink-0 mt-0.5" />
          <p className="line-clamp-2">{hospital.address}</p>
        </div>

        {/* Services Chips */}
        {hospital.services && hospital.services.length > 0 && (
          <div className="mb-3">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight block mb-1">বিশেষ সেবা:</span>
            <div className="flex flex-wrap gap-1">
              {hospital.services.slice(0, 4).map((srv, sIdx) => (
                <span key={sIdx} className="px-1.5 py-0.5 bg-gray-50 text-gray-600 border border-gray-100 rounded text-[9px]">
                  {srv}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="p-4 pt-0">
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
          <Clock className="w-3 h-3 text-green-600" />
          <span>২৪/৭ জরুরি খোলা</span>
        </div>
        <a 
          href={`tel:${hospital.phone.split(',')[0].trim()}`}
          className="bg-[#0056b3] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-1 shadow-sm"
        >
          <Phone className="w-3 h-3" /> কল করুন
        </a>
      </div>
    </div>
  </div>
);

const AmbulanceCard: React.FC<{ ambulance: Ambulance }> = ({ ambulance }) => (
  <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-5 hover:border-red-200 transition-all group flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
          <AmbulanceIcon className="w-6 h-6" />
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          ambulance.type === 'আইসিইউ' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {ambulance.type} ইউনিট
        </span>
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-1">{ambulance.name}</h4>
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        কুমিল্লা জেলায় দ্রুত প্রাপ্যতা ({ambulance.availability})
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="text-xs font-bold text-gray-700 font-mono">{ambulance.phone}</div>
      <a 
        href={`tel:${ambulance.phone}`}
        className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-red-700 shadow-md shadow-red-100 transition-all flex items-center gap-1.5"
      >
        <Phone className="w-3.5 h-3.5" />
        জরুরি কল
      </a>
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200 p-6">
    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
    <h4 className="text-lg font-bold text-gray-900 mb-1">কোনো ফলাফল পাওয়া যায়নি</h4>
    <p className="text-xs text-gray-500">{message}</p>
  </div>
);

export default App;
