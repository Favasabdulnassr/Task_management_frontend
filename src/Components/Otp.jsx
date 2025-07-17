import React, { useRef, useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, User, ArrowLeft } from 'lucide-react';
import { useCurrentView } from './CurrentViewProvider';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyOTPForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { currentView, setCurrentView } = useCurrentView();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResending, setIsResending] = useState(false);


  const inputRefs = useRef([]);
  const sessionId = localStorage.getItem('session_id');


    // Function to start timer
  const startTimer = (duration) => {
    setTimeLeft(duration);
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem('otpExpirationTime');
          console.error('OTP has expired. Please request a new one');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return timer;
  };


  useEffect(() => {
    const expirationTime = localStorage.getItem('otpExpirationTime');
    console.log('expirationTime', expirationTime)

    if (expirationTime) {
      
      const remainingTime = Math.floor((parseInt(expirationTime) - Date.now()) / 1000);
      

      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        const cleanup = startTimer(remainingTime);
        return () => clearInterval(remainingTime)
      } else {
        localStorage.removeItem('otpExpirationTime');
      }
    }
  }, []);


  const handleResendOtp = async () => {
    if (!sessionId) {
      toast.error("Session ID not found. Please register again.");
      return;
    }

    try {
      setIsResending(true);
      const response = await axios.post(`${BASE_URL}/user/resend-otp/`, {
        sessionId: sessionId
      });

      toast.success(response.data.message);

      setOtpDigits(['', '', '', '', '', '']);
      const expirationTime = Date.now() + 90 * 1000; // 90 seconds
      localStorage.setItem('otpExpirationTime', expirationTime.toString());
      startTimer(90)

    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.error || "Failed to resend OTP.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsResending(false);
    }
  };






  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Automatically move focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/user/verify-otp/`, {
        otp: otpCode,
        sessionId: sessionId
      });

      toast.success(response.data.message);
      localStorage.removeItem('otpExpirationTime');
      localStorage.removeItem('session_id');
      setCurrentView('login');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move focus backwards
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only process if it's a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpDigits = pastedData.split('');
      setOtpDigits(newOtpDigits);

      // Focus on the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your otp</h1>
        <p className="text-gray-600">
          verification code
          <br />
        </p>
      </div>
      <div>
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          {/* OTP Input */}
          <div>
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label> */}
            <div className="flex justify-center space-x-2" onPaste={handlePaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-8 h-10 sm:w-10 sm:h-12 text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg sm:text-xl"
                  pattern="\d*"
                  inputMode="numeric"
                  aria-label={`Digit ${index + 1} of OTP`}
                />
              ))}
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="text-center mt-2 sm:mt-4">
            {timeLeft > 0 ? (
              <p className="text-xs sm:text-sm text-gray-500">Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
            ) : (
              <p className="text-xs sm:text-sm text-red-500">OTP expired</p>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              'Verifying....'
            ) : (
              'Verify Code'
            )}
          </button>

          {/* Resend Code - Commented out as in original */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
            <button
              type="button"
              disabled={timeLeft > 0 || isResending}
              onClick={handleResendOtp}
              className={`text-blue-600 hover:text-blue-800 font-medium text-sm ${(timeLeft > 0 || isResending) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isResending ? 'Resending...' : 'Resend Code'}
            </button>
          </div>
        </form>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => setCurrentView(currentView === 'verify-otp' ? 'login' : 'signup')}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPForm;