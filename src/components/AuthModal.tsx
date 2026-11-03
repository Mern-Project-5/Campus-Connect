import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { sendOtp, verifyOtp, isSupabaseConfigured } from '../lib/supabase';
import {
  X,
  Phone,
  KeyRound,
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { registerUser, showToast } = useCampus();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Profile setup form
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    account_type: 'student' as 'student' | 'professional',
    department: 'Computer Science & Engineering',
    branch: 'Artificial Intelligence & Data Science',
    academic_year: '2nd Year',
    graduation_year: '2028',
    company_or_institution: 'CampusTech University',
    designation: 'Undergraduate Student',
    bio: 'Passionate student eager to collaborate on tech projects and hackathons.',
    skills: 'Python, TypeScript, React, DSA',
    interests: 'Machine Learning, Web3, Hackathons',
  });

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await sendOtp(phoneNumber);
        showToast('Real OTP dispatched via Supabase SMS.', 'info');
      } else {
        // Explicitly labeled demo mode
        showToast('Demo Auth: Simulation mode active. Enter any 6-digit code (e.g. 123456).', 'info');
      }
      setStep('otp');
    } catch (err: any) {
      showToast(err.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      showToast('Please enter the OTP code', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await verifyOtp(phoneNumber, otpCode);
      }
      showToast('Phone verified! Now setup your college profile.', 'success');
      setStep('profile');
    } catch (err: any) {
      showToast(err.message || 'OTP Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.username.trim()) {
      showToast('Name and username are required', 'error');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        phone: phoneNumber,
        full_name: formData.full_name,
        username: formData.username.toLowerCase().replace(/\s+/g, '_'),
        account_type: formData.account_type,
        department: formData.department,
        branch: formData.branch,
        academic_year: formData.account_type === 'student' ? formData.academic_year : undefined,
        graduation_year: formData.graduation_year,
        company_or_institution: formData.company_or_institution,
        designation: formData.designation,
        bio: formData.bio,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map((s) => s.trim()).filter(Boolean),
      });

      onClose();
    } catch (err: any) {
      showToast('Registration error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Demo Notice Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-700 dark:text-amber-400">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Demo Mode Notice:</span> This registration uses demo phone authentication. No actual SMS is dispatched. Upon completion, your account will enter the <span className="underline font-semibold">Pending Approval</span> queue for Super Admin review.
          </div>
        </div>

        {/* Step 1: Phone */}
        {step === 'phone' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Register for CampusConnect
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your mobile number to receive a verification OTP.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Continue to Demo OTP'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Enter Verification Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Demo code simulation for <span className="font-semibold text-slate-700 dark:text-slate-300">{phoneNumber}</span>.
              </p>
            </div>

            <div className="p-3 mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 text-center">
              💡 In Demo Mode: Type <strong className="text-indigo-500">123456</strong> or any 6 digits to proceed.
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
                <CheckCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1"
              >
                Change Phone Number
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Profile Setup */}
        {step === 'profile' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Complete Your Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your profile will be reviewed by the Super Admin before campus access.
              </p>
            </div>

            <form onSubmit={handleFinishRegistration} className="space-y-4">
              {/* Account Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, account_type: 'student' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      formData.account_type === 'student'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Enrolled Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, account_type: 'professional' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      formData.account_type === 'professional'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Alumni / Pro
                  </button>
                </div>
              </div>

              {/* Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="priya.sharma"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Department & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engg</option>
                    <option value="Artificial Intelligence & ML">AI & Machine Learning</option>
                    <option value="Electronics & Communication">Electronics & Comm</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                    placeholder="2027"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Python, React, Machine Learning, SQL"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell your college peers what you're passionate about..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Submit Profile for Admin Approval'}
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

