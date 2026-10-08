export enum Category {
  DOCTORS = 'ডাক্তার',
  HOSPITALS = 'হাসপাতাল',
  DIAGNOSTIC = 'ডায়াগনস্টিক সেন্টার',
  AMBULANCE = 'অ্যাম্বুলেন্স',
  UPAZILA = 'উপজেলা ডিরেক্টরি',
  CLUSTERS = 'হাসপাতাল তুলনা ও ক্লাস্টার'
}

export enum Department {
  MEDICINE = 'মেডিসিন বিশেষজ্ঞ',
  CARDIOLOGY = 'কার্ডিওলোজি বিশেষজ্ঞ',
  GYNAECOLOGY = 'স্ত্রী ও প্রসূতি রোগ বিশেষজ্ঞ',
  PEDIATRICS = 'নবজাতক ও শিশু রোগ বিশেষজ্ঞ',
  PSYCHIATRY = 'মনোরোগ বিশেষজ্ঞ',
  NEUROLOGY = 'নিউরোলজি বিশেষজ্ঞ',
  CHILD_CARDIOLOGY = 'শিশু হৃদরোগ বিশেষজ্ঞ',
  COLORECTAL_SURGERY = 'লেজার ও কোলোরেক্টাল সার্জন',
  GASTROENTEROLOGY = 'গ্যাস্ট্রোএন্টারোলজি বিশেষজ্ঞ',
  ENT = 'নাক, কান ও গলা বিশেষজ্ঞ',
  ORTHOPEDICS = 'অর্থোপেডিক সার্জন',
  DERMATOLOGY = 'যৌন ও চর্মরোগ বিশেষজ্ঞ',
  CHEST_MEDICINE = 'বক্ষব্যাধি বিশেষজ্ঞ',
  EYE = 'চক্ষু বিশেষজ্ঞ ও সার্জন',
  DENTAL = 'ডেন্টাল সার্জন',
  ENDOCRINOLOGY = 'এন্ডোক্রাইনোলজি ও ডায়াবেটিস বিশেষজ্ঞ',
  NEURO_CRITICAL_CARE = 'নিউরোলজি ও ক্রিটিক্যাল কেয়ার মেডিসিন',
  GENERAL_PHYSICIAN = 'জেনারেল ফিজিশিয়ান',
  NEPHROLOGY = 'নেফ্রোলজি বিশেষজ্ঞ',
  NEONATAL_PEDIATRICS_SURGEON = 'নবজাতক ও শিশু সার্জন',
  UROLOGY = 'ইউরোলজি বিশেষজ্ঞ',
  PREVENTIVE_MEDICINE = 'প্রিভেন্টিভ মেডিসিন বিশেষজ্ঞ',
  ONCOLOGY = 'অনকোলজি বিশেষজ্ঞ',
  KIDNEY_SPECIALIST = 'কিডনি ট্রান্সপ্ল্যান্ট ও ডায়ালাইসিস বিশেষজ্ঞ',
  SURGERY = 'জেনারেল সার্জন',
  PHYSICAL_MEDICINE = 'ফিজিক্যাল মেডিসিন ও রিহ্যাবিলিটেশন',
  NEUROSURGERY = 'নিউরোসার্জন',
  VASCULAR_SURGERY = 'ভাস্কুলার ও এন্ডোভাস্কুলার সার্জন',
  HEPATOLOGY = 'হেপাটোলজি (লিভার) বিশেষজ্ঞ'
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  specialties: Department[];
  image: string;
  area?: string;
  upazila?: string;
  facilityType?: string;
  categoryType?: 'সরকারি' | 'বেসরকারি' | 'সামরিক' | 'আধা-সরকারি';
  bedCapacity?: string;
  hasICU?: boolean;
  hasCCU?: boolean;
  hasNICU?: boolean;
  hasDialysis?: boolean;
  hasCTScan?: boolean;
  hasMRI?: boolean;
  services?: string[];
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Doctor {
  id: string;
  name: string;
  speciality: Department;
  hospital: string;
  timing: string;
  phone: string;
  image: string;
  fee?: string;
  degree?: string;
  designation?: string;
  multiFacilities?: string[];
  departmentCategory?: string;
}

export interface Ambulance {
  id: string;
  name: string;
  phone: string;
  type: 'বেসিক' | 'আইসিইউ' | 'স্ট্যান্ডার্ড';
  availability: '২৪/৭' | 'সীমিত';
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  hospitalName: string;
  preferredDate: string;
  problemSummary?: string;
  status: 'অপেক্ষমাণ' | 'নিশ্চিত' | 'বাতিল';
  createdAt: string;
}

export interface EmergencyRequest {
  id: string;
  callerName: string;
  callerPhone: string;
  location: string;
  serviceType: string;
  notes?: string;
  status: 'জরুরি' | 'সম্পন্ন' | 'বাতিল';
  createdAt: string;
}

export interface UpazilaHealthData {
  upazila: string;
  governmentFacilities: string;
  privateFacilities: string;
  diagnosticCentres: string;
  totalFacilities: string;
  details: string;
}
