"use client";

import Slider from "react-slick";

export default function Brands({ brands }) {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (brands.length === 0) {
    return <></>;
  }

  return (
    <div
      className="flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5 bg-cover bg-center"
      /* style={{
        backgroundImage: `linear-gradient(rgba(248, 248, 248, 0.9), rgba(248, 248, 248, 0.85)), url('/images/d.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} */
    >
      <Slider {...settings}>
        {(brands?.length <= 2
          ? [...brands, ...brands, ...brands]
          : brands
        )?.map((brand, index) => {
          return (
            <div className="px-2" key={`brand-${index}`}>
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="h-28 rounded-lg md:p-5 p-2 overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={brand?.imageURL}
                    alt={brand?.name || "Brand logo"}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}