
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
  { id: 'cdp2', name: 'Dr. Md. Minhaz Uddin Bhuiyan', speciality: Department.MEDICINE, hospital: CD_PATH_NAME, timing: 'কল করে নিশ্চিত হোন', phone: '01716-277211', fee: '৮০০ টাকা', degree: 'MBBS (DMC), BCS, FCPS (Medicine), ACP (USA)', image: 'https://picsum.photos/seed/cdp2/200/200' },
  { id: 'cdp3', name: 'Prof. Dr. Triptish Chandra Ghose', speciality: Department.CARDIOLOGY, hospital: CD_PATH_NAME, timing: 'দুপুর ১:০০ - রাত ৮:০০', phone: '01716-277211', fee: '১০০০ টাকা', degree: 'MBBS, PHD (Cardiology), FACP, FESC, FRCP (Eden)', image: 'https://picsum.photos/seed/cdp3/200/200' },
  { id: 'cdp4', name: 'Dr. Mohammad Khalilur Rahman Siddiquee', speciality: Department.CARDIOLOGY, hospital: CD_PATH_NAME, timing: 'দুপুর ২:০০ - বিকাল ৪:০০', phone: '01716-277211', fee: '৮০০ টাকা', degree: 'MBBS, BCS (Health), MD (Cardiology)', image: 'https://picsum.photos/seed/cdp4/200/200' },
  { id: 'cdp5', name: 'Dr. Hasina Akter', speciality: Department.GYNAECOLOGY, hospital: CD_PATH_NAME, timing: 'বিকাল ৫:০০ - রাত ৮:০০', phone: '01716-277211', fee: '১০০০ টাকা', degree: 'MBBS, FCPS (Gyane), MRCOG (London)', image: 'https://picsum.photos/seed/cdp5/200/200' },
  { id: 'cdp6', name: 'Dr. Afroja Khanam', speciality: Department.GYNAECOLOGY, hospital: CD_PATH_NAME, timing: 'বিকাল ৩:০০ - সন্ধ্যা ৬:০০', phone: '01716-277211', fee: '৭০০ টাকা', degree: 'MBBS, BCS (Health), FCPS, MCPS (Obs & Gynae)', image: 'https://picsum.photos/seed/cdp6/200/200' },
  { id: 'cdp7', name: 'Dr. S M A Sufian', speciality: Department.PEDIATRICS, hospital: CD_PATH_NAME, timing: 'বিকাল ৩:০০ - সন্ধ্যা ৭:০০', phone: '01716-277211', fee: '৮০০ টাকা', degree: 'MBBS, DCH, MCPS, FCPS', image: 'https://picsum.photos/seed/cdp7/200/200' },
  { id: 'cdp8', name: 'Dr. Hazera Akter', speciality: Department.PEDIATRICS, hospital: CD_PATH_NAME, timing: 'বিকাল ৩:০৩ - সন্ধ্যা ৬:০০', phone: '01716-277211', fee: '৮০০ টাকা', degree: 'MBBS, BCS (Health), MD (Pediatric Gastroenterology)', image: 'https://picsum.photos/seed/cdp8/200/200' },
  { id: 'cdp9', name: 'Dr. Harun Or Rashid', speciality: Department.PSYCHIATRY, hospital: CD_PATH_NAME, timing: 'সকাল ৩:০০ - সন্ধ্যা ৭:৩০', phone: '01716-277211', fee: '১০০০ টাকা', degree: 'MBBS (DMC), MPhil (Psychiatry)', image: 'https://picsum.photos/seed/cdp9/200/200' },
  { id: 'cdp10', name: 'Dr. Helalur Rahman', speciality: Department.NEUROLOGY, hospital: CD_PATH_NAME, timing: 'বিকাল ৩:৩০ - রাত ১০:০০', phone: '01716-277211', fee: '১২০০ টাকা', degree: 'MBBS, BSC, FCPS (Medicine), MACP (USA)', image: 'https://picsum.photos/seed/cdp10/200/200' },
  { id: 'cdp11', name: 'Dr. Zubayer Ahmed', speciality: Department.SURGERY, hospital: CD_PATH_NAME, timing: 'দুপুর ২:০০ - রাত ৮:০০', phone: '01716-277211', fee: '৮০০ টাকা', degree: 'MBBS, FCPS (Surgery), FACS (America)', image: 'https://picsum.photos/seed/cdp11/200/200' },
  { id: 'cdp12', name: 'Dr. Mohammad Shah Jamal', speciality: Department.GASTROENTEROLOGY, hospital: CD_PATH_NAME, timing: 'দুপুর ২:০০ - সন্ধ্যা ৬:০০', phone: '01716-277211', fee: '১০০০ টাকা', degree: 'MBBS, BCS (Health), FCPS, MD (Gastroenterology)', image: 'https://picsum.photos/seed/cdp12/200/200' },
  { id: 'cdp13', name: 'Dr. Subrata Das (Rupom)', speciality: Department.ENT, hospital: CD_PATH_NAME, timing: 'সকাল ১০:০০ - দুপুর ১:০০', phone: '01716-277211', fee: '৭০০ টাকা', degree: 'MBBS, DLO (ENT)', image: 'https://picsum.photos/seed/cdp13/200/200' },
  { id: 'cdp14', name: 'Dr. Md. Yusuf Mia (Sazon)', speciality: Department.ORTHOPEDICS, hospital: CD_PATH_NAME, timing: 'দুপুর ২:০০ - সন্ধ্যা ৭:০০', phone: '01716-277211', fee: '৮০০ টাকা', degree: 'MBBS, BCS (Health), MS (Orthopedics)', image: 'https://picsum.photos/seed/cdp14/200/200' },
  { id: 'cdp15', name: 'Dr. Romana Sikder', speciality: Department.DERMATOLOGY, hospital: CD_PATH_NAME, timing: 'বিকাল ৩:০০ - সন্ধ্যা ৬:০০', phone: '01716-277211', fee: '৭০০ টাকা', degree: 'MBBS, DDV (BSMMU), MCPS (Dermatology)', image: 'https://picsum.photos/seed/cdp15/200/200' },
  { id: 'cdp16', name: 'Dr. Sanzida Islam', speciality: Department.ENDOCRINOLOGY, hospital: CD_PATH_NAME, timing: 'বিকাল ৩:০০ - বিকাল ৫:০০', phone: '01716-277211', fee: '৮০০ টাকা', degree: 'MBBS, CCD, DEM (BIRDEM)', image: 'https://picsum.photos/seed/cdp16/200/200' },
  { id: 'cdp17', name: 'Dr. Mir Rashedul Hasan', speciality: Department.NEPHROLOGY, hospital: CD_PATH_NAME, timing: 'দুপুর ২:০০ - বিকাল ৪:০০', phone: '01716-277211', fee: '৮০০ টাকা', degree: 'MBBS, BCS (Health), MD (Nephrology), MACP', image: 'https://picsum.photos/seed/cdp17/200/200' },
  { id: 'cdp18', name: 'Professor Dr. Jahangir Hossain Bhuiyan', speciality: Department.ONCOLOGY, hospital: CD_PATH_NAME, timing: 'বিকাল ৫:০০ - রাত ৮:০০', phone: '01716-277211', fee: '১০০০ টাকা', degree: 'MBBS, BCS, DMRT (Dhaka), TTRT (China)', image: 'https://picsum.photos/seed/cdp18/200/200' },
  
  // Existing Doctors
  { id: 'd1', name: 'Dr. Mahfuzur Rahman', speciality: Department.CARDIOLOGY, hospital: 'Moon Hospital Pvt. Ltd.', timing: 'বিকাল ৫:০০ - রাত ৯:০০', phone: '01711-000000', image: 'https://picsum.photos/seed/d1/200/200' },
  { id: 'd2', name: 'Dr. Shamima Nasrin', speciality: Department.GYNAECOLOGY, hospital: 'Midland Hospital Pvt. Ltd.', timing: 'বিকাল ৪:০০ - রাত ৮:০০', phone: '01722-000000', image: 'https://picsum.photos/seed/d2/200/200' },
  { id: 'd3', name: 'Dr. Abul Kashem', speciality: Department.SURGERY, hospital: 'Cumilla Medical Center', timing: 'সন্ধ্যা ৬:০০ - রাত ১০:০০', phone: '01733-000000', image: 'https://picsum.photos/seed/d3/200/200' },
  { id: 'd4', name: 'Dr. Farhana Yasmin', speciality: Department.PEDIATRICS, hospital: 'Maa Moni Hospital', timing: 'বিকাল ৩:০০ - সন্ধ্যা ৭:০০', phone: '01744-000000', image: 'https://picsum.photos/seed/d4/200/200' },
  { id: 'd5', name: 'Dr. Mostafa Kamal', speciality: Department.NEUROLOGY, hospital: 'Neuron Hospital', timing: 'বিকাল ৫:০০ - রাত ৯:০০', phone: '01755-000000', image: 'https://picsum.photos/seed/d5/200/200' },
  { id: 'd6', name: 'Dr. Zahirul Haque', speciality: Department.ORTHOPEDICS, hospital: 'Cumilla Trauma Center', timing: 'বিকাল ৪:০০ - রাত ৮:০০', phone: '01766-000000', image: 'https://picsum.photos/seed/d6/200/200' },
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
