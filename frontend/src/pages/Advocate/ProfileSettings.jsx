import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, Briefcase, MapPin, Award, Building2, User, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useAuthStatus, useAdvocateOnboarding } from '../../hooks/useAuthQuery.js';

const specializations = [
    'Civil Law', 'Criminal Law', 'Corporate Law', 'Family Law',
    'Intellectual Property', 'Tax Law', 'Labor Law', 'Constitutional Law',
    'Cyber Law', 'Environmental Law', 'International Law', 'Other'
];

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { data: authData, isLoading: authLoading } = useAuthStatus();
    const updateProfileMutation = useAdvocateOnboarding();

    const [profilePic, setProfilePic] = useState(null);
    const [barCertificate, setBarCertificate] = useState(null);

    const { register, handleSubmit, formState: { errors }, setError, reset, watch } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            lawFirm: '',
            barCouncilNumber: '',
            yearsOfPractice: '',
            specialization: '',
            location: '',
            bio: ''
        }
    });

    useEffect(() => {
        if (!authLoading && authData?.user) {
            const user = authData.user;
            reset({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                lawFirm: user.lawFirm || '',
                barCouncilNumber: user.barCouncilNumber || '',
                yearsOfPractice: user.yearsOfPractice || '',
                specialization: user.specialization || '',
                location: user.location || '',
                bio: user.bio || ''
            });
        }
    }, [authData, authLoading, reset]);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePic(file);
        }
    };

    const handleBarCertChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
            setBarCertificate(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('lawFirm', data.lawFirm);
            formData.append('barCouncilNumber', data.barCouncilNumber);
            formData.append('yearsOfPractice', data.yearsOfPractice);
            formData.append('specialization', data.specialization);
            formData.append('location', data.location);
            formData.append('bio', data.bio || '');

            if (profilePic) {
                formData.append('profilePicture', profilePic);
            }
            if (barCertificate) {
                formData.append('barCertificate', barCertificate);
            }

            await updateProfileMutation.mutateAsync(formData);
        } catch (error) {
            console.error('Profile update error:', error);
            setError('root', {
                message: error.message || 'Failed to update profile. Please try again.'
            });
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white">
            <div className="w-full max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-gray-300 hover:text-white"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                        <p className="text-gray-400">Update your professional profile</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Profile Picture */}
                            <div className="md:col-span-2 flex flex-col items-center">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {profilePic ? (
                                            <img
                                                src={URL.createObjectURL(profilePic)}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-16 h-16 text-gray-400" />
                                        )}
                                    </div>
                                    <label
                                        className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                                        title="Upload profile picture"
                                    >
                                        <Upload className="w-5 h-5" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleProfilePicChange}
                                        />
                                    </label>
                                </div>
                                <p className="mt-2 text-sm text-gray-400">Click to upload profile picture (optional)</p>
                            </div>

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="fullName"
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-white"
                                        disabled
                                        {...register('fullName')}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-white"
                                        disabled
                                        {...register('email')}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                                    Phone
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-white"
                                        disabled
                                        {...register('phone')}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lawFirm" className="block text-sm font-medium text-gray-300 mb-1">
                                    Law Firm <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="lawFirm"
                                        type="text"
                                        className={`block w-full pl-10 pr-3 py-3 border bg-white/5 text-white ${errors.lawFirm ? 'border-red-400' : 'border-white/10'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                        {...register('lawFirm', { required: 'Law firm is required' })}
                                    />
                                </div>
                                {errors.lawFirm && <p className="mt-1 text-sm text-red-600">{errors.lawFirm.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="barCouncilNumber" className="block text-sm font-medium text-gray-300 mb-1">
                                    Bar Council Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Award className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="barCouncilNumber"
                                        type="text"
                                        className={`block w-full pl-10 pr-3 py-3 border bg-white/5 text-white ${errors.barCouncilNumber ? 'border-red-400' : 'border-white/10'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                        {...register('barCouncilNumber', { required: 'Bar Council Number is required' })}
                                    />
                                </div>
                                {errors.barCouncilNumber && <p className="mt-1 text-sm text-red-600">{errors.barCouncilNumber.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="yearsOfPractice" className="block text-sm font-medium text-gray-300 mb-1">
                                    Years of Practice <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="yearsOfPractice"
                                        className={`block w-full pl-10 pr-3 py-3 border bg-white/5 text-white ${errors.yearsOfPractice ? 'border-red-400' : 'border-white/10'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                        {...register('yearsOfPractice', { required: 'Please select years of practice' })}
                                    >
                                        <option value="">Select years of practice</option>
                                        {Array.from({ length: 30 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} {i === 0 ? 'year' : 'years'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.yearsOfPractice && <p className="mt-1 text-sm text-red-600">{errors.yearsOfPractice.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-1">
                                    Specialization <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="specialization"
                                        className={`block w-full pl-10 pr-3 py-3 border bg-white/5 text-white ${errors.specialization ? 'border-red-400' : 'border-white/10'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                        {...register('specialization', { required: 'Please select your area of practice' })}
                                    >
                                        <option value="">Select area of practice</option>
                                        {specializations.map((spec) => (
                                            <option key={spec} value={spec}>
                                                {spec}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="location"
                                        type="text"
                                        className={`block w-full pl-10 pr-3 py-3 border bg-white/5 text-white ${errors.location ? 'border-red-400' : 'border-white/10'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                        {...register('location', { required: 'Location is required' })}
                                    />
                                </div>
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Bar Certificate (Optional)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-lg bg-white/5">
                                    <div className="space-y-1 text-center">
                                        <div className="flex text-sm text-gray-400 justify-center">
                                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-300 hover:text-indigo-200">
                                                <span>Upload a file</span>
                                                <input
                                                    id="barCertificate"
                                                    name="barCertificate"
                                                    type="file"
                                                    className="sr-only"
                                                    accept=".pdf,image/*"
                                                    onChange={handleBarCertChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-400">PDF, JPG, PNG up to 5MB</p>
                                        {barCertificate && (
                                            <p className="text-sm text-emerald-300">{barCertificate.name} selected</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                                    Professional Bio
                                </label>
                                <textarea
                                    id="bio"
                                    rows={4}
                                    className="block w-full px-3 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register('bio')}
                                />
                            </div>
                        </div>

                        {errors.root && (
                            <div className="text-sm text-red-400 text-center">
                                {errors.root.message}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={updateProfileMutation.isPending}
                                className="px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
