"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLogos } from "@/lib/firestore/client-logos/read";

export default function ClientLogoSlider() {
  const { data: logos, isLoading, error } = useLogos();
  const [slidesToShow, setSlidesToShow] = useState(5);

  // Adjust slides to show based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(3);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(4);
      } else {
        setSlidesToShow(5);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slick settings for infinite sliding
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    pauseOnFocus: false,
    pauseOnDotsHover: false,
    arrows: false,
    rtl: false,
    draggable: false,
    swipe: false,
    touchMove: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          draggable: false,
          swipe: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          draggable: false,
          swipe: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          draggable: false,
          swipe: false,
        }
      }
    ]
  };

  // Handle loading and error states with better UI
  if (isLoading) {
    return (
      <div className="py-8 text-center flex justify-center items-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500 rounded-lg bg-red-50 p-4 mx-auto max-w-md">
        <p className="font-semibold">Unable to load client logos</p>
        <p className="text-sm mt-2">Please refresh the page or try again later</p>
      </div>
    );
  }

  if (!logos || logos.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No client logos available at this time
      </div>
    );
  }

  // Duplicate logos array if fewer than 10 to ensure smooth infinite scrolling
  const displayLogos = logos.length < 10 ? [...logos, ...logos] : logos;

  return (
    <div className="w-full bg-white py-8 md:py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-center mb-8">Our Clients</h2>
        
        <div className="relative">
          <Slider {...settings} className="client-logo-slider">
            {displayLogos.map((logo, index) => (
              <div key={`${logo.id}-${index}`} className="px-2 focus:outline-none">
                <div className="h-28 flex items-center justify-center">
                  <div className="rounded-lg overflow-hidden bg-white border border-gray-200 p-2 shadow-sm h-24 w-24 flex items-center justify-center">
                    <img
                      src={logo.imageURL}
                      alt={logo.name || "Client logo"}
                      className="h-auto w-auto max-h-20 max-w-full mx-auto object-contain object-center transition-opacity hover:opacity-80"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder-logo.png"; // Fallback image
                        e.target.alt = "Logo unavailable";
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      
      <style jsx>{`
        :global(.client-logo-slider) {
          pointer-events: none;
        }
        :global(.client-logo-slider .slick-track) {
          animation-play-state: running !important;
        }
        :global(.client-logo-slider .slick-slide) {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}