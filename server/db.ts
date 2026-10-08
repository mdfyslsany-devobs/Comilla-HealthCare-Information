import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Doctor, Hospital, Ambulance, UpazilaHealthData } from '../types.js';
import { 
  HOSPITALS as INITIAL_HOSPITALS, 
  DOCTORS as INITIAL_DOCTORS, 
  AMBULANCES as INITIAL_AMBULANCES, 
  UPAZILA_DIRECTORY, 
  HEALTHCARE_CLUSTERS 
} from '../data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

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

export interface DatabaseSchema {
  doctors: Doctor[];
  hospitals: Hospital[];
  ambulances: Ambulance[];
  appointments: Appointment[];
  emergencies: EmergencyRequest[];
  upazilas: UpazilaHealthData[];
  clusters: any[];
  adminToken: string;
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // If parsed data exists, preserve appointments and emergencies, but ensure new hospitals and doctors are available
        const mergedHospitals = parsed.hospitals && parsed.hospitals.length >= INITIAL_HOSPITALS.length 
          ? parsed.hospitals 
          : INITIAL_HOSPITALS;
        const mergedDoctors = parsed.doctors && parsed.doctors.length >= INITIAL_DOCTORS.length 
          ? parsed.doctors 
          : INITIAL_DOCTORS;

