/**
 * Create Case Form Component
 * Form for clients to create a new legal case
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
    FileText, 
    AlertCircle, 
    ArrowLeft,
    Upload,
    X,
    Camera,
    Video,
    File
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { useCreateCase } from '../../hooks/useCaseQuery';

const CreateCaseForm = () => {
    const navigate = useNavigate();
    const createCaseMutation = useCreateCase();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            urgency: 'medium'
        }
    });

    const caseTypes = [
        { value: 'civil', label: 'Civil Law' },
        { value: 'criminal', label: 'Criminal Law' },
        { value: 'family', label: 'Family Law' },
        { value: 'property', label: 'Property Law' },
        { value: 'consumer', label: 'Consumer Protection' },
        { value: 'labour', label: 'Labour Law' },
        { value: 'corporate', label: 'Corporate Law' },
        { value: 'constitutional', label: 'Constitutional Law' },
        { value: 'cyber', label: 'Cyber Law' },
        { value: 'other', label: 'Other' }
    ];

    const urgencyLevels = [
        { value: 'low', label: 'Low - No immediate urgency' },
        { value: 'medium', label: 'Medium - Normal priority' },
        { value: 'high', label: 'High - Urgent matter' },
        { value: 'critical', label: 'Critical - Immediate attention needed' }
    ];

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/') ||
                file.type.startsWith('video/') ||
                file.type === 'application/pdf';
            const isValidSize = file.size <= 10 * 1024 * 1024;
            return isValidType && isValidSize;
        });
        setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return <Camera className="h-4 w-4" />;
        if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
        return <File className="h-4 w-4" />;
    };

    const onSubmit = async (data) => {
        try {
            const result = await createCaseMutation.mutateAsync({
                title: data.title,
                description: data.description,
                caseType: data.caseType,
                urgency: data.urgency
            });
            
            navigate('/client/cases');
        } catch (error) {
            console.error('Failed to create case:', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <FileText className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle>Create New Legal Case</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Describe your legal matter to get connected with an advocate
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-5">
                        {/* Case Title */}
                        <Input
                            label="Case Title"
                            placeholder="Brief title for your case"
                            required
                            error={errors.title?.message}
                            {...register('title', {
                                required: 'Title is required',
                                minLength: { value: 5, message: 'Title must be at least 5 characters' },
                                maxLength: { value: 200, message: 'Title must not exceed 200 characters' }
                            })}
                        />

                        {/* Case Type */}
                        <Select
                            label="Case Type"
                            options={caseTypes}
                            required
                            error={errors.caseType?.message}
                            {...register('caseType', { required: 'Please select a case type' })}
                        />

                        {/* Urgency */}
                        <Select
                            label="Urgency Level"
                            options={urgencyLevels}
                            error={errors.urgency?.message}
                            {...register('urgency')}
                        />

                        {/* Description */}
                        <Textarea
                            label="Case Description"
                            placeholder="Describe your legal matter in detail. Include relevant facts, dates, and any previous actions taken..."
                            rows={6}
                            required
                            error={errors.description?.message}
                            {...register('description', {
                                required: 'Description is required',
                                minLength: { value: 50, message: 'Please provide at least 50 characters' },
                                maxLength: { value: 5000, message: 'Description must not exceed 5000 characters' }
                            })}
                        />

                        {/* File Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Supporting Documents (Optional)
                            </label>
                            
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*,.pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label 
                                    htmlFor="file-upload"
                                    className="cursor-pointer"
                                >
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">
                                        <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Images, videos, or PDFs up to 10MB (max 5 files)
                                    </p>
                                </label>
                            </div>

                            {/* Selected Files */}
                            {selectedFiles.length > 0 && (
                                <div className="space-y-2 mt-3">
                                    {selectedFiles.map((file, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded">
                                                    {getFileIcon(file)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <X className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">What happens next?</p>
                                <ul className="mt-1 space-y-1 text-blue-700">
                                    <li>• Your case will be reviewed by our AI for initial assessment</li>
                                    <li>• Matching advocates will be notified</li>
                                    <li>• An advocate can accept your case and contact you</li>
                                    <li>• You can also browse and connect with advocates directly</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={createCaseMutation.isPending}
                        >
                            Create Case
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CreateCaseForm;
