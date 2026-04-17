
import { Hospital, Doctor, Ambulance, Department } from './types';

const CD_PATH_NAME = 'CD Path & Hospital Pvt. Ltd.';

export const HOSPITALS: Hospital[] = [
  { id: '1', name: 'Midland Hospital Pvt. Ltd.', address: 'কান্দিরপাড়, কুমিল্লা', phone: '01711-123456', specialties: [Department.MEDICINE, Department.SURGERY], image: 'https://picsum.photos/seed/h1/800/600' },
  { id: '2', name: 'Moon Hospital Pvt. Ltd.', address: 'ঝাউতলা, কুমিল্লা', phone: '01822-234567', specialties: [Department.GYNAECOLOGY, Department.CARDIOLOGY], image: 'https://picsum.photos/seed/h2/800/600' },
  { id: '3', name: CD_PATH_NAME, address: 'বাদুড়তলা, কুমিল্লা', phone: '01716-277211', specialties: [Department.MEDICINE, Department.CARDIOLOGY, Department.GYNAECOLOGY, Department.PEDIATRICS, Department.NEUROLOGY, Department.GASTROENTEROLOGY, Department.ORTHOPEDICS, Department.DERMATOLOGY, Department.CHEST_MEDICINE, Department.EYE, Department.DENTAL, Department.ENDOCRINOLOGY, Department.NEPHROLOGY, Department.UROLOGY, Department.ONCOLOGY], image: 'https://picsum.photos/seed/h3/800/600' },
  { id: '4', name: 'Health and Doctors Hospital', address: 'টমছম ব্রিজ, কুমিল্লা', phone: '01744-456789', specialties: [Department.SURGERY, Department.PEDIATRICS], image: 'https://picsum.photos/seed/h4/800/600' },
  { id: '5', name: 'Mukti Hospital', address: 'রানীর বাজার, কুমিল্লা', phone: '01855-567890', specialties: [Department.ORTHOPEDICS], image: 'https://picsum.photos/seed/h5/800/600' },
  { id: '6', name: 'Meem Hospital', address: 'লাকসাম রোড, কুমিল্লা', phone: '01966-678901', specialties: [Department.MEDICINE, Department.DENTAL], image: 'https://picsum.photos/seed/h6/800/600' },
  { id: '7', name: 'Mission Hospital (Cumilla Mission Hospital)', address: 'নজরুল এভিনিউ, কুমিল্লা', phone: '01777-789012', specialties: [Department.MEDICINE, Department.GYNAECOLOGY], image: 'https://picsum.photos/seed/h7/800/600' },
  { id: '8', name: 'Rokeya Maternity Clinic', address: 'পুলিশ লাইন, কুমিল্লা', phone: '01888-890123', specialties: [Department.GYNAECOLOGY], image: 'https://picsum.photos/seed/h8/800/600' },
  { id: '9', name: 'Neuron Hospital and Diagnostic Center', address: 'ধর্মপুর, কুমিল্লা', phone: '01999-901234', specialties: [Department.NEUROLOGY, Department.SURGERY], image: 'https://picsum.photos/seed/h9/800/600' },
  { id: '10', name: 'Life Care Hospital', address: 'কান্দিরপাড়, কুমিল্লা', phone: '01711-222333', specialties: [Department.CARDIOLOGY, Department.MEDICINE], image: 'https://picsum.photos/seed/h10/800/600' },
  { id: '11', name: 'Sonar Bangla Hospital', address: 'স্টেশন রোড, কুমিল্লা', phone: '01822-333444', specialties: [Department.SURGERY], image: 'https://picsum.photos/seed/h11/800/600' },
  { id: '12', name: 'Cumilla Denta General Hospital', address: 'রাজগঞ্জ, কুমিল্লা', phone: '01933-444555', specialties: [Department.DENTAL], image: 'https://picsum.photos/seed/h12/800/600' },
  { id: '13', name: 'Medi Hospital (Pvt.) Ltd.', address: 'ঝাউতলা, কুমিল্লা', phone: '01744-555666', specialties: [Department.MEDICINE, Department.PEDIATRICS], image: 'https://picsum.photos/seed/h13/800/600' },
  { id: '14', name: 'Cumilla Trauma Center', address: 'টমছম ব্রিজ, কুমিল্লা', phone: '01855-666777', specialties: [Department.ORTHOPEDICS, Department.SURGERY], image: 'https://picsum.photos/seed/h14/800/600' },
  { id: '15', name: 'Cumilla Medical Center Pvt. Ltd. (Tower Hospital)', address: 'লাকসাম রোড, কুমিল্লা', phone: '01966-777888', specialties: [Department.CARDIOLOGY, Department.MEDICINE, Department.NEUROLOGY], image: 'https://picsum.photos/seed/h15/800/600' },
  { id: '16', name: 'Maa Moni Hospital', address: 'কোটবাড়ি, কুমিল্লা', phone: '01777-888999', specialties: [Department.PEDIATRICS, Department.GYNAECOLOGY], image: 'https://picsum.photos/seed/h16/800/600' },
  { id: '17', name: 'New Vision Model Hospital', address: 'কান্দিরপাড়, কুমিল্লা', phone: '01888-999000', specialties: [Department.MEDICINE], image: 'https://picsum.photos/seed/h17/800/600' },
  { id: '18', name: 'B. Rahman General Hospital', address: 'বাদুড়তলা, কুমিল্লা', phone: '01999-000111', specialties: [Department.SURGERY], image: 'https://picsum.photos/seed/h18/800/600' },
  { id: '19', name: 'United Hospital, Tomsom Bridge', address: 'টমছম ব্রিজ, কুমিল্লা', phone: '01711-555444', specialties: [Department.ENT, Department.MEDICINE], image: 'https://picsum.photos/seed/h19/800/600' },
  { id: '20', name: 'Cumilla Metropolitan Hospital', address: 'লাকসাম রোড, কুমিল্লা', phone: '01822-666555', specialties: [Department.CARDIOLOGY, Department.SURGERY], image: 'https://picsum.photos/seed/h20/800/600' },
  { id: '21', name: 'Comilla Central Hospital (Pvt.) Ltd.', address: 'ঝাউতলা, কুমিল্লা', phone: '01933-777666', specialties: [Department.MEDICINE, Department.GYNAECOLOGY], image: 'https://picsum.photos/seed/h21/800/600' },
  { id: '22', name: 'Comilla Popular Hospital (Pvt.) Ltd.', address: 'কান্দিরপাড়, কুমিল্লা', phone: '01744-888777', specialties: [Department.SURGERY, Department.CARDIOLOGY], image: 'https://picsum.photos/seed/h22/800/600' },
  { id: '23', name: 'Green Lab Hospital (Gouripur, Daudkandi)', address: 'দাউদকান্দি, কুমিল্লা', phone: '01855-999888', specialties: [Department.MEDICINE], image: 'https://picsum.photos/seed/h23/800/600' },
  { id: '24', name: 'D.H. Hospital (EPZ Road, Tomsom Bridge)', address: 'ইপিজি রোড, কুমিল্লা', phone: '01966-000999', specialties: [Department.ORTHOPEDICS, Department.SURGERY], image: 'https://picsum.photos/seed/h24/800/600' },
];

