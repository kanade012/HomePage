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
    
    // 카드 너비가 유효하지 않으면 기본값 사용
    if (!cardWidth || cardWidth <= 0) return;
    
    let canvasDesiredWidth = cardWidth * 2;
    let canvasDesiredHeight = canvasDesiredWidth / LOTTIE_ASPECT_RATIO;

    // 너비와 높이가 4의 배수가 되도록 조정 (ImageData 호환성을 위해)
    canvasDesiredWidth = Math.max(4, Math.floor(canvasDesiredWidth / 4) * 4);
    canvasDesiredHeight = Math.max(4, Math.floor(canvasDesiredHeight / 4) * 4);

    // 캔버스 크기가 변경되었을 때만 업데이트
    if (canvasRef.current.width !== canvasDesiredWidth || canvasRef.current.height !== canvasDesiredHeight) {
      canvasRef.current.width = canvasDesiredWidth;
      canvasRef.current.height = canvasDesiredHeight;
      
      canvasRef.current.style.width = `${canvasDesiredWidth}px`;
      canvasRef.current.style.height = `${canvasDesiredHeight}px`;

      // Lottie 인스턴스가 resize 메소드를 제공한다면 호출
      if (dotLottieRef.current && typeof dotLottieRef.current.resize === 'function') {
        dotLottieRef.current.resize();
      }
    }
  };

  useEffect(() => {
    const initializeLottie = () => {
      if (canvasRef.current && cardRef.current && !dotLottieRef.current) {
        // 초기 canvas 크기 설정
        adjustLottieLayout();
        
        try {
          const dotLottieInstance = new DotLottie({
            autoplay: true,
            loop: true,
            canvas: canvasRef.current,
            src: "https://lottie.host/cc87f464-9dee-4a09-82eb-8a84f1098f78/mXXmPPp4X3.json",
            // fit, alignment 등의 옵션이 있다면 여기에 추가
          });
          dotLottieRef.current = dotLottieInstance;
        } catch (error) {
          console.error('Lottie initialization failed:', error);
        }
      }
    };

    // 컴포넌트가 마운트된 후 약간의 지연을 두고 초기화
    const initTimer = setTimeout(initializeLottie, 100);
    
    window.addEventListener('resize', adjustLottieLayout);

    return () => {
      clearTimeout(initTimer);
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
      className="bg-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] p-3 relative flex flex-col justify-end min-h-[120px] overflow-hidden"
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
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 drop-shadow-md whitespace-nowrap">
          함께 성장하는 개발자
        </span>
      </div>
    </div>
  );
};

export default AiExpertCard; 