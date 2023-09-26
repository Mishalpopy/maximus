'use client'

import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'tailwindcss/tailwind.css';

import LoadingBar from './LoadingBar';

gsap.registerPlugin(ScrollTrigger);

const HeroSlider = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingAnimationDuration = 3000; // Duration of loading animation in milliseconds (3 seconds)
  const sliderRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
    const slider = sliderRef.current;
    let interval;
    let autoplayInterval;

    const autoPlayAndLoad = () => {
      interval = setInterval(() => {
        setLoadingProgress((prevProgress) => (prevProgress + 1) % 101); // Ensure progress stays between 0 and 100
      }, loadingAnimationDuration / 100);

      autoplayInterval = setInterval(() => {
        slider.slickNext();
        clearInterval(interval); // Reset loading progress
        clearInterval(autoplayInterval);
        setLoadingProgress(0);

        setTimeout(() => {
          autoPlayAndLoad(); // Start the loading again
        }, loadingAnimationDuration);

      }, loadingAnimationDuration);

      setTimeout(() => {
        clearInterval(interval);
        clearInterval(autoplayInterval);
      }, loadingAnimationDuration);
    };

    autoPlayAndLoad();

    return () => {
      clearInterval(interval);
      clearInterval(autoplayInterval);
    };
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: loadingAnimationDuration,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // Disable Slick's autoplay
    initialSlide: 0,
    beforeChange: (current, next) => {
      // When transitioning between slides (A to B), reset loading progress to 0 after a delay
      setTimeout(() => {
        setLoadingProgress(0);
      }, 500); // Delay before resetting to 0%
    },
  };

  function CustomLeftArrow(props) {
    const { onClick } = props;
    return (
      <div className="left-0 top-1/2 transform -translate-y-1/2 absolute text-white text-4xl" onClick={onClick}>
        <FiChevronLeft className="text-white text-4xl" />
      </div>
    );
  }

  function CustomRightArrow(props) {
    const { onClick } = props;
    return (
      <div className="right-0 top-1/2 transform -translate-y-1/2 absolute text-white text-4xl" onClick={onClick}>
        <FiChevronRight className="text-white text-4xl" />
      </div>
    );
  }

  return (
    <div className="hero-slider" style={{ width: '100vw', height: '85vh', overflow: 'hidden' }}>
      <div className="slider-wrapper" style={{ width: '100%' }}>
        <Slider {...settings} ref={sliderRef}>
          {/* Slide 1 with an image */}
          <div ref={(el) => (slideRefs.current[0] = el)} style={{ width: '100vw' }}>
            <div className="flex items-start slide-content">
              <img
                src="/banner-hero.jpg"
                alt="Slide 1 Image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="title-container left-title">
                <h2 className="slide-title">Slide 1</h2>
              </div>
            </div>
          </div>
          {/* Slide 2 with a video */}
          <div ref={(el) => (slideRefs.current[1] = el)} style={{ width: '100vw' }}>
            <div className="flex items-start slide-content">
              <video autoPlay loop muted className="slide-video">
                <source src="/video-hero.mp4" type="video/mp4" />
              </video>
              <div className="title-container left-title">
                <h2 className="slide-title">Slide 2</h2>
              </div>
            </div>
          </div>
        </Slider>
      </div>

      {/* Loading bar for the next slide */}
      <div className="absolute bottom-10 left-0 right-0 mx-auto" style={{ width: '40%', marginLeft: '30%' }}>
        <div className="relative">
          <LoadingBar progress={loadingProgress} width={`${(loadingProgress / 100) * 100}%`} duration={loadingAnimationDuration} />
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;

