import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  MapPin,
  FileText,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MapPicker } from '../../components/MapPicker';
import { PhotoUploader } from '../../components/PhotoUploader';
import { StatusTracker } from '../../components/StatusTracker';
import { GCPActivityType, Project } from '../../types';

const ACTIVITY_TYPES: GCPActivityType[] = [
  'Tree Plantation',
  'Water Management',
  'Sustainable Agriculture',
  'Waste Management',
  'Air Pollution Reduction',
  'Mangrove Conservation',
  'Ecomark Labeling',
  'Green Buildings'
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Gujarat',
  'Himachal Pradesh',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttarakhand',
  'Uttar Pradesh',
  'West Bengal'
];

// Zod Schema covering all validation rules
const projectFormSchema = z.object({
  title: z.string().min(5, 'Project name must be at least 5 characters long'),
  activityType: z.string().min(1, 'Please select an activity type'),
  state: z.string().min(1, 'Please select the state'),
  district: z.string().min(2, 'District is required'),
  areaHa: z
    .number()
    .positive('Area must be greater than 0 hectares')
    .max(10000, 'Area cannot exceed 10,000 hectares'),
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  lat: z.number().refine((val) => val !== 0 && val >= 6 && val <= 37, {
    message: 'Please drop a pin within India coordinates (Lat 6°N - 37°N)'
  }),
  lng: z.number().refine((val) => val !== 0 && val >= 68 && val <= 98, {
    message: 'Please drop a pin within India coordinates (Lng 68°E - 98°E)'
  }),
  images: z.array(z.string()).min(1, 'At least 1 photographic evidence proof is required')
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addProject } = useData();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProject, setSubmittedProject] = useState<Project | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      activityType: 'Tree Plantation',
      state: 'Uttarakhand',
      district: 'Almora',
      areaHa: 10,
      description: '',
      lat: 29.5971,
      lng: 79.6591,
      images: ['/src/assets/images/hero_indian_forest_1793156598252.jpg']
    }
  });

  const formValues = watch();

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['title', 'activityType', 'state', 'district', 'areaHa', 'description']);
    } else if (currentStep === 2) {
      isValid = await trigger(['lat', 'lng']);
    }

    if (isValid) {
      setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 2 | 3) : prev));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2) : prev));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const created = await addProject({
        title: data.title,
        activityType: data.activityType as GCPActivityType,
        state: data.state,
        district: data.district,
        areaHa: data.areaHa,
        description: data.description,
        lat: data.lat,
        lng: data.lng,
        images: data.images,
        applicantId: currentUser?.id || 'usr_citizen_01',
        applicantName: currentUser?.name || 'Aarav Sharma',
        pricePerCreditINR: 480
      });
      setSubmittedProject(created);
    } catch (err) {
      console.error('Failed to submit project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If submitted successfully, show confirmation screen with StatusTracker
  if (submittedProject) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Registration Submitted Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Your environmental initiative <strong>&quot;{submittedProject.title}&quot;</strong> has been assigned registry ID{' '}
            <span className="font-mono text-emerald-700 font-semibold">{submittedProject.id}</span> and queued for MoEFCC empaneled auditor review.
          </p>

          <div className="my-6 text-left">
            <StatusTracker
              status={submittedProject.status}
              submittedDate={submittedProject.submittedDate}
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-semibold text-slate-800">{submittedProject.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Activity Sector:</span>
              <span className="font-semibold text-slate-800">{submittedProject.activityType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Plot Area:</span>
              <span className="font-semibold text-slate-800">{submittedProject.areaHa} Hectares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Geotag Coordinates:</span>
              <span className="font-mono text-slate-800">{submittedProject.lat}, {submittedProject.lng}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/verifier/queue')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>View in Verifier Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India Green Credit Programme Registration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Register New Environmental Action
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete the 3-step application to enroll your land, forest, or water conservation plot.
        </p>
      </div>

      {/* Stepper progress */}
      <div className="bg-white rounded-xl p-4 border border-[#E5EAE7] shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`p-2 rounded-lg border text-center transition-all ${
              currentStep === 1
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                : currentStep > 1
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            <div className="text-xs">Step 1: Details</div>
            <div className="text-[10px] text-slate-500 hidden sm:block">Scope & Activity</div>
          </div>

          <div
            className={`p-2 rounded-lg border text-center transition-all ${
              currentStep === 2
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                : currentStep > 2
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            <div className="text-xs">Step 2: Location</div>
            <div className="text-[10px] text-slate-500 hidden sm:block">Map Pin & Lat/Lng</div>
          </div>

          <div
            className={`p-2 rounded-lg border text-center transition-all ${
              currentStep === 3
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            <div className="text-xs">Step 3: Proof</div>
            <div className="text-[10px] text-slate-500 hidden sm:block">Photo Evidence</div>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 border border-[#E5EAE7] shadow-sm space-y-6">
        {/* STEP 1: DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">Project Overview & Classification</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Title / Name *
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Almora Native Banjh Oak Regeneration"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.title && (
                <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Activity Type (GCP Sector) *
                </label>
                <select
                  {...register('activityType')}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {ACTIVITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.activityType && (
                  <p className="text-xs text-rose-600 mt-1">{errors.activityType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Land Area (Hectares) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('areaHa', { valueAsNumber: true })}
                  placeholder="e.g. 15.5"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
                {errors.areaHa && (
                  <p className="text-xs text-rose-600 mt-1">{errors.areaHa.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                <select
                  {...register('state')}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-rose-600 mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                <input
                  type="text"
                  {...register('district')}
                  placeholder="e.g. Almora"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.district && (
                  <p className="text-xs text-rose-600 mt-1">{errors.district.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Description & Ecological Objective *
              </label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Explain the environmental methodology, sapling species planted or water harvesting structures, baseline status, and community involvement..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900">Geotag Plot Coordinates</h2>
              </div>
              <span className="text-xs text-slate-400">Click map or drag the pin</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Click anywhere on the map to drop the marker pin on your conservation plot, or drag the pin to pinpoint the exact perimeter.
              </span>
            </div>

            <Controller
              control={control}
              name="lat"
              render={({ field: latField }) => (
                <Controller
                  control={control}
                  name="lng"
                  render={({ field: lngField }) => (
                    <MapPicker
                      lat={latField.value}
                      lng={lngField.value}
                      onChange={({ lat, lng }) => {
                        setValue('lat', lat, { shouldValidate: true });
                        setValue('lng', lng, { shouldValidate: true });
                      }}
                      height="360px"
                    />
                  )}
                />
              )}
            />

            {(errors.lat || errors.lng) && (
              <p className="text-xs text-rose-600">
                {errors.lat?.message || errors.lng?.message}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  {...register('lat', { valueAsNumber: true })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  {...register('lng', { valueAsNumber: true })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROOF */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <UploadCloud className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">Upload Verification Proof</h2>
            </div>

            <p className="text-xs text-slate-500">
              Please provide clear geotagged photos of your plantation site, bunding work, or conservation ground truth. Verifiers use these alongside high-resolution satellite passes.
            </p>

            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <PhotoUploader
                  images={field.value}
                  onChange={(urls) => field.onChange(urls)}
                  maxFiles={5}
                  error={errors.images?.message}
                />
              )}
            />

            {/* Quick summary before submit */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-800">Application Summary Check</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400">Project:</span> {formValues.title || 'Untitled'}
                </div>
                <div>
                  <span className="text-slate-400">Sector:</span> {formValues.activityType}
                </div>
                <div>
                  <span className="text-slate-400">Area:</span> {formValues.areaHa} Hectares
                </div>
                <div>
                  <span className="text-slate-400">Location:</span> {formValues.district}, {formValues.state}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit for MoEFCC Verification</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
