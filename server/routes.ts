import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage config for doctor and hospital image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'img-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('শুধুমাত্র JPG, PNG, WebP বা SVG ছবি গ্রহণযোগ্য'));
    }
  },
});

export const apiRouter = Router();

// Middleware for Admin Token Validation
const requireAdmin = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.query.token;
  if (!token || token !== 'comilla_admin_secret_2026') {
    return res.status(401).json({ success: false, error: 'অননুমোদিত প্রবেশাধিকার। এডমিন টোকেন আবশ্যক।' });
  }
  next();
};

// ----------------------------------------------------
// SYSTEM & HEALTH
// ----------------------------------------------------
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'Comilla Healthcare Hub API',
    version: '1.0.0',
    stats: db.getStats(),
  });
});

apiRouter.get('/stats', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getStats() });
});

// Admin Login
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === 'admin123' || password === 'comilla2026') {
    return res.json({
      success: true,
      token: 'comilla_admin_secret_2026',
      user: { name: 'Comilla Hub Admin', role: 'SuperAdmin' },
    });
  }
  return res.status(401).json({ success: false, error: 'ভুল এডমিন পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।' });
});

apiRouter.get('/admin/verify', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'comilla_admin_secret_2026') {
    return res.json({ success: true, valid: true });
  }
  return res.status(401).json({ success: false, valid: false });
});

// Database Reset to initial state
apiRouter.post('/admin/reset', requireAdmin, (_req: Request, res: Response) => {
  const data = db.resetToDefault();
  res.json({ success: true, message: 'ডাটাবেজ সফলভাবে রিসেট করা হয়েছে।', data });
});

// ----------------------------------------------------
// IMAGE UPLOAD (For Doctor Photos & Hospital Logos)
// ----------------------------------------------------
apiRouter.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'কোনো ছবি আপলোড করা হয়নি।' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// ----------------------------------------------------
// DOCTORS API
// ----------------------------------------------------
apiRouter.get('/doctors', (req: Request, res: Response) => {
  const { search, dept, hospital } = req.query;
  let doctors = db.getDoctors();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    doctors = doctors.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.hospital.toLowerCase().includes(q) ||
      d.speciality.toLowerCase().includes(q) ||
      (d.degree && d.degree.toLowerCase().includes(q))
    );
  }

  if (dept && typeof dept === 'string' && dept !== 'সবগুলো' && dept !== 'All') {
    doctors = doctors.filter(d => d.speciality === dept);
  }

  if (hospital && typeof hospital === 'string') {
    doctors = doctors.filter(d => d.hospital.toLowerCase().includes(hospital.toLowerCase()));
  }

  res.json({ success: true, count: doctors.length, data: doctors });
});

apiRouter.get('/doctors/:id', (req: Request, res: Response) => {
  const doctor = db.getDoctorById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, error: 'ডাক্তারের তথ্য পাওয়া যায়নি।' });
  }
  res.json({ success: true, data: doctor });
});

apiRouter.post('/doctors', requireAdmin, (req: Request, res: Response) => {
  const { name, speciality, hospital, timing, phone, fee, degree, image } = req.body;
  if (!name || !speciality || !hospital || !phone) {
    return res.status(400).json({ success: false, error: 'নাম, বিশেষজ্ঞ বিভাগ, হাসপাতাল এবং ফোন নম্বর আবশ্যক।' });
  }

  const newDoc = db.createDoctor({
    name,
    speciality,
    hospital,
    timing: timing || 'সন্ধ্যা ৬:০০ - রাত ৯:০০',
    phone,
    fee: fee || '১০০০ টাকা',
    degree: degree || 'MBBS',
    image: image || `https://picsum.photos/seed/${Date.now()}/200/200`,
  });

  res.status(201).json({ success: true, data: newDoc });
});

apiRouter.put('/doctors/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateDoctor(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'ডাক্তারের তথ্য পাওয়া যায়নি।' });
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/doctors/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteDoctor(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'ডাক্তার পাওয়া যায়নি।' });
  }
  res.json({ success: true, message: 'ডাক্তারের তথ্য সফলভাবে মুছে ফেলা হয়েছে।' });
});

// ----------------------------------------------------
// HOSPITALS API
// ----------------------------------------------------
apiRouter.get('/hospitals', (req: Request, res: Response) => {
  const { search, specialty, area, hasICU } = req.query;
  let hospitals = db.getHospitals();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    hospitals = hospitals.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      (h.area && h.area.toLowerCase().includes(q))
    );
  }

  if (area && typeof area === 'string' && area !== 'সবগুলো') {
    hospitals = hospitals.filter(h => h.area === area || h.address.includes(area));
  }

  if (hasICU === 'true') {
    hospitals = hospitals.filter(h => h.hasICU === true);
  }

  if (specialty && typeof specialty === 'string' && specialty !== 'সবগুলো') {
    hospitals = hospitals.filter(h => h.specialties.includes(specialty as any));
  }

  res.json({ success: true, count: hospitals.length, data: hospitals });
});

apiRouter.get('/upazilas', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getUpazilas() });
});

apiRouter.get('/clusters', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getClusters() });
});

