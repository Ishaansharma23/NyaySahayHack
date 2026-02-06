import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Upload, FileText, ArrowLeft, Mail, Phone } from 'lucide-react';
import { useAuthStatus, useClientOnboarding } from '../../hooks/useAuthQuery.js';

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Lakshadweep', 'Puducherry'
];

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { data: authData, isLoading: authLoading } = useAuthStatus();
    const updateProfileMutation = useClientOnboarding();

    const [profilePic, setProfilePic] = useState(null);
    const [idProof, setIdProof] = useState(null);
    const [selectedState, setSelectedState] = useState('');

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            state: '',
            description: ''
        }
    });

    useEffect(() => {
        if (!authLoading && authData?.user) {
            const user = authData.user;
            reset({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                state: user.state || '',
                description: user.description || ''
            });
            setSelectedState(user.state || '');
        }
    }, [authData, authLoading, reset]);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePic(file);
        }
    };

    const handleIdProofChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
            setIdProof(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            formData.append('state', selectedState);
            formData.append('description', data.description || '');
            formData.append('address', data.address || '');

            if (profilePic) {
                formData.append('profilePicture', profilePic);
            }
            if (idProof) {
                formData.append('idProof', idProof);
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
            <div className="w-full max-w-3xl mx-auto">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-gray-300 hover:text-white"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                        <p className="text-gray-400">Update your personal details</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="state"
                                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        required
                                    >
                                        <option value="">Select your state</option>
                                        {indianStates.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    ID Proof (Aadhar, Voter ID, etc.) - Optional
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-lg bg-white/5">
                                    <div className="space-y-1 text-center">
                                        <div className="flex text-sm text-gray-400 justify-center">
                                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-300 hover:text-indigo-200">
                                                <span>Upload a file</span>
                                                <input
                                                    id="idProof"
                                                    name="idProof"
                                                    type="file"
                                                    className="sr-only"
                                                    accept=".pdf,image/*"
                                                    onChange={handleIdProofChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-400">PDF, JPG, PNG up to 5MB</p>
                                        {idProof && (
                                            <p className="text-sm text-emerald-300">{idProof.name} selected</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    className="block w-full px-3 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register('address')}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                                    About You
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    className="block w-full px-3 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register('description')}
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
