import { Doctor, Hospital, Ambulance, Appointment, EmergencyRequest } from './types';
import { DOCTORS as DEFAULT_DOCTORS, HOSPITALS as DEFAULT_HOSPITALS, AMBULANCES as DEFAULT_AMBULANCES } from './data';

const BASE_URL = '/api';

export const api = {
  // ----------------- DOCTORS -----------------
  async getDoctors(dept?: string, search?: string): Promise<Doctor[]> {
    try {
      const params = new URLSearchParams();
      if (dept && dept !== 'সবগুলো') params.append('dept', dept);
      if (search) params.append('search', search);

      const res = await fetch(`${BASE_URL}/doctors?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('API error (getDoctors), using local fallback:', err);
      return DEFAULT_DOCTORS;
    }
  },

  async createDoctor(doc: Omit<Doctor, 'id'>, token: string): Promise<Doctor> {
    const res = await fetch(`${BASE_URL}/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(doc),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'ডাক্তার যোগ করতে ব্যর্থ হয়েছে');
    return data.data;
  },

  async updateDoctor(id: string, doc: Partial<Doctor>, token: string): Promise<Doctor> {
    const res = await fetch(`${BASE_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(doc),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'ডাক্তারের তথ্য আপডেট করতে ব্যর্থ হয়েছে');
    return data.data;
  },

  async deleteDoctor(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/doctors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'ডাক্তার মুছতে ব্যর্থ হয়েছে');
    }
    return true;
  },

  // ----------------- HOSPITALS -----------------
  async getHospitals(specialty?: string, search?: string, area?: string, hasICU?: boolean): Promise<Hospital[]> {
    try {
      const params = new URLSearchParams();
      if (specialty && specialty !== 'সবগুলো') params.append('specialty', specialty);
      if (search) params.append('search', search);
      if (area && area !== 'সবগুলো') params.append('area', area);
      if (hasICU) params.append('hasICU', 'true');

      const res = await fetch(`${BASE_URL}/hospitals?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch hospitals');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('API error (getHospitals), using local fallback:', err);
      return DEFAULT_HOSPITALS;
    }
  },

  async getUpazilas() {
    try {
      const res = await fetch(`${BASE_URL}/upazilas`);
      if (!res.ok) throw new Error('Failed to fetch upazilas');
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async getClusters() {
    try {
      const res = await fetch(`${BASE_URL}/clusters`);
      if (!res.ok) throw new Error('Failed to fetch clusters');
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async createHospital(hosp: Omit<Hospital, 'id'>, token: string): Promise<Hospital> {
    const res = await fetch(`${BASE_URL}/hospitals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hosp),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'হাসপাতাল যোগ করতে ব্যর্থ হয়েছে');
    return data.data;
  },

  async updateHospital(id: string, hosp: Partial<Hospital>, token: string): Promise<Hospital> {
    const res = await fetch(`${BASE_URL}/hospitals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hosp),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'হাসপাতালের তথ্য আপডেট করতে ব্যর্থ হয়েছে');
    return data.data;
  },

  async deleteHospital(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/hospitals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'হাসপাতাল মুছতে ব্যর্থ হয়েছে');
    }
    return true;
  },

  // ----------------- AMBULANCES -----------------
  async getAmbulances(): Promise<Ambulance[]> {
    try {
      const res = await fetch(`${BASE_URL}/ambulances`);
      if (!res.ok) throw new Error('Failed to fetch ambulances');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('API error (getAmbulances), using local fallback:', err);
      return DEFAULT_AMBULANCES;
    }
  },

  async createAmbulance(amb: Omit<Ambulance, 'id'>, token: string): Promise<Ambulance> {
    const res = await fetch(`${BASE_URL}/ambulances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(amb),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'অ্যাম্বুলেন্স যোগ করতে ব্যর্থ হয়েছে');
    return data.data;
  },

  async updateAmbulance(id: string, amb: Partial<Ambulance>, token: string): Promise<Ambulance> {
    const res = await fetch(`${BASE_URL}/ambulances/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(amb),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'অ্যাম্বুলেন্স আপডেট করতে ব্যর্থ হয়েছে');
    return data.data;
  },

  async deleteAmbulance(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/ambulances/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'অ্যাম্বুলেন্স মুছতে ব্যর্থ হয়েছে');
    }
    return true;
  },

  // ----------------- APPOINTMENTS -----------------
  async bookAppointment(payload: {
    patientName: string;
    patientPhone: string;
    doctorId: string;
    doctorName: string;
    hospitalName: string;
    preferredDate: string;
    problemSummary?: string;
  }): Promise<{ success: boolean; message: string; data?: Appointment }> {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await fetch(`${BASE_URL}/appointments`);
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async updateAppointmentStatus(id: string, status: 'অপেক্ষমাণ' | 'নিশ্চিত' | 'বাতিল', token: string) {
    const res = await fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // ----------------- EMERGENCIES -----------------
  async sendEmergencyRequest(payload: {
    callerName: string;
    callerPhone: string;
    location: string;
    serviceType?: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; data?: EmergencyRequest }> {
    const res = await fetch(`${BASE_URL}/emergencies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getEmergencies(): Promise<EmergencyRequest[]> {
    try {
      const res = await fetch(`${BASE_URL}/emergencies`);
      if (!res.ok) throw new Error('Failed to fetch emergencies');
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async updateEmergencyStatus(id: string, status: 'জরুরি' | 'সম্পন্ন' | 'বাতিল', token: string) {
    const res = await fetch(`${BASE_URL}/emergencies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // ----------------- IMAGE UPLOAD -----------------
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'ছবি আপলোড করতে ব্যর্থ হয়েছে');
    }
    return data.url;
  },

  // ----------------- STATS & ADMIN -----------------
  async getStats() {
    try {
      const res = await fetch(`${BASE_URL}/stats`);
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  },

  async adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return res.json();
  },

  async resetDatabase(token: string) {
    const res = await fetch(`${BASE_URL}/admin/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};