export const DOCTORS: Doctor[] = [
  // CD Path & Hospital Doctors
  { id: 'cdp1', name: 'Prof. Dr. Shahab Uddin', speciality: Department.MEDICINE, hospital: CD_PATH_NAME, timing: 'সকাল ৯:০০ - দুপুর ৩:০০', phone: '01716-277211', fee: '১৫০০ টাকা', degree: 'MBBS, FCPS (Internal Medicine), FCPS (USA), FRCP (USA)', image: 'https://picsum.photos/seed/cdp1/200/200' },
  { id: 'cdp2', name: 'Prof. Dr. Triptish Chandra Ghose', speciality: Department.CARDIOLOGY, hospital: CD_PATH_NAME, timing: 'দুপুর ১:০০ - রাত ৮:০০', phone: '01716-277211', fee: '১০০০ টাকা', degree: 'MBBS, PHD (Cardiology), FACP, FESC, FRCP (Eden)', image: 'https://picsum.photos/seed/cdp3/200/200' },
  { id: 'cdp3', name: 'Dr. Hasina Akter', speciality: Department.GYNAECOLOGY, hospital: CD_PATH_NAME, timing: 'বিকাল ৫:০০ - রাত ৮:০০', phone: '01716-277211', fee: '১০০০ টাকা', degree: 'MBBS, FCPS (Gyane), MRCOG (London)', image: 'https://picsum.photos/seed/cdp5/200/200' },
  
  // Moon Hospital Doctors
  { id: 'm1', name: 'Dr. Mahfuzur Rahman', speciality: Department.CARDIOLOGY, hospital: 'Moon Hospital Pvt. Ltd.', timing: 'বিকাল ৫:০০ - রাত ৯:০০', phone: '01822-234567', fee: '১০০০ টাকা', degree: 'MBBS, MD (Cardiology)', image: 'https://picsum.photos/seed/m1/200/200' },
  { id: 'm2', name: 'Dr. Shamima Nasrin', speciality: Department.GYNAECOLOGY, hospital: 'Moon Hospital Pvt. Ltd.', timing: 'বিকাল ৪:০০ - রাত ৮:০০', phone: '01822-234567', fee: '৮০০ টাকা', degree: 'MBBS, FCPS (Obs & Gynae)', image: 'https://picsum.photos/seed/m2/200/200' },

  // Comilla Medical Center / Tower Hospital
  { id: 'th1', name: 'Prof. Dr. AKM Khairul Alam', speciality: Department.SURGERY, hospital: 'Cumilla Medical Center Pvt. Ltd. (Tower Hospital)', timing: 'সকাল ১০:০০ - দুপুর ২:০০', phone: '01966-777888', fee: '১০০০ টাকা', degree: 'MBBS, FCPS (Surgery)', image: 'https://picsum.photos/seed/th1/200/200' },
  { id: 'th2', name: 'Dr. Md. Emdadul Haque', speciality: Department.NEPHROLOGY, hospital: 'Cumilla Medical Center Pvt. Ltd. (Tower Hospital)', timing: 'বিকাল ৫:০০ - রাত ৮:০০', phone: '01966-777888', fee: '৮০০ টাকা', degree: 'MBBS, MD (Nephrology)', image: 'https://picsum.photos/seed/th2/200/200' },

  // Comilla Trauma Center
  { id: 'tr1', name: 'Dr. Zahirul Haque', speciality: Department.ORTHOPEDICS, hospital: 'Cumilla Trauma Center', timing: 'বিকাল ৪:০০ - রাত ৮:০০', phone: '01855-666777', fee: '৮০০ টাকা', degree: 'MBBS, MS (Orthopedics)', image: 'https://picsum.photos/seed/tr1/200/200' },
  { id: 'tr2', name: 'Dr. S.M. Jahangir Kabir', speciality: Department.ENT, hospital: 'Cumilla Trauma Center', timing: 'সন্ধ্যা ৬:০০ - রাত ৯:০০', phone: '01855-666777', fee: '৮০০ টাকা', degree: 'MBBS, DLO (ENT)', image: 'https://picsum.photos/seed/tr2/200/200' },

  // Other Specialists
  { id: 'd7', name: 'Dr. Mujibul Hoque', speciality: Department.CHILD_CARDIOLOGY, hospital: CD_PATH_NAME, timing: 'বিকাল ৪:০০ - রাত ৮:০০', phone: '01716-277211', fee: '১০০০ টাকা', degree: 'MBBS, D-Card, MD (Child Cardiology)', image: 'https://picsum.photos/seed/d7/200/200' },
  { id: 'd8', name: 'Dr. Md. Mainul Islam', speciality: Department.COLORECTAL_SURGERY, hospital: 'United Hospital, Tomsom Bridge', timing: 'সন্ধ্যা ৬:০০ - রাত ৯:০০', phone: '01711-555444', fee: '৮০০ টাকা', degree: 'MBBS, FCPS (Surgery), MS (Colorectal)', image: 'https://picsum.photos/seed/d8/200/200' },
  { id: 'd9', name: 'Prof. Dr. Syed Wahiduzzaman', speciality: Department.NEURO_CRITICAL_CARE, hospital: 'Neuron Hospital and Diagnostic Center', timing: 'সকাল ১০:০০ - দুপুর ২:০০', phone: '01999-901234', fee: '১২০০ টাকা', degree: 'MBBS, MD (Neurology), MD (Critical Care)', image: 'https://picsum.photos/seed/d9/200/200' },
  { id: 'd10', name: 'Dr. Tanvir Ahmed', speciality: Department.KIDNEY_SPECIALIST, hospital: 'Midland Hospital Pvt. Ltd.', timing: 'বিকাল ৫:০০ - রাত ৮:০০', phone: '01711-123456', fee: '১০০০ টাকা', degree: 'MBBS, MD (Nephrology), Fellowship in Kidney Transplant', image: 'https://picsum.photos/seed/d10/200/200' },
];

export const AMBULANCES: Ambulance[] = [
  { id: 'a1', name: 'Comilla Red Crescent Ambulance', phone: '01811-121212', type: 'স্ট্যান্ডার্ড', availability: '২৪/৭' },
  { id: 'a2', name: 'Al-Shifa ICU Ambulance Service', phone: '01712-232323', type: 'আইসিইউ', availability: '২৪/৭' },
  { id: 'a3', name: 'City Hospital Private Ambulance', phone: '01913-343434', type: 'বেসিক', availability: '২৪/৭' },
];
