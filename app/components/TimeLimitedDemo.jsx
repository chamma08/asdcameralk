"use client";

import { useState, useEffect } from 'react';

const TimeLimitedDemo = ({ children, demoStartDate, demoLengthDays = 14 }) => {
  const [demoStatus, setDemoStatus] = useState({
    isExpired: false,
    daysRemaining: 0,
    isLoading: true
  });

  useEffect(() => {
    const checkDemoStatus = () => {
      try {
        // Set your demo start date here (when you deployed for client testing)
        const startDate = new Date(demoStartDate || '2024-12-01'); // Change this date
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - startDate.getTime();
        const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
        const daysRemaining = Math.max(0, demoLengthDays - daysPassed);

        setDemoStatus({
          isExpired: daysPassed >= demoLengthDays,
          daysRemaining,
          isLoading: false
        });
      } catch (error) {
        console.error('Demo status check failed:', error);
        setDemoStatus({
          isExpired: false,
          daysRemaining: demoLengthDays,
          isLoading: false
        });
      }
    };

    checkDemoStatus();
    
    // Check every hour
    const interval = setInterval(checkDemoStatus, 3600000);
    
    return () => clearInterval(interval);
  }, [demoStartDate, demoLengthDays]);

  // Loading state
  if (demoStatus.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Demo expired state
  if (demoStatus.isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Demo Period Expired
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              The {demoLengthDays}-day testing period for this application has ended. 
              Thank you for evaluating our work!
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium">
                Ready to proceed with the full version?
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = 'mailto:matheeshacham08@gmail.com?subject=Demo%20Feedback%20and%20Next%20Steps'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Contact Us to Continue
              </button>
              
              <p className="text-sm text-gray-500">
                Or reach us at: <span className="font-medium">matheeshacham08@gmail.com</span>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                Demo started: {new Date(demoStartDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Demo warning (show when less than 3 days remaining)
  const showWarning = demoStatus.daysRemaining <= 3 && demoStatus.daysRemaining > 0;

  return (
    <div className="relative">
      {/* Demo Warning Banner */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium z-50 shadow-lg">
          ⚠️ Demo expires in {demoStatus.daysRemaining} day{demoStatus.daysRemaining !== 1 ? 's' : ''}
        </div>
      )}

      {/* Adjust top margin if warning is shown */}
      <div className={showWarning ? 'mt-10' : ''}>
        {children}
      </div>
    </div>
  );
};

export default TimeLimitedDemo;