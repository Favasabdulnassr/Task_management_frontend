import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, User, ArrowLeft } from 'lucide-react';
import LoginForm from './LoginForm';
import SignUpForm from './Signup';
import VerifyOTPForm from './Otp';
import { useCurrentView } from './CurrentViewProvider';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthApp = () => {
  
  const { currentView, setCurrentView } = useCurrentView()
  const { isAuthenticated } = useSelector((state) => state.login);
  const navigate = useNavigate();


  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/taskApp')
    } else {
      navigate('/')
    }
  }, [isAuthenticated])



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">TaskMaster</h2>
                  <p className="text-blue-100 text-lg">
                    Organize your life, one task at a time
                  </p>
                </div>
                <div className="space-y-4 text-left max-w-sm mx-auto">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Create and manage tasks effortlessly</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Schedule with calendar integration</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Track progress and stay motivated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
              {currentView === 'login' && <LoginForm />}
              {currentView === 'signup' && <SignUpForm />}
              {currentView === 'verify-otp' && <VerifyOTPForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthApp;