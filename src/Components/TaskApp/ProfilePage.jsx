import React, { useState } from 'react';
import { User, Mail, Save, Edit3,  Phone, } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileAsync } from '../../Redux/Actions/UpdateAction';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    
    // Get initial data from Redux store
    const { first_name, last_name, email, phone_number } = useSelector((state) => state.login);
    
    // Local state for form data
    const [formData, setFormData] = useState({
        firstName: first_name || '',
        lastName: last_name || '',
        email: email || '',
        phoneNumber: phone_number || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        
        try {
          const data = {
            first_name:formData.firstName,
            last_name:formData.lastName,
            phone_number:formData.phoneNumber,
          }
          dispatch(updateProfileAsync(data))
          .unwrap()
          .then(()=>{
            toast.success('Profile Updated Successfully')
          })
          .catch((error)=>{
            console.error('Error profile')
            toast.error('Error updating profile')
          })
          
        } catch (error) {
          console.error('Error:',error)
          
        }finally{
          setIsLoading(false)
          setIsEditing(false)
        }
            
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            firstName: first_name || '',
            lastName: last_name || '',
            email: email || '',
            phoneNumber: phone_number || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600">Manage your account settings</p>
                </div>
                
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                {isEditing ? `${formData.firstName} ${formData.lastName}` : `${first_name} ${last_name}`}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {isEditing ? formData.email : email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={isEditing ? formData.firstName : first_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter your first name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={isEditing ? formData.lastName : last_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={isEditing ? formData.email : email}
                                        onChange={handleInputChange}
                                        disabled={true}
                                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={isEditing ? formData.phoneNumber : phone_number}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;