apiRouter.get('/hospitals/:id', (req: Request, res: Response) => {
  const hospital = db.getHospitalById(req.params.id);
  if (!hospital) {
    return res.status(404).json({ success: false, error: 'হাসপাতালের তথ্য পাওয়া যায়নি।' });
  }
  res.json({ success: true, data: hospital });
});

apiRouter.post('/hospitals', requireAdmin, (req: Request, res: Response) => {
  const { name, address, phone, specialties, image } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).json({ success: false, error: 'নাম, ঠিকানা এবং ফোন নম্বর আবশ্যক।' });
  }

  const newHosp = db.createHospital({
    name,
    address,
    phone,
    specialties: specialties || [],
    image: image || `https://picsum.photos/seed/${Date.now()}/800/600`,
  });

  res.status(201).json({ success: true, data: newHosp });
});

apiRouter.put('/hospitals/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateHospital(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'হাসপাতাল পাওয়া যায়নি।' });
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/hospitals/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteHospital(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'হাসপাতাল পাওয়া যায়নি।' });
  }
  res.json({ success: true, message: 'হাসপাতাল সফলভাবে মুছে ফেলা হয়েছে।' });
});

// ----------------------------------------------------
// AMBULANCES API
// ----------------------------------------------------
apiRouter.get('/ambulances', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getAmbulances() });
});

apiRouter.post('/ambulances', requireAdmin, (req: Request, res: Response) => {
  const { name, phone, type, availability } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'নাম এবং ফোন আবশ্যক।' });
  }
  const newAmb = db.createAmbulance({
    name,
    phone,
    type: type || 'স্ট্যান্ডার্ড',
    availability: availability || '২৪/৭',
  });
  res.status(201).json({ success: true, data: newAmb });
});

apiRouter.put('/ambulances/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateAmbulance(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'অ্যাম্বুলেন্স পাওয়া যায়নি।' });
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/ambulances/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteAmbulance(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'অ্যাম্বুলেন্স পাওয়া যায়নি।' });
  }
  res.json({ success: true, message: 'অ্যাম্বুলেন্স সফলভাবে মুছে ফেলা হয়েছে।' });
});

// ----------------------------------------------------
// APPOINTMENTS API (Patient booking & Admin review)
// ----------------------------------------------------
apiRouter.get('/appointments', (req: Request, res: Response) => {
  const appointments = db.getAppointments();
  res.json({ success: true, count: appointments.length, data: appointments });
});

apiRouter.post('/appointments', (req: Request, res: Response) => {
  const { patientName, patientPhone, doctorId, doctorName, hospitalName, preferredDate, problemSummary } = req.body;
  if (!patientName || !patientPhone || !doctorId) {
    return res.status(400).json({ success: false, error: 'রোগীর নাম, মোবাইল নম্বর এবং ডাক্তার নির্বাচন আবশ্যক।' });
  }

  const newApp = db.createAppointment({
    patientName,
    patientPhone,
    doctorId,
    doctorName: doctorName || 'ডাক্তার',
    hospitalName: hospitalName || 'হাসপাতাল',
    preferredDate: preferredDate || new Date().toISOString().split('T')[0],
    problemSummary: problemSummary || '',
  });

  res.status(201).json({
    success: true,
    message: 'আপনার সিরিয়াল আবেদন সফলভাবে গ্রহণ করা হয়েছে। হাসপাতাল থেকে শীঘ্রই যোগাযোগ করা হবে।',
    data: newApp,
  });
});

apiRouter.patch('/appointments/:id', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['অপেক্ষমাণ', 'নিশ্চিত', 'বাতিল'].includes(status)) {
    return res.status(400).json({ success: false, error: 'অবৈধ স্ট্যাটাস।' });
  }
  const updated = db.updateAppointmentStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'সিরিয়াল আবেদন পাওয়া যায়নি।' });
  }
  res.json({ success: true, data: updated });
});

// ----------------------------------------------------
// EMERGENCY REQUESTS API (Fast ambulance dispatch)
// ----------------------------------------------------
apiRouter.get('/emergencies', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getEmergencies() });
});

apiRouter.post('/emergencies', (req: Request, res: Response) => {
  const { callerName, callerPhone, location, serviceType, notes } = req.body;
  if (!callerName || !callerPhone || !location) {
    return res.status(400).json({ success: false, error: 'নাম, মোবাইল নম্বর এবং বর্তমান ঠিকানা আবশ্যক।' });
  }

  const newEmg = db.createEmergency({
    callerName,
    callerPhone,
    location,
    serviceType: serviceType || 'জরুরি অ্যাম্বুলেন্স',
    notes: notes || '',
  });

  res.status(201).json({
    success: true,
    message: 'জরুরি বার্তা গৃহীত হয়েছে। জরুরি ডিসপ্যাচ দল দ্রুত যোগাযোগ করছে।',
    data: newEmg,
  });
});

apiRouter.patch('/emergencies/:id', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['জরুরি', 'সম্পন্ন', 'বাতিল'].includes(status)) {
    return res.status(400).json({ success: false, error: 'অবৈধ স্ট্যাটাস।' });
  }
  const updated = db.updateEmergencyStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'জরুরি রিকোয়েস্ট পাওয়া যায়নি।' });
  }
  res.json({ success: true, data: updated });
});
