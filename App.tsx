
import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronRight,
  User,
  Banknote,
  GraduationCap,
  Activity
} from 'lucide-react';
import { HOSPITALS, DOCTORS, AMBULANCES } from './data';
import { Department, Category, Doctor, Hospital, Ambulance } from './types';

const App: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<Department | 'সবগুলো'>('সবগুলো');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.DOCTORS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(d => 
      (selectedDept === 'সবগুলো' || d.speciality === selectedDept) &&
      (d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       d.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
       d.speciality.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [selectedDept, searchQuery]);

  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter(h => 
      (selectedDept === 'সবগুলো' || h.specialties.includes(selectedDept as Department)) &&
      (h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       h.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [selectedDept, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#0056b3] p-2 rounded-lg">
              <HospitalIcon className="text-white w-6 h-6" />
            </div>
            <h1 className="font-heading font-bold text-xl text-[#0056b3] leading-tight hidden sm:block">
              কুমিল্লা <br /><span className="text-gray-700 text-sm font-medium">হেলথকেয়ার হাব</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4">
              {Object.values(Category).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${activeCategory === cat ? 'text-[#0056b3] border-b-2 border-[#0056b3]' : 'text-gray-600 hover:text-[#0056b3]'}`}
                >
                  {cat}
                </button>
              ))}
            </nav>
            <div className="relative group">
              <input 
                type="text"
                placeholder="যেকোনো কিছু খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3] focus:border-transparent w-48 lg:w-64 transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="tel:999"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg shadow-red-200 transition-all hover:scale-105"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>জরুরি সাহায্য</span>
            </a>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 animate-in slide-in-from-top">
            <nav className="flex flex-col gap-2">
              {Object.values(Category).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setIsMenuOpen(false); }}
                  className="p-2 text-left text-gray-700 font-medium hover:bg-blue-50 rounded"
                >
                  {cat}
                </button>
              ))}
            </nav>
            <div className="relative">
              <input 
                type="text"
                placeholder="খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 -ml-40 -mb-40"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#0056b3] text-sm font-bold rounded-full mb-6 uppercase tracking-wider">
            হেলথকেয়ার ডিরেক্টরি
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-relaxed md:leading-[1.4]">
            কুমিল্লার সেরা <span className="text-[#0056b3]">স্বাস্থ্যসেবা</span> <br className="hidden md:block" /> সহজে খুঁজে নিন
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            কুমিল্লা জেলা জুড়ে বিশেষজ্ঞ ডাক্তার, আধুনিক হাসপাতাল এবং জরুরি অ্যাম্বুলেন্স সেবা দ্রুত খুঁজে পান।
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value as Department | 'সবগুলো')}
                className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0056b3] transition-all"
              >
                <option value="সবগুলো">বিভাগ অনুযায়ী খুঁজুন (সবগুলো)</option>
                {Object.values(Department).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <Stethoscope className="absolute left-4 top-4.5 w-5 h-5 text-[#0056b3]" />
            </div>
            <button 
              className="bg-[#0056b3] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1"
              onClick={() => {
                const element = document.getElementById('results-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              এখনই খুঁজুন
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <CategoryCard 
              icon={<User className="w-8 h-8" />} 
              title="ডাক্তার" 
              count={DOCTORS.length}
              isActive={activeCategory === Category.DOCTORS}
              onClick={() => setActiveCategory(Category.DOCTORS)}
            />
            <CategoryCard 
              icon={<HospitalIcon className="w-8 h-8" />} 
              title="হাসপাতাল" 
              count={HOSPITALS.length}
              isActive={activeCategory === Category.HOSPITALS}
              onClick={() => setActiveCategory(Category.HOSPITALS)}
            />
            <CategoryCard 
              icon={<AmbulanceIcon className="w-8 h-8" />} 
              title="অ্যাম্বুলেন্স" 
              count={AMBULANCES.length}
              isActive={activeCategory === Category.AMBULANCE}
              onClick={() => setActiveCategory(Category.AMBULANCE)}
            />
            <CategoryCard 
              icon={<Microscope className="w-8 h-8" />} 
              title="ডায়াগনস্টিক" 
              count={HOSPITALS.length}
              isActive={activeCategory === Category.DIAGNOSTIC}
              onClick={() => setActiveCategory(Category.DIAGNOSTIC)}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <main id="results-section" className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2 whitespace-pre-wrap">
                {activeCategory} {selectedDept !== 'সবগুলো' ? `${selectedDept} বিভাগে` : 'কুমিল্লায় সরাসরি'}
              </h3>
              <p className="text-gray-500">{
                activeCategory === Category.DOCTORS ? filteredDoctors.length :
                activeCategory === Category.HOSPITALS ? filteredHospitals.length :
                activeCategory === Category.AMBULANCE ? AMBULANCES.length : 
                activeCategory === Category.DIAGNOSTIC ? filteredHospitals.length : 0
              } টি ফলাফল দেখানো হচ্ছে</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedDept('সবগুলো')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDept === 'সবগুলো' ? 'bg-[#0056b3] text-white shadow-md' : 'bg-white text-gray-600 border'}`}
              >
                সব বিভাগ
              </button>
              <div className="hidden lg:flex gap-2">
                {[Department.MEDICINE, Department.CARDIOLOGY, Department.GYNAECOLOGY].map(dept => (
                  <button 
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDept === dept ? 'bg-[#0056b3] text-white shadow-md' : 'bg-white text-gray-600 border hover:border-blue-200'}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategory === Category.DOCTORS && (
              filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              ) : (
                <EmptyState message="আপনার দেওয়া তথ্যের সাথে মিলে এমন কোনো ডাক্তার পাওয়া যায়নি।" />
              )
            )}

            {activeCategory === Category.HOSPITALS && (
              filteredHospitals.length > 0 ? (
                filteredHospitals.map(hospital => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))
              ) : (
                <EmptyState message="আপনার দেওয়া তথ্যের সাথে মিলে এমন কোনো হাসপাতাল পাওয়া যায়নি।" />
              )
            )}

            {activeCategory === Category.AMBULANCE && (
              AMBULANCES.map(ambulance => (
                <AmbulanceCard key={ambulance.id} ambulance={ambulance} />
              ))
            )}

            {activeCategory === Category.DIAGNOSTIC && (
              filteredHospitals.length > 0 ? (
                filteredHospitals.map(hospital => (
                  <DiagnosticCard key={hospital.id} hospital={hospital} />
                ))
              ) : (
                <EmptyState message="আপনার দেওয়া তথ্যের সাথে মিলে এমন কোনো ডায়াগনস্টিক সেন্টার পাওয়া যায়নি।" />
              )
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#0056b3] p-1.5 rounded">
                  <HospitalIcon className="text-white w-5 h-5" />
                </div>
                <h4 className="text-white font-heading font-bold text-lg">কুমিল্লা হেলথকেয়ার হাব</h4>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                কুমিল্লায় স্বাস্থ্যসেবা খুঁজে পাওয়ার জন্য এটি সবচেয়ে বিশ্বস্ত ডিরেক্টরি। আমরা রোগীদের সেরা চিকিৎসার সাথে যুক্ত করি।
              </p>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-6">দ্রুত লিঙ্ক</h5>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => { setActiveCategory(Category.DOCTORS); setSelectedDept('সবগুলো'); }} className="hover:text-white transition-colors">ডাক্তার খুঁজুন</button></li>
                <li><button onClick={() => setActiveCategory(Category.AMBULANCE)} className="hover:text-white transition-colors">জরুরি অ্যাম্বুলেন্স</button></li>
                <li><button onClick={() => { setActiveCategory(Category.HOSPITALS); setSelectedDept('সবগুলো'); }} className="hover:text-white transition-colors">হাসপাতালের তালিকা</button></li>
                <li><button onClick={() => { setActiveCategory(Category.DIAGNOSTIC); setSelectedDept('সবগুলো'); }} className="hover:text-white transition-colors">ডায়াগনস্টিক সেন্টার</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">স্বাস্থ্যসেবা পরিসংখ্যান</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <span className="block text-xl font-bold text-white">২৪+</span>
                  <span className="text-xs uppercase">হাসপাতাল</span>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <span className="block text-xl font-bold text-white">১০০+</span>
                  <span className="text-xs uppercase">বিশেষজ্ঞ</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">সহায়তা</h5>
              <p className="text-sm mb-4">যেকোনো তথ্যের জন্য বা জরুরি প্রয়োজনে আমাদের সাথে যোগাযোগ করুন।</p>
              <a href="tel:01716277211" className="inline-flex items-center gap-2 bg-[#0056b3] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors">
                <Phone className="w-4 h-4" />
                হেল্পডেস্কে যোগাযোগ
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; ২০২৪ কুমিল্লা হেলথকেয়ার হাব। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CategoryCard: React.FC<{ icon: React.ReactNode, title: string, count: number, isActive: boolean, onClick: () => void }> = ({ icon, title, count, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center group ${
      isActive 
      ? 'bg-blue-50 border-[#0056b3] shadow-lg shadow-blue-100' 
      : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
    }`}
  >
    <div className={`mb-4 p-3 rounded-xl transition-colors ${isActive ? 'bg-[#0056b3] text-white' : 'bg-blue-50 text-[#0056b3] group-hover:bg-[#0056b3] group-hover:text-white'}`}>
      {icon}
    </div>
    <h4 className={`font-bold mb-1 ${isActive ? 'text-[#0056b3]' : 'text-gray-900'}`}>{title}</h4>
    <p className="text-xs text-gray-500 font-medium">{count}+ তালিকাভুক্ত</p>
  </button>
);

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative">
    <div className="flex items-start gap-4 mb-5">
      <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-50" />
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-1 leading-tight">{doctor.name}</h4>
        <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#0056b3] text-[10px] font-bold rounded uppercase mb-1">
          {doctor.speciality}
        </span>
        <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
          <HospitalIcon className="w-3 h-3" /> {doctor.hospital}
        </p>
      </div>
    </div>
    
    <div className="space-y-2 mb-6 text-sm">
      {doctor.degree && (
        <div className="flex items-start gap-2 text-gray-600 leading-tight">
          <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-[11px] font-medium">{doctor.degree}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="w-4 h-4 text-[#0056b3]" />
        <span>সময়সূচী: <span className="font-semibold">{doctor.timing}</span></span>
      </div>
      {doctor.fee && (
        <div className="flex items-center gap-2 text-gray-600">
          <Banknote className="w-4 h-4 text-green-600" />
          <span>ভিজিটিং ফি: <span className="font-bold text-gray-900">{doctor.fee}</span></span>
        </div>
      )}
    </div>

    <a 
      href={`tel:${doctor.phone}`}
      className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-[#0056b3] rounded-xl font-bold text-sm border border-gray-100 hover:bg-[#0056b3] hover:text-white hover:border-[#0056b3] transition-all"
    >
      <Phone className="w-4 h-4" />
      এখনই কল করুন
    </a>
  </div>
);

const HospitalCard: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
    <div className="relative h-40">
      <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
        {hospital.specialties.slice(0, 3).map(s => (
          <span key={s} className="px-2 py-1 bg-white/95 backdrop-blur-sm text-[#0056b3] text-[9px] font-bold rounded uppercase tracking-wider shadow-sm border border-blue-50">
            {s}
          </span>
        ))}
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <h4 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{hospital.name}</h4>
      <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
        <MapPin className="w-4 h-4 text-[#0056b3] flex-shrink-0 mt-0.5" />
        <p>{hospital.address}</p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>২৪/৭ খোলা</span>
        </div>
        <a 
          href={`tel:${hospital.phone}`}
          className="bg-[#0056b3]/10 text-[#0056b3] px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#0056b3] hover:text-white transition-all flex items-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5" /> কল
        </a>
      </div>
    </div>
  </div>
);

const DiagnosticCard: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
    <div className="p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-blue-50 text-[#0056b3] rounded-xl group-hover:bg-[#0056b3] group-hover:text-white transition-colors">
          <Microscope className="w-6 h-6" />
        </div>
        <span className="px-2 py-1 bg-green-50 text-green-700 text-[9px] font-bold rounded uppercase">ডায়াগনস্টিক ল্যাব আছে</span>
      </div>
      
      <h4 className="font-bold text-gray-900 text-lg mb-2 leading-tight group-hover:text-[#0056b3] transition-colors">{hospital.name}</h4>
      
      <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
        <p>{hospital.address}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter block w-full mb-1">সাধারণ টেস্টসমূহ:</span>
        <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded border border-gray-100">রক্ত পরীক্ষা</span>
        <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded border border-gray-100">এক্স-রে</span>
        <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded border border-gray-100">ইসিজি</span>
        <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded border border-gray-100">ইউএসজি</span>
      </div>
      
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase">তথ্যের জন্য যোগাযোগ</span>
          <span className="text-xs font-bold text-gray-700">{hospital.phone}</span>
        </div>
        <a 
          href={`tel:${hospital.phone}`}
          className="bg-[#0056b3] text-white p-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

const AmbulanceCard: React.FC<{ ambulance: Ambulance }> = ({ ambulance }) => (
  <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
        <AmbulanceIcon className="w-7 h-7" />
      </div>
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${ambulance.type === 'আইসিইউ' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
        {ambulance.type} ইউনিট
      </span>
    </div>
    <h4 className="font-bold text-gray-900 text-lg mb-1">{ambulance.name}</h4>
    <div className="text-sm text-gray-500 mb-6 flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      কুমিল্লায় উপলব্ধ
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="text-xs font-semibold text-gray-400">২৪/৭ সেবা</div>
      <a 
        href={`tel:${ambulance.phone}`}
        className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-100 transition-all flex items-center gap-2"
      >
        <Phone className="w-4 h-4" />
        {ambulance.phone}
      </a>
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="w-10 h-10 text-gray-300" />
    </div>
    <h4 className="text-xl font-bold text-gray-900 mb-2">কোনো ফলাফল পাওয়া যায়নি</h4>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default App;
