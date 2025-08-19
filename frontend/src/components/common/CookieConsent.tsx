import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CogIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import { gdprService, CookieConsent as CookieConsentType } from '../../services/gdpr.service';

interface CookieConsentProps {
  onConsentChange?: (consent: CookieConsentType) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsentType>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: new Date(),
    version: '1.0'
  });

  useEffect(() => {
    // Check if consent is required
    if (gdprService.isCookieConsentRequired()) {
      setShowBanner(true);
    }

    // Load existing consent
    const existingConsent = gdprService.getCookieConsent();
    if (existingConsent) {
      setConsent(existingConsent);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent: CookieConsentType = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date(),
      version: '1.0'
    };

    gdprService.setCookieConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
    
    if (onConsentChange) {
      onConsentChange(newConsent);
    }
  };

  const handleRejectAll = () => {
    const newConsent: CookieConsentType = {
      necessary: true, // Always required
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date(),
      version: '1.0'
    };

    gdprService.setCookieConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
    
    if (onConsentChange) {
      onConsentChange(newConsent);
    }
  };

  const handleSavePreferences = () => {
    gdprService.setCookieConsent(consent);
    setShowBanner(false);
    setShowDetails(false);
    
    if (onConsentChange) {
      onConsentChange(consent);
    }
  };

  const handleToggleConsent = (type: keyof Omit<CookieConsentType, 'timestamp' | 'version'>) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    
    setConsent(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-[#404040] shadow-2xl"
      >
        <div className="max-w-7xl mx-auto p-6">
          {!showDetails ? (
            // Simple banner
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  🍪 We use cookies
                </h3>
                <p className="text-[#cccccc] text-sm leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                  You can manage your preferences or learn more in our{' '}
                  <a href="/privacy-policy" className="text-[#ff6b35] hover:underline">
                    Privacy Policy
                  </a>.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowDetails(true)}
                  className="flex items-center"
                >
                  <CogIcon className="h-4 w-4 mr-1" />
                  Customize
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleRejectAll}
                >
                  Reject All
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
              </div>
            </div>
          ) : (
            // Detailed preferences
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-[#cccccc] hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid gap-4">
                {/* Necessary Cookies */}
                <div className="bg-[#2d2d2d] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Necessary Cookies</h4>
                    <div className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Always Active
                    </div>
                  </div>
                  <p className="text-sm text-[#cccccc]">
                    These cookies are essential for the website to function properly. 
                    They enable basic features like page navigation and access to secure areas.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="bg-[#2d2d2d] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Functional Cookies</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.functional}
                        onChange={() => handleToggleConsent('functional')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b35]"></div>
                    </label>
                  </div>
                  <p className="text-sm text-[#cccccc]">
                    These cookies enable enhanced functionality and personalization, 
                    such as remembering your preferences and settings.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-[#2d2d2d] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Analytics Cookies</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.analytics}
                        onChange={() => handleToggleConsent('analytics')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b35]"></div>
                    </label>
                  </div>
                  <p className="text-sm text-[#cccccc]">
                    These cookies help us understand how visitors interact with our website 
                    by collecting and reporting information anonymously.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-[#2d2d2d] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Marketing Cookies</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.marketing}
                        onChange={() => handleToggleConsent('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#404040] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b35]"></div>
                    </label>
                  </div>
                  <p className="text-sm text-[#cccccc]">
                    These cookies are used to deliver personalized advertisements 
                    and measure the effectiveness of advertising campaigns.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#404040]">
                <Button
                  variant="secondary"
                  onClick={handleRejectAll}
                  className="flex-1"
                >
                  Reject All
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSavePreferences}
                  className="flex-1"
                >
                  Save Preferences
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAcceptAll}
                  className="flex-1"
                >
                  Accept All
                </Button>
              </div>

              <div className="text-xs text-[#888888] text-center">
                You can change these settings at any time by visiting our{' '}
                <a href="/privacy-policy" className="text-[#ff6b35] hover:underline">
                  Privacy Policy
                </a>{' '}
                page.
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;