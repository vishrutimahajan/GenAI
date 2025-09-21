import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const languages = {
  en: {
    home: 'Home',
    aiChatBot: 'AI Chat Bot',
    mediaGallery: 'Media Gallery',
    documentHelper: 'Document Helper',
    documentVerification: 'Document Verification',
    documentRequirement: 'Document Requirement',
    'Legal Summaries': 'Legal Summaries',
    services: 'Services',
    aboutUs: 'About Us',
    welcomeMessage: 'Welcome to AI Document Assistant',
    getStarted: 'Get Started',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    uploadDocument: 'Upload Document',
    analyzeDocument: 'Analyze Document',
  },
  hi: {
    home: 'होम',
    aiChatBot: 'AI चैट बॉट',
    mediaGallery: 'मीडिया गैलरी',
    documentHelper: 'दस्तावेज़ सहायक',
    documentVerification: 'दस्तावेज़ सत्यापन',
    documentRequirement: 'दस्तावेज़ आवश्यकता',
    'Legal Summaries': 'कानूनी सारांश',
    services: 'सेवाएं',
    aboutUs: 'हमारे बारे में',
    welcomeMessage: 'AI दस्तावेज़ सहायक में आपका स्वागत है',
    getStarted: 'शुरू करें',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    uploadDocument: 'दस्तावेज़ अपलोड करें',
    analyzeDocument: 'दस्तावेज़ का विश्लेषण करें',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    aiChatBot: 'AI चॅट बॉट',
    mediaGallery: 'मीडिया गॅलरी',
    documentHelper: 'दस्तावेज मदतनीस',
    documentVerification: 'दस्तावेज सत्यापन',
    documentRequirement: 'दस्तावेज आवश्यकता',
    'Legal Summaries': 'कायदेशीर सारांश',
    services: 'सेवा',
    aboutUs: 'आमच्याबद्दल',
    welcomeMessage: 'AI दस्तावेज मदतनीसमध्ये आपले स्वागत आहे',
    getStarted: 'सुरुवात करा',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    uploadDocument: 'दस्तावेज अपलोड करा',
    analyzeDocument: 'दस्तावेज विश्लेषण करा',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return languages[currentLanguage as keyof typeof languages]?.[key as keyof typeof languages.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};