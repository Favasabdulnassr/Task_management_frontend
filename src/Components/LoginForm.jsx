import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, User, ArrowLeft } from 'lucide-react';
import { useCurrentView } from './CurrentViewProvider';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik'
import { LoginValidationSchema } from '../services/validation/Login';
import { loginAsync } from '../Redux/Actions/LoginAction';
import { toast } from 'react-toastify';



const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { currentView, setCurrentView } = useCurrentView();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginValidationSchema,
        onSubmit: (values) => {
             console.log("Form values: ", values);
            setIsLoading(true)
            dispatch(loginAsync(values))
                .unwrap()
                .then(() => {
                    toast.success('Login Successfull')
                })
                .catch((error) => {
                    toast.error('Login failed check email and password')
                })
                .finally(()=>{
                    setIsLoading(false)

                });
        }
    })

 





    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account</p>
            </div>


            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username (Email) 
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className={`w-full pl-10 pr-4 py-3 border ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
                            {...formik.getFieldProps("email")}
                        />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            className={`w-full pl-10 pr-12 py-3 border ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
                            {...formik.getFieldProps("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                    )}
                </div>

                {/* Forgot Password Link */}
                {/* <div className="text-right text-xs text-blue-500 hover:text-blue-600">
                    <Link to="/forgotPassword">Forgot Password?</Link>
                </div> */}

                {/* Submit Button */}
                <button
                   type='submit'
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    {isLoading? "Signing in..." : "Sign In"}
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                        onClick={() => setCurrentView('signup')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    )
};

export default LoginForm