        const result: DatabaseSchema = {
          doctors: mergedDoctors,
          hospitals: mergedHospitals,
          ambulances: parsed.ambulances || INITIAL_AMBULANCES,
          appointments: parsed.appointments || [],
          emergencies: parsed.emergencies || [],
          upazilas: UPAZILA_DIRECTORY,
          clusters: HEALTHCARE_CLUSTERS,
          adminToken: parsed.adminToken || 'comilla_admin_secret_2026',
        };
        this.saveData(result);
        return result;
      }
    } catch (err) {
      console.error('Failed to load database file, creating fresh seed:', err);
    }

    const defaultData: DatabaseSchema = {
      doctors: INITIAL_DOCTORS,
      hospitals: INITIAL_HOSPITALS,
      ambulances: INITIAL_AMBULANCES,
      appointments: [
        {
          id: 'app_seed_1',
          patientName: 'মোহাম্মদ রফিকুল ইসলাম',
          patientPhone: '01811223344',
          doctorId: 'cdp1',
          doctorName: 'Prof. Dr. Md. Shahab Uddin',
          hospitalName: 'CD Path & Hospital Pvt. Ltd.',
          preferredDate: '২০২৬-১০-১৫',
          problemSummary: 'দীর্ঘদিনের গ্যাস্ট্রিক ও বুকের অস্বস্তি সমস্যা',
          status: 'নিশ্চিত',
          createdAt: new Date().toISOString(),
        }
      ],
      emergencies: [
        {
          id: 'emg_seed_1',
          callerName: 'তানভীর হাসান',
          callerPhone: '01799887766',
          location: 'কান্দিরপাড় মোড়, কুমিল্লা',
          serviceType: 'আইসিইউ অ্যাম্বুলেন্স',
          notes: 'হৃদরোগের রোগী, দ্রুত হাসপাতালে নেওয়া প্রয়োজন',
          status: 'জরুরি',
          createdAt: new Date().toISOString(),
        }
      ],
      upazilas: UPAZILA_DIRECTORY,
      clusters: HEALTHCARE_CLUSTERS,
      adminToken: 'comilla_admin_secret_2026',
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    const data = dataToSave || this.data;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Doctor Methods
  getDoctors(): Doctor[] {
    return this.data.doctors;
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.data.doctors.find(d => d.id === id);
  }

  createDoctor(doctor: Omit<Doctor, 'id'>): Doctor {
    const newDoc: Doctor = {
      ...doctor,
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    };
    this.data.doctors.unshift(newDoc);
    this.saveData();
    return newDoc;
  }

  updateDoctor(id: string, update: Partial<Doctor>): Doctor | null {
    const idx = this.data.doctors.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.doctors[idx] = { ...this.data.doctors[idx], ...update };
    this.saveData();
    return this.data.doctors[idx];
  }

  deleteDoctor(id: string): boolean {
    const initialLen = this.data.doctors.length;
    this.data.doctors = this.data.doctors.filter(d => d.id !== id);
    if (this.data.doctors.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Hospital Methods
  getHospitals(): Hospital[] {
    return this.data.hospitals;
  }

  getHospitalById(id: string): Hospital | undefined {
    return this.data.hospitals.find(h => h.id === id);
  }

  createHospital(hospital: Omit<Hospital, 'id'>): Hospital {
    const newHosp: Hospital = {
      ...hospital,
      id: 'hosp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    };
    this.data.hospitals.unshift(newHosp);
    this.saveData();
    return newHosp;
  }

  updateHospital(id: string, update: Partial<Hospital>): Hospital | null {
    const idx = this.data.hospitals.findIndex(h => h.id === id);
    if (idx === -1) return null;
    this.data.hospitals[idx] = { ...this.data.hospitals[idx], ...update };
    this.saveData();
    return this.data.hospitals[idx];
  }

  deleteHospital(id: string): boolean {
    const initialLen = this.data.hospitals.length;
    this.data.hospitals = this.data.hospitals.filter(h => h.id !== id);
    if (this.data.hospitals.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Ambulance Methods
  getAmbulances(): Ambulance[] {
    return this.data.ambulances;
  }

  getAmbulanceById(id: string): Ambulance | undefined {
    return this.data.ambulances.find(a => a.id === id);
  }

  createAmbulance(ambulance: Omit<Ambulance, 'id'>): Ambulance {
    const newAmb: Ambulance = {
      ...ambulance,
      id: 'amb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    };
    this.data.ambulances.unshift(newAmb);
    this.saveData();
    return newAmb;
  }

  updateAmbulance(id: string, update: Partial<Ambulance>): Ambulance | null {
    const idx = this.data.ambulances.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.ambulances[idx] = { ...this.data.ambulances[idx], ...update };
    this.saveData();
    return this.data.ambulances[idx];
  }

  deleteAmbulance(id: string): boolean {
    const initialLen = this.data.ambulances.length;
    this.data.ambulances = this.data.ambulances.filter(a => a.id !== id);
    if (this.data.ambulances.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Appointments
  getAppointments(): Appointment[] {
    return this.data.appointments;
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment {
    const newApp: Appointment = {
      ...appointment,
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      status: 'অপেক্ষমাণ',
      createdAt: new Date().toISOString(),
    };
    this.data.appointments.unshift(newApp);
    this.saveData();
    return newApp;
  }

  updateAppointmentStatus(id: string, status: 'অপেক্ষমাণ' | 'নিশ্চিত' | 'বাতিল'): Appointment | null {
    const idx = this.data.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.appointments[idx].status = status;
    this.saveData();
    return this.data.appointments[idx];
  }

  // Emergencies
  getEmergencies(): EmergencyRequest[] {
    return this.data.emergencies;
  }

  createEmergency(req: Omit<EmergencyRequest, 'id' | 'createdAt' | 'status'>): EmergencyRequest {
    const newEmg: EmergencyRequest = {
      ...req,
      id: 'emg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      status: 'জরুরি',
      createdAt: new Date().toISOString(),
    };
    this.data.emergencies.unshift(newEmg);
    this.saveData();
    return newEmg;
  }

  updateEmergencyStatus(id: string, status: 'জরুরি' | 'সম্পন্ন' | 'বাতিল'): EmergencyRequest | null {
    const idx = this.data.emergencies.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.emergencies[idx].status = status;
    this.saveData();
    return this.data.emergencies[idx];
  }

  // Upazila Directory & Clusters
  getUpazilas(): UpazilaHealthData[] {
    return this.data.upazilas || UPAZILA_DIRECTORY;
  }

  getClusters(): any[] {
    return this.data.clusters || HEALTHCARE_CLUSTERS;
  }

  // Stats
  getStats() {
    return {
      totalDoctors: this.data.doctors.length,
      totalHospitals: this.data.hospitals.length,
      totalAmbulances: this.data.ambulances.length,
      totalAppointments: this.data.appointments.length,
      totalEmergencies: this.data.emergencies.length,
      totalUpazilas: (this.data.upazilas || UPAZILA_DIRECTORY).length,
      totalClusters: (this.data.clusters || HEALTHCARE_CLUSTERS).length,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  // Reset to initial seed
  resetToDefault() {
    this.data = {
      doctors: INITIAL_DOCTORS,
      hospitals: INITIAL_HOSPITALS,
      ambulances: INITIAL_AMBULANCES,
      appointments: [],
      emergencies: [],
      upazilas: UPAZILA_DIRECTORY,
      clusters: HEALTHCARE_CLUSTERS,
      adminToken: 'comilla_admin_secret_2026',
    };
    this.saveData();
    return this.data;
  }
}

export const db = new Database();
