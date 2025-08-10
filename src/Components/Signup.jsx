import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, User, ArrowLeft } from 'lucide-react';
import { useCurrentView } from './CurrentViewProvider';
import { useFormik } from 'formik'
import { RegisterValidationSchema } from '../services/validation/Register';
import { BASE_URL } from '../services/constant';
import { toast } from 'react-toastify';
import axios from 'axios'


const SignUpForm = () => {
    const [authMethod, setAuthMethod] = useState('non-otp'); // 'password', 'otp'
    const [showPassword, setShowPassword] = useState(false);
    const { currentView, setCurrentView } = useCurrentView()
    const [isLoading, setIsLoading] = useState(false);
   
    const formik = useFormik({
        initialValues: {
            first_name: '',
            email: '',
            password: '',
            confirm_password: '',
            otp_register: ''
        },
        validationSchema: RegisterValidationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                let payload;
                if (authMethod === 'non-otp') {
                    payload = {
                        first_name: values.first_name,
                        email: values.email,
                        password: values.password,
                        confirm_password: values.confirm_password,
                        otp_register: false

                    }
                } else {
                    payload = {
                        email: values.email,
                        password: values.password,
                        confirm_password: values.confirm_password,
                        otp_register: true

                    }

                }
                const response = await axios.post(BASE_URL + '/user/register/', payload);

                if (authMethod === 'non-otp') {
                    toast.success('Account Created successfully')
                    setCurrentView('login')


                } else {
                    formik.resetForm()
                    const expirationTime = Date.now() + 90 * 1000;
                    localStorage.setItem('otpExpirationTime', expirationTime.toString());
                    localStorage.setItem('session_id', response.data.session_id)
                    toast.success('Enter Six digit otp')
                    setCurrentView('verify-otp')

                }
            } catch (error) {
                toast.error('Registration failed');

            } finally {
                setIsLoading(false)
            }

        }
    })





    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Sign up for a new account</p>
            </div>

            {/* Auth Method Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                    onClick={() => setAuthMethod('non-otp')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${authMethod === 'non-otp'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Sign up
                </button>
                <button
                    onClick={() => setAuthMethod('otp')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${authMethod === 'otp'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    OTP Sign up
                </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Name Field */}
                {authMethod === 'non-otp' && (

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="first_name"
                                {...formik.getFieldProps('first_name')}
                                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        {formik.touched.first_name && formik.errors.first_name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.first_name}</div>
                        )}
                    </div>
                )}


                {/* Email Field */}
                <div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...formik.getFieldProps('email')}
                                type="email"
                                placeholder="Enter your email"
                                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        )}
                    </div>
                </div>

                {/* Password Fields (only for password auth) */}
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...formik.getFieldProps('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                className="w-full pl-9 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...formik.getFieldProps('confirm_password')}
                                type="password"
                                placeholder="Confirm your password"
                                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        {formik.touched.confirm_password && formik.errors.confirm_password && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.confirm_password}</div>
                        )}
                    </div>
                </>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            {authMethod === 'non-otp' ? 'Creating Account...' : 'Sending otp...'}
                        </div>
                    ) : (
                        authMethod === 'non-otp' ? 'create Account' : 'Send otp'
                    )}
                </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => setCurrentView('login')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    )
};

export default SignUpForm