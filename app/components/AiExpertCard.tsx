"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

// AiExpertCard 컴포넌트에서 hasMounted prop 제거
const AiExpertCard = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotLottieRef = useRef<DotLottie | null>(null);

  // Lottie 원본 비율 (예시: 1000x250 이었다면 1000/250 = 4)
  // << 중요: 실제 사용하는 Lottie 파일의 가로/세로 비율로 설정해야 합니다! >>
  const LOTTIE_ASPECT_RATIO = 500 / 300; // 이 값을 실제 Lottie 비율로 수정하세요.

  const adjustLottieLayout = () => {
    if (!cardRef.current || !canvasRef.current) return;

    const cardWidth = cardRef.current.offsetWidth;
    let canvasDesiredWidth = cardWidth * 2;
    let canvasDesiredHeight = canvasDesiredWidth / LOTTIE_ASPECT_RATIO;

    // 너비와 높이가 0보다 큰 정수인지 확인하고 보정
    canvasDesiredWidth = Math.max(1, Math.floor(canvasDesiredWidth));
    canvasDesiredHeight = Math.max(1, Math.floor(canvasDesiredHeight));

    canvasRef.current.width = canvasDesiredWidth;
    canvasRef.current.height = canvasDesiredHeight;
    
    canvasRef.current.style.width = `${canvasDesiredWidth}px`;
    canvasRef.current.style.height = `${canvasDesiredHeight}px`;
    // canvasRef.current.style.transform = `translateX(0px)`; // 현재 특별한 기능이 없어 보이므로, 필요성 재검토

    // Lottie 인스턴스가 resize 메소드를 제공한다면 호출
    if (dotLottieRef.current && typeof dotLottieRef.current.resize === 'function') {
      dotLottieRef.current.resize();
    }
  };

  useEffect(() => {
    if (canvasRef.current && cardRef.current && !dotLottieRef.current) {
      const dotLottieInstance = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        src: "https://lottie.host/cc87f464-9dee-4a09-82eb-8a84f1098f78/mXXmPPp4X3.json",
        // fit, alignment 등의 옵션이 있다면 여기에 추가
      });
      dotLottieRef.current = dotLottieInstance;
    }

    adjustLottieLayout();
    window.addEventListener('resize', adjustLottieLayout);

    return () => {
      window.removeEventListener('resize', adjustLottieLayout);
      if (dotLottieRef.current && typeof dotLottieRef.current.destroy === 'function') {
        dotLottieRef.current.destroy();
      }
      dotLottieRef.current = null;
    };
  }, []); // 의존성 배열에서 LOTTIE_ASPECT_RATIO 제거

  return (
    <div 
      ref={cardRef} 
      className="bg-white dark:bg-gray-800 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] p-3 relative flex flex-col justify-end min-h-[120px] overflow-hidden"
    >
      {/* Lottie 캔버스를 담을 래퍼, 캔버스가 absolute로 이 안에서 위치함 */}
      <div className="absolute inset-0 flex justify-center items-center z-0">
        <canvas
          ref={canvasRef}
          style={{ 
            position: 'absolute', // 이 스타일은 유지
            // width, height, transform은 JS에서 동적으로 설정
          }}
        ></canvas>
      </div>
      {/* 텍스트 영역 */}
      <div className="relative z-10 text-center pb-2">
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-gray-200 drop-shadow-md whitespace-nowrap">
          함께 성장하는 개발자
        </span>
      </div>
    </div>
  );
};

export default AiExpertCard; 