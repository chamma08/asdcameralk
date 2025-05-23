"use client"

import { useActivePopUpMessage, usePopupSettings } from "@/lib/firestore/pop-up message/read";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { X, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function PopupMessage() {
  const { data: activeMessage, isLoading: messageLoading } = useActivePopUpMessage();
  const { data: settings, isLoading: settingsLoading } = usePopupSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (
      settings?.showPopup && 
      activeMessage && 
      !hasBeenShown && 
      !messageLoading && 
      !settingsLoading
    ) {
      // Add a slight delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasBeenShown(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [settings, activeMessage, hasBeenShown, messageLoading, settingsLoading]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setImageLoaded(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Don't render if conditions not met
  if (messageLoading || settingsLoading || !settings?.showPopup || !activeMessage) {
    return null;
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="5xl"
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/50",
        base: "border-none shadow-2xl max-h-[95vh]",
        wrapper: "p-2"
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.3,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent className="bg-white border border-gray-200 backdrop-blur-xl shadow-2xl max-h-[95vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-2 relative overflow-hidden bg-red-50 flex-shrink-0">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-red-100/30 animate-pulse" />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-200/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-rose-200/20 rounded-full blur-xl" />
              
              <div className="flex justify-between items-center w-full relative z-10">
                <div className="flex items-center gap-3">
                  {/* Logo instead of icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg overflow-hidden">
                    <img 
                      src="/logo1.png" 
                      alt="Logo" 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // Fallback to text logo if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center w-full h-full bg-red-600 text-white font-bold text-xs rounded-full">
                      LOGO
                    </div>
                  </div>
                  <span className="text-xl font-bold text-gray-800">
                    {activeMessage.name}
                  </span>
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={onClose}
                  className="hover:bg-red-100 hover:text-red-600 transition-all duration-200 rounded-full"
                >
                  <X size={18} />
                </Button>
              </div>
            </ModalHeader>

            <ModalBody className="px-3 py-3 flex-1 overflow-hidden">
              <div className="relative group h-full flex flex-col">
                {/* Loading shimmer effect */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-2xl" />
                )}
                
                {/* Main image container - takes up most space */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/50 bg-white/50 backdrop-blur-sm flex-1 min-h-0">
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-bounce delay-100 z-10" />
                  <div className="absolute -top-1 -right-3 w-6 h-6 bg-pink-500 rounded-full opacity-70 animate-bounce delay-300 z-10" />
                  <div className="absolute -bottom-2 -right-1 w-7 h-7 bg-blue-500 rounded-full opacity-75 animate-bounce delay-200 z-10" />
                  
                  <img 
                    src={activeMessage.imageURL} 
                    alt={activeMessage.name}
                    onLoad={handleImageLoad}
                    className={`
                      w-full h-full object-contain transition-all duration-700 ease-out
                      ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                      group-hover:scale-[1.02] rounded-2xl
                    `}
                    style={{ maxHeight: 'calc(95vh - 200px)' }}
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-black/5 pointer-events-none rounded-2xl" />
                </div>

                {/* Optional message text if available */}
                {activeMessage.description && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200 flex-shrink-0">
                    <p className="text-gray-700 text-center font-medium text-sm">
                      {activeMessage.description}
                    </p>
                  </div>
                )}

                {/* Floating particles effect */}
                <div className="absolute -top-4 -left-4 w-2 h-2 bg-red-400 rounded-full animate-ping delay-1000" />
                <div className="absolute -top-6 left-1/3 w-1 h-1 bg-rose-400 rounded-full animate-ping delay-1500" />
                <div className="absolute -bottom-3 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-2000" />
              </div>
            </ModalBody>

            <ModalFooter className="pt-2 pb-4 flex-shrink-0">
              <div className="flex justify-center w-full">
                <Button 
                  onPress={onClose}
                  className="
                    bg-red-600 text-white font-semibold
                    hover:bg-red-700 
                    shadow-lg hover:shadow-xl
                    transition-all duration-300 ease-out
                    transform hover:scale-105 active:scale-95
                    px-8 py-2 rounded-full
                    border border-red-700
                  "
                  size="lg"
                >
                  <span className="flex items-center gap-2">
                    Got it!
                    <Sparkles size={16} className="animate-pulse" />
                  </span>
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// Enhanced SimplePopupMessage with larger image and logo
export function SimplePopupMessage() {
  const { data: activeMessage, isLoading: messageLoading } = useActivePopUpMessage();
  const { data: settings, isLoading: settingsLoading } = usePopupSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (
      settings?.showPopup && 
      activeMessage && 
      !hasBeenShown && 
      !messageLoading && 
      !settingsLoading
    ) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [settings, activeMessage, hasBeenShown, messageLoading, settingsLoading]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setImageLoaded(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  if (!isVisible || messageLoading || settingsLoading || !settings?.showPopup || !activeMessage) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div 
        className={`
          bg-white 
          rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] mx-2 relative 
          border border-gray-200 backdrop-blur-xl flex flex-col
          transform transition-all duration-500 ease-out
          ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
          hover:shadow-3xl
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-red-50/50 rounded-3xl animate-pulse" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-200/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl" />

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200/50 relative z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo instead of icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg overflow-hidden">
              <img 
                src="/logo1.png" 
                alt="Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center w-full h-full bg-red-600 text-white font-bold text-sm rounded-full">
                LOGO
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {activeMessage.name}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="
              text-gray-500 hover:text-red-500 text-2xl font-bold
              w-10 h-10 rounded-full hover:bg-red-50 
              transition-all duration-200 flex items-center justify-center
              hover:rotate-90 transform
            "
          >
            ×
          </button>
        </div>

        {/* Body - Main image area */}
        <div className="p-3 relative z-10 flex-1 min-h-0 flex flex-col">
          <div className="relative group flex-1 min-h-0">
            {/* Loading shimmer */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-2xl" />
            )}
            
            {/* Decorative floating elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full opacity-80 animate-bounce z-10" />
            <div className="absolute -top-2 -right-4 w-4 h-4 bg-pink-500 rounded-full opacity-70 animate-bounce delay-300 z-10" />
            <div className="absolute -bottom-3 -right-2 w-5 h-5 bg-blue-500 rounded-full opacity-75 animate-bounce delay-150 z-10" />
            
            <div className="overflow-hidden rounded-2xl shadow-2xl border border-white/50 bg-white/30 backdrop-blur-sm h-full">
              <img 
                src={activeMessage.imageURL} 
                alt={activeMessage.name}
                onLoad={handleImageLoad}
                className={`
                  w-full h-full object-contain transition-all duration-700 ease-out
                  ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                  group-hover:scale-105 rounded-2xl
                `}
                style={{ maxHeight: 'calc(95vh - 180px)' }}
              />
              <div className="absolute inset-0 bg-black/5 pointer-events-none rounded-2xl" />
            </div>
          </div>

          {activeMessage.description && (
            <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200 flex-shrink-0">
              <p className="text-gray-700 text-center font-medium text-sm">
                {activeMessage.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 flex justify-center relative z-10 flex-shrink-0">
          <button
            onClick={handleClose}
            className="
              px-8 py-3 bg-red-600 text-white font-semibold rounded-2xl
              hover:bg-red-700 shadow-lg hover:shadow-xl
              transition-all duration-300 ease-out transform hover:scale-105 active:scale-95
              border border-red-700 flex items-center gap-2
            "
          >
            <span>Got it!</span>
            <Sparkles size={16} className="animate-pulse" />
          </button>
        </div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-red-400 rounded-full animate-ping delay-1000" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-rose-400 rounded-full animate-ping delay-1500" />
        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-2000" />
      </div>
    </div>
  );
}