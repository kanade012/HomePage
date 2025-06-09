"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const AiExpertCard = dynamic(() => import('./components/AiExpertCard'), {
  ssr: false,
  loading: () => null, // 로딩 상태는 메인 로더에서 처리
});

const organizationLogos = [
  { src: "/assets/gdg.png", alt: "GDG" },
  { src: "/assets/flutterseoul.png", alt: "Flutter Seoul" },
  { src: "/assets/cocone.png", alt: "Cocone" },
  { src: "/assets/keti.png", alt: "KETI" },
];

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [componentsReady, setComponentsReady] = useState({
    mobileCheck: false,
    techTags: false,
    animations: false,
  });
  const techTagsRef = useRef<{positions: {x: number, y: number, speed: number, visible: boolean}[], containerWidth: number | null}>({
    positions: [
      {x: 300, y: 15, speed: 1.2, visible: true},
      {x: 450, y: 30, speed: 0.8, visible: true},
      {x: 600, y: 45, speed: 1.5, visible: true},
      {x: 750, y: 60, speed: 1.0, visible: true},
      {x: 900, y: 65, speed: 0.9, visible: true},
      {x: 1050, y: 50, speed: 1.3, visible: true}
    ],
    containerWidth: null
  });
  const [currentSlideImageIndex, setCurrentSlideImageIndex] = useState(0);

  // 다크 모드 배경색 강제 적용
  useEffect(() => {
    const updateBackgroundColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.body.style.backgroundColor = '#0a0a0a';
        document.documentElement.style.backgroundColor = '#0a0a0a';
      } else {
        // 라이트모드일 때 배경색 복원
        document.body.style.backgroundColor = '';
        document.documentElement.style.backgroundColor = '';
      }
    };

    updateBackgroundColor();
    
    // 테마 변경 감지
    const observer = new MutationObserver(updateBackgroundColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // 애니메이션 초기화 함수
  const initializeAllAnimations = () => {
    // 기술 태그 애니메이션 초기화
    const techContainer = document.querySelector('.tech-container');
    if (techContainer) {
      techTagsRef.current.containerWidth = techContainer.clientWidth;
    }
    
    const maxVisibleTags = 3;
    const tags = document.querySelectorAll('.tech-tag');
    
    // 기존 태그들 초기화
    tags.forEach((tag, index) => {
      const htmlTag = tag as HTMLElement;
      htmlTag.style.opacity = '0';
      techTagsRef.current.positions[index].visible = false;
    });
    
    // 초기 표시할 태그 선택
    const availableTagIndices = Array.from({length: 6}, (_, i) => i);
    const initialVisibleIndices = [];
    for (let i = 0; i < maxVisibleTags; i++) {
      if (availableTagIndices.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableTagIndices.length);
      const tagIndex = availableTagIndices.splice(randomIndex, 1)[0];
      initialVisibleIndices.push(tagIndex);
    }
    
    // 태그 초기화 및 표시
    activeTechTagsRef.current = Array(6).fill(-1);
    initialVisibleIndices.forEach((index) => {
      const htmlTag = tags[index] as HTMLElement;
      if (htmlTag) {
        // updateTagContent 대신 직접 구현
        const unusedTechIndices = techSkillTags.map((_, i) => i)
          .filter(i => !activeTechTagsRef.current.includes(i));
        
        let selectedTechIndex;
        if (unusedTechIndices.length > 0) {
          const randomIndex = Math.floor(Math.random() * unusedTechIndices.length);
          selectedTechIndex = unusedTechIndices[randomIndex];
        } else {
          selectedTechIndex = Math.floor(Math.random() * techSkillTags.length);
        }
        
        const tech = techSkillTags[selectedTechIndex];
        htmlTag.innerHTML = `
          <span class="text-${tech.color}-600 font-semibold whitespace-nowrap">${tech.name}</span>
          <div class="w-2 h-2 bg-${tech.color}-600 rounded-full ml-2 animate-pulse"></div>
        `;
        htmlTag.className = `tech-tag bg-${tech.color}-500/10 border border-${tech.color}-500/30 rounded-full px-4 py-2 flex items-center absolute left-0`;
        htmlTag.style.transition = "opacity 0.3s ease-in-out";
        activeTechTagsRef.current[index] = selectedTechIndex;
        
        htmlTag.style.opacity = '1';
        techTagsRef.current.positions[index].visible = true;
        techTagsRef.current.positions[index].x = (techTagsRef.current.containerWidth || 300) * Math.random() * 0.6 + 300;
        htmlTag.style.transform = `translateX(${techTagsRef.current.positions[index].x}px)`;
        techTagsRef.current.positions[index].speed = 1 + Math.random();
      }
    });
  };

  // 페이지 로딩 상태를 로컬/세션에 저장/복원 - 최적화
  useEffect(() => {
    const LOADING_COMPLETED_KEY = 'homepage-loading-completed';
    const PAGE_LOAD_TIME_KEY = 'homepage-last-load-time';
    const VISIT_COUNT_KEY = 'homepage-visit-count';
    const FIRST_VISIT_KEY = 'homepage-first-visit';
    
    // 로컬스토리지에서 첫 방문 여부 확인
    const isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY);
    const visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0');
    const isLoadingCompleted = sessionStorage.getItem(LOADING_COMPLETED_KEY);
    const lastLoadTime = sessionStorage.getItem(PAGE_LOAD_TIME_KEY);
    const currentTime = Date.now();
    
    // 방문 횟수 증가
    localStorage.setItem(VISIT_COUNT_KEY, (visitCount + 1).toString());
    if (isFirstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, currentTime.toString());
    }
    
    // 로딩 스킵 조건들:
    // 1. 첫 방문이 아니고 && 5회 이상 방문했거나
    // 2. 세션 내에서 이미 로딩 완료 && 10분 이내 재방문
    const shouldSkipLoading = (!isFirstVisit && visitCount >= 3) || 
                              (isLoadingCompleted === 'true' && 
                               lastLoadTime && 
                               (currentTime - parseInt(lastLoadTime)) < 600000); // 10분으로 증가
    
    if (shouldSkipLoading) {
      // 로딩 스키프 - 즉시 완료 상태로 설정
      setLoading(false);
      setComponentsReady({
        mobileCheck: true,
        techTags: true,
        animations: true,
      });
      
      // body 스타일 초기화
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      // 애니메이션 즉시 초기화
      setTimeout(() => {
        initializeAllAnimations();
      }, 50);
      
      console.log('🚀 로딩 최적화: 빠른 로딩 적용');
    } else {
      // 새로운 로딩 - 시작 시간 기록
      sessionStorage.setItem(PAGE_LOAD_TIME_KEY, currentTime.toString());
      
      // 일반 로딩 시에도 컴포넌트 준비 상태 설정
      setTimeout(() => {
        setComponentsReady(prev => ({
          ...prev,
          techTags: true,
          animations: true,
        }));
      }, 100);
      
      console.log('⏳ 첫 방문 또는 장시간 후 재방문 - 전체 로딩 진행');
    }
    
    // 안전장치: 5초 후 강제 로딩 완료
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ 강제 로딩 완료 - fallback 타이머 실행');
        setLoading(false);
        setComponentsReady({
          mobileCheck: true,
          techTags: true,
          animations: true,
        });
      }
    }, 5000);
    
    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [loading]);
  
  // 컴포넌트 준비 상태를 확인하여 로딩 완료 처리 - 최적화
  useEffect(() => {
    const allComponentsReady = Object.values(componentsReady).every(ready => ready);
    
    if (allComponentsReady && loading) {
      // 방문 이력에 따른 동적 로딩 시간
      const visitCount = parseInt(localStorage.getItem('homepage-visit-count') || '0');
      const isFrequentVisitor = visitCount >= 5;
      
      // 자주 방문하는 사용자는 로딩 시간 단축
      const minLoadingTime = isFrequentVisitor ? 300 : 800; // 300ms vs 800ms
      
      const timer = setTimeout(() => {
        setLoading(false);
        
        // 로딩 완료 상태를 세션에 저장
        const LOADING_COMPLETED_KEY = 'homepage-loading-completed';
        const PAGE_LOAD_TIME_KEY = 'homepage-last-load-time';
        sessionStorage.setItem(LOADING_COMPLETED_KEY, 'true');
        sessionStorage.setItem(PAGE_LOAD_TIME_KEY, Date.now().toString());
        
        // 로딩 완료 시 body 스타일 초기화
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        // 로딩 완료 후 모든 애니메이션 재초기화
        requestAnimationFrame(() => {
          initializeAllAnimations();
        });
        
        console.log(`✅ 로딩 완료 (${minLoadingTime}ms) - 방문횟수: ${visitCount}`);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [componentsReady, loading]);

  // 로딩 중일 때 body 스크롤 방지 - 최적화
  useEffect(() => {
    // 로딩 중일 때만 body에 overflow hidden 추가
    if (loading) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // 로딩 완료시 body 스타일 즉시 초기화
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      // 컴포넌트 언마운트 시 body 스타일 초기화
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [loading]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // 모바일 체크 완료 상태 설정
    setComponentsReady(prev => ({ 
      ...prev, 
      mobileCheck: true,
      techTags: true,  // 기술 태그도 준비 완료로 설정
      animations: true // 애니메이션도 준비 완료로 설정
    }));
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const techSkillTags = [
    { name: 'TypeScript', color: 'blue' },
    { name: 'JavaScript', color: 'amber' },
    { name: 'Flutter', color: 'sky' },
    { name: 'Firebase', color: 'orange' },
    { name: 'Supabase', color: 'green' },
    { name: 'Figma', color: 'purple' }
  ];

  const activeTechTagsRef = useRef<number[]>([]);

  useEffect(() => {
    const techContainer = document.querySelector('.tech-container');
    if (techContainer) {
      techTagsRef.current.containerWidth = techContainer.clientWidth;
    }
    
    const maxVisibleTags = 3;
    const tags = document.querySelectorAll('.tech-tag');
    
    tags.forEach((tag, index) => {
      const htmlTag = tag as HTMLElement;
      htmlTag.style.opacity = '0';
      techTagsRef.current.positions[index].visible = false;
    });
    
    const availableTagIndices = Array.from({length: 6}, (_, i) => i);
    
    const initialVisibleIndices = [];
    for (let i = 0; i < maxVisibleTags; i++) {
      if (availableTagIndices.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableTagIndices.length);
      const tagIndex = availableTagIndices.splice(randomIndex, 1)[0];
      initialVisibleIndices.push(tagIndex);
    }
    
    activeTechTagsRef.current = Array(6).fill(-1);
    initialVisibleIndices.forEach((index) => {
      const htmlTag = tags[index] as HTMLElement;
      
      updateTagContent(htmlTag, index);
      
      htmlTag.style.opacity = '1';
      techTagsRef.current.positions[index].visible = true;
      
      techTagsRef.current.positions[index].x = techTagsRef.current.containerWidth! * Math.random() * 0.6 + 300;
      htmlTag.style.transform = `translateX(${techTagsRef.current.positions[index].x}px)`;
      
      techTagsRef.current.positions[index].speed = 1 + Math.random();
    });
    
    function updateTagContent(tagElement: HTMLElement, tagIndex: number) {
      if (!tagElement) {
        return;
      }

      const unusedTechIndices = techSkillTags.map((_, i) => i)
        .filter(i => !activeTechTagsRef.current.includes(i));
      
      let selectedTechIndex;
      if (unusedTechIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * unusedTechIndices.length);
        selectedTechIndex = unusedTechIndices[randomIndex];
      } else {
        selectedTechIndex = Math.floor(Math.random() * techSkillTags.length);
      }
      
      const tech = techSkillTags[selectedTechIndex];
      
      tagElement.innerHTML = `
        <span class="text-${tech.color}-600 font-semibold whitespace-nowrap">${tech.name}</span>
        <div class="w-2 h-2 bg-${tech.color}-600 rounded-full ml-2 animate-pulse"></div>
      `;
      
      tagElement.className = `tech-tag bg-${tech.color}-500/10 border border-${tech.color}-500/30 rounded-full px-4 py-2 flex items-center absolute left-0`;
      
      tagElement.style.transition = "opacity 0.3s ease-in-out";
      
      activeTechTagsRef.current[tagIndex] = selectedTechIndex;
    }
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime > 16) {
        const tags = document.querySelectorAll('.tech-tag');
        const containerWidth = techTagsRef.current.containerWidth || 300;
        
        let visibleTagCount = 0;
        techTagsRef.current.positions.forEach(pos => {
          if (pos.visible) visibleTagCount++;
        });
        
        tags.forEach((tag, index) => {
          const htmlTag = tag as HTMLElement;
          const { x, y, speed, visible } = techTagsRef.current.positions[index];
          
          if (!visible) return;
          
          const moveAmount = (speed * deltaTime) / 20;
          const newX = x - moveAmount;
          
          const tagWidth = htmlTag.offsetWidth;
          if (newX < -tagWidth) {
            htmlTag.style.opacity = '0';
            techTagsRef.current.positions[index].visible = false;
            
            activeTechTagsRef.current[index] = -1;
            
            const delay = Math.random() * 1000;
            setTimeout(() => {
              let currentVisibleCount = 0;
              techTagsRef.current.positions.forEach(pos => {
                if (pos.visible) currentVisibleCount++;
              });
              
              if (currentVisibleCount < maxVisibleTags) {
                if (htmlTag) {
                  updateTagContent(htmlTag, index);
                }
                
                techTagsRef.current.positions[index].speed = 1 + Math.random();
                
                techTagsRef.current.positions[index].x = containerWidth + 20;
                htmlTag.style.transform = `translateX(${containerWidth + 20}px)`;
                
                setTimeout(() => {
                  htmlTag.style.opacity = '1';
                  techTagsRef.current.positions[index].visible = true;
                }, 50);
              }
            }, delay);
          } else {
            techTagsRef.current.positions[index].x = newX;
            htmlTag.style.transform = `translateX(${newX}px)`;
          }
        });
        
        lastTime = currentTime;
      }
      
      techTagsAnimationRef.current = requestAnimationFrame(animate);
    };
    
    techTagsAnimationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (techTagsAnimationRef.current) {
        cancelAnimationFrame(techTagsAnimationRef.current);
      }
    };
  }, []);

  const techTagsAnimationRef = useRef<number | null>(null);

  const [frontPlatformIndex, setFrontPlatformIndex] = useState(0);
  const [backPlatformIndex, setBackPlatformIndex] = useState(1);
  const [rotationCount, setRotationCount] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [lastVisibleTime, setLastVisibleTime] = useState<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  
  const platformIcons = [
    { 
      name: 'macOS', 
      icon: <Image src="/assets/macos.svg" alt="macOS 로고" fill className="object-contain" />
    },
    { 
      name: 'Windows', 
      icon: <Image src="/assets/windows.svg" alt="Windows 로고" fill className="object-contain" />
    },
    { 
      name: 'iOS', 
      icon: <Image src="/assets/ios.svg" alt="iOS 로고" fill className="object-contain" />
    },
    { 
      name: 'Android', 
      icon: <Image src="/assets/android.svg" alt="Android 로고" fill className="object-contain" />
    },
    { 
      name: 'WearOS', 
      icon: <Image src="/assets/wearos.svg" alt="WearOS 로고" fill className="object-contain" />
    },
    { 
      name: 'Web', 
      icon: <Image src="/assets/web.svg" alt="Web 로고" fill className="object-contain" />
    }
  ];

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isNowVisible = !document.hidden;
      setIsPageVisible(isNowVisible);
      
      if (isNowVisible) {
        setLastVisibleTime(Date.now());
      }
    };
    
    if (lastVisibleTime === null) {
      setLastVisibleTime(Date.now());
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastVisibleTime]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    if (isPageVisible && !isRotating) {
      intervalIdRef.current = setInterval(() => {
        const isFrontVisible = rotationCount % 2 === 0;
        
        const visibleIndex = isFrontVisible ? frontPlatformIndex : backPlatformIndex;
        const nextIndex = (visibleIndex + 1) % platformIcons.length;
        
        if (isFrontVisible) {
          setBackPlatformIndex(nextIndex);
        } else {
          setFrontPlatformIndex(nextIndex);
        }
        
        setIsRotating(true);
        setRotationCount(prev => prev + 1);
        
        setTimeout(() => {
          setIsRotating(false);
        }, 1500);
        
      }, 4000);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isPageVisible, isRotating, rotationCount, frontPlatformIndex, backPlatformIndex]);

  const gridCardComponents = {
    flipCard: (
      <div className="relative h-full bg-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 overflow-hidden">
        <div 
          className="flex h-full animate-infinite-scroll"
          style={{ width: `${organizationLogos.length * 2 * 100}%` }} // 이미지 두 세트의 전체 너비
        >
          {[...organizationLogos, ...organizationLogos].map((image, index) => ( // 이미지를 두 번 반복
            <div 
              key={`${image.src}-${index}`} 
              className="w-full h-full flex-shrink-0 flex items-center justify-center p-2"
              style={{ width: `${100 / (organizationLogos.length * 2)}%`}} // 각 이미지 슬롯의 너비
            >
              <div className="relative w-full h-full">
                <Image 
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
        <style jsx global>{`
          .animate-infinite-scroll {
            animation: infinite-scroll ${organizationLogos.length * 3}s linear infinite; /* 이미지 개수 비례 속도 */
          }
        `}</style>
      </div>
    ),
    uiDesignCard: (
      <div className="bg-white flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 relative overflow-hidden p-2">
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">UI 디자인</p>
            
            <div className="relative h-12 w-32 md:h-16 md:w-40 mb-1">
              <div className="absolute top-0 left-0 flex space-x-1" style={{animation: "fadeIn 1s ease-out forwards"}}>
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-500" style={{animation: "colorPulse 2s infinite"}}></div>
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-500" style={{animation: "colorPulse 2s infinite", animationDelay: "0.2s"}}></div>
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-purple-500" style={{animation: "colorPulse 2s infinite", animationDelay: "0.4s"}}></div>
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-yellow-500" style={{animation: "colorPulse 2s infinite", animationDelay: "0.6s"}}></div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-32 md:w-40" style={{animation: "drawIn 1.5s ease-out forwards", transformOrigin: "left"}}>
                <div className="w-full h-1 md:h-1.5 bg-gray-400 rounded mb-1"></div>
                <div className="flex space-x-1">
                  <div className="w-8 h-3 md:w-10 md:h-4 bg-gray-400 rounded"></div>
                  <div className="w-6 h-3 md:w-8 md:h-4 bg-gray-400 rounded"></div>
                  <div className="w-10 h-3 md:w-12 md:h-4 bg-gray-400 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute w-5 h-5 md:w-6 md:h-6 pointer-events-none" style={{animation: "moveCursor 6s infinite"}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
          </svg>
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes colorPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          
          @keyframes drawIn {
            0% { transform: scaleX(0); opacity: 0; }
            100% { transform: scaleX(1); opacity: 1; }
          }
          
          @keyframes moveCursor {
            0% { transform: translate(10px, 10px); }
            25% { transform: translate(60px, 20px); }
            50% { transform: translate(30px, 40px); }
            75% { transform: translate(70px, 30px); }
            100% { transform: translate(10px, 10px); }
          }
        `}</style>
      </div>
    ),
    mobileEngineerCard: (
      <div className="bg-white flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 p-3">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold animate-gradient-text text-center bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">Multi-Platform</h3>
        <p className="text-sm md:text-base text-purple-600 mt-2 text-center font-medium">크로스 플랫폼 전문가</p>
      </div>
    ),
    gamerCard: (
      <div className="col-span-2 bg-white flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 p-4">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center mb-2">
            <span className="text-xl md:text-2xl font-bold text-gray-800">Community Enthusiast</span>
            <span className="relative w-10 h-10 md:w-12 md:h-12 ml-2 animate-spin">
              <Image src="/assets/network.svg" alt="네트워크 아이콘" fill className="object-contain" />
            </span>
          </div>
          <div className="w-16 h-px bg-gray-300 my-2"></div>
          <div className="flex items-center mt-2">
            <span className="text-xl md:text-2xl font-bold text-gray-800">Conference Speaker</span>
            <span className="relative w-8 h-8 md:w-10 md:h-10 ml-2 animate-shake">
              <Image src="/assets/mic.svg" alt="마이크 아이콘" fill className="object-contain" />
            </span>
          </div>
        </div>
      </div>
    ),
    mbtiCard: (
      <div className="bg-white flex items-center justify-center rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10">
        <div className="flex flex-col items-center">
          <div className="relative w-28 md:w-32 h-20 md:h-24">
            <div className="absolute w-28 md:w-32 h-14 md:h-16 bg-gray-600 rounded-md mx-auto left-0 right-0 top-0 p-[2px] shadow-sm">
              <div className="w-full h-full bg-white rounded-sm overflow-hidden">
                <div className="w-full h-1 bg-gray-100 border-b border-gray-200 flex items-center px-1">
                  <div className="flex space-x-0.5">
                    <div className="w-0.5 h-0.5 rounded-full bg-red-500"></div>
                    <div className="w-0.5 h-0.5 rounded-full bg-yellow-500"></div>
                    <div className="w-0.5 h-0.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <div className="h-full flex flex-col items-start justify-start overflow-hidden px-1 pt-0.5 font-mono text-gray-800">
                  <div className="text-[7px] md:text-[8px] font-bold text-gray-700 mb-0.5 w-full">
                    # 오늘의 개발 일기
                  </div>
                  <div className="text-[5px] md:text-[6px] typing-effect text-gray-600 mb-0.5 w-full">
                    안녕하세요, 제 블로그에 오신 것을
                  </div>
                  <div className="text-[5px] md:text-[6px] typing-effect-2 text-gray-600 w-full">
                    <span className="relative">
                      진심으로 환영합니다.
                      <span className="cursor"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute w-28 md:w-32 h-5 bg-gray-400 bottom-0 mx-auto left-0 right-0 rounded-md shadow-sm">
              <div className="grid grid-cols-10 gap-0.5 p-0.5 opacity-80">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-full h-0.5 bg-gray-200 rounded-sm"></div>
                ))}
              </div>
              <div className="absolute bottom-1 left-0 right-0 mx-auto w-6 h-1 bg-gray-300 rounded-sm"></div>
            </div>
            
            <div className="key-container w-full h-full relative">
             <div className="key absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-gray-300 rounded-[4px] text-[7px] md:text-[8px] text-black font-bold flex items-center justify-center shadow-md" style={{top: '-15%', left: '5%', animation: 'keyFall 1.3s infinite ease-in', animationDelay: '0.2s'}}>안</div>
               <div className="key absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-gray-300 rounded-[4px] text-[7px] md:text-[8px] text-black font-bold flex items-center justify-center shadow-md" style={{top: '-10%', left: '25%', animation: 'keyFall 1.1s infinite ease-in', animationDelay: '0.6s'}}>녕</div>
               <div className="key absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-gray-300 rounded-[4px] text-[7px] md:text-[8px] text-black font-bold flex items-center justify-center shadow-md" style={{top: '-20%', left: '40%', animation: 'keyFall 1.5s infinite ease-in', animationDelay: '0.1s'}}>하</div>
               <div className="key absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-gray-300 rounded-[4px] text-[7px] md:text-[8px] text-black font-bold flex items-center justify-center shadow-md" style={{top: '-12%', left: '60%', animation: 'keyFall 1.2s infinite ease-in', animationDelay: '0.8s'}}>세</div>
               <div className="key absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-gray-300 rounded-[4px] text-[7px] md:text-[8px] text-black font-bold flex items-center justify-center shadow-md" style={{top: '-18%', left: '80%', animation: 'keyFall 1.6s infinite ease-in', animationDelay: '0.4s'}}>요</div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes keyFall {
            0% { 
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% { 
              transform: translateY(50px) rotate(45deg);
              opacity: 0;
            }
          }
          
          .sequential-text {
            display: block;
            overflow: hidden;
            white-space: normal;
            word-break: keep-all;
            word-wrap: break-word;
            opacity: 0;
            animation: appear 0.5s forwards;
          }
          
          .typing-effect {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            width: 0;
            animation: typing 1.5s steps(15, end) forwards;
          }
          
          .typing-effect-2 {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            width: 0;
            animation: typing 1.2s steps(10, end) forwards;
            animation-delay: 1.7s;
          }
          
          .cursor {
            display: inline-block;
            width: 1px;
            height: 70%;
            background-color: #777;
            position: absolute;
            bottom: 15%;
            margin-left: 1px;
            animation: blink-cursor 0.7s step-end infinite;
            animation-delay: 2.9s;
          }
          
          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }
          
          @keyframes blink-cursor {
            from, to { opacity: 0 }
            50% { opacity: 1 }
          }
          
          @keyframes appear {
            0% { 
              opacity: 0;
              transform: translateX(-5px);
            }
            100% { 
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    ),
    profileCard: (
      <div 
        className="col-span-3 md:row-span-2 bg-white flex items-center justify-between px-6 md:px-10 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10" 
        style={isMobile ? {} : {gridRow: "span 2"}}
      >
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Multi-Platform Engineer</h2>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">장영하입니다.</h1>
        </div>
        <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
          <div className="relative w-full h-full overflow-hidden border-2 border-white">
            <Image
              src="/assets/profile.png"
              alt="프로필 이미지"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    ),
    aiCard: (
      <div className="bg-white flex items-center justify-center rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10">
        <div className="flex items-center">
          <span className="text-7xl md:text-8xl lg:text-9xl font-bold text-blue-500 animate-rotate-left">A</span>
          <span className="text-7xl md:text-8xl lg:text-9xl font-bold text-blue-500 animate-rotate-right">I</span>
        </div>
      </div>
    ),
    careerCard: (
      <div 
        className="md:row-span-2 bg-white flex flex-col items-start justify-center rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 p-4" 
        style={isMobile ? {} : {gridRow: "span 2"}}
      >
        <div className="flex flex-col w-full">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2">Career</h2>
          <p className="text-xs md:text-sm text-gray-500 mb-3 font-medium">Since 2023 ~</p>
          <div className="mb-4">
            <h3 className="text-md md:text-lg lg:text-xl font-bold text-green-600 mb-1">Development</h3>
            <p className="text-xs md:text-sm text-gray-700"> 6개 플랫폼 출시 경험 보유 <br /> 3년차 프리랜서 개발자</p>
          </div>
          <div className="w-full h-px bg-gray-300 my-3"></div>
          <div>
            <h3 className="text-md md:text-lg lg:text-xl font-bold text-purple-600 mb-1">Community</h3>
            <p className="text-xs md:text-sm text-gray-700">개발 컨퍼런스 연사 3회 <br /> 컨퍼런스 운영 및 기획 4회 <br />오픈소스 기여 5회</p>
          </div>
        </div>
      </div>
    ),
    platformsCard: (
      <div className="[perspective:1500px] md:row-span-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10" style={isMobile ? {} : {gridRow: "span 2"}}>
        <div 
          className="w-full h-full rounded-xl relative [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(${rotationCount * 180}deg)`,
            transition: isPageVisible ? 'transform 1500ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
          <div className="absolute inset-0 bg-white rounded-xl p-3 flex flex-col items-center justify-center [backface-visibility:hidden]" style={{
            transform: 'translateZ(1px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-4">{platformIcons[frontPlatformIndex].icon}</div>
            <span className="text-xl md:text-2xl font-bold text-gray-800">{platformIcons[frontPlatformIndex].name}</span>
          </div>
          
          <div className="absolute inset-0 bg-white rounded-xl p-3 flex flex-col items-center justify-center [backface-visibility:hidden]" style={{
            transform: 'rotateX(180deg)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-4">{platformIcons[backPlatformIndex].icon}</div>
            <span className="text-xl md:text-2xl font-bold text-gray-800">{platformIcons[backPlatformIndex].name}</span>
          </div>
        </div>
      </div>
    ),
    techStackCard: (
      <div className="bg-white flex items-center justify-center rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 p-3 relative overflow-hidden tech-container">
        <div className="tech-tag bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 flex items-center absolute left-0" style={{transform: "translateX(300px)", top: "15%", opacity: 1, transition: "opacity 0.3s ease-in-out"}}>
          <span className="text-blue-600 font-semibold whitespace-nowrap">TypeScript</span>
          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 animate-pulse"></div>
        </div>
        <div className="tech-tag bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 flex items-center absolute left-0" style={{transform: "translateX(450px)", top: "30%", opacity: 1, transition: "opacity 0.3s ease-in-out"}}>
          <span className="text-amber-600 font-semibold whitespace-nowrap">JavaScript</span>
          <div className="w-2 h-2 bg-amber-600 rounded-full ml-2 animate-pulse"></div>
        </div>
        <div className="tech-tag bg-sky-500/10 border border-sky-500/30 rounded-full px-4 py-2 flex items-center absolute left-0" style={{transform: "translateX(600px)", top: "45%", opacity: 1, transition: "opacity 0.3s ease-in-out"}}>
          <span className="text-sky-600 font-semibold whitespace-nowrap">Flutter</span>
          <div className="w-2 h-2 bg-sky-600 rounded-full ml-2 animate-pulse"></div>
        </div>
        <div className="tech-tag bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 flex items-center absolute left-0" style={{transform: "translateX(1050px)", top: "50%", opacity: 1, transition: "opacity 0.3s ease-in-out"}}>
          <span className="text-purple-600 font-semibold whitespace-nowrap">Figma</span>
          <div className="w-2 h-2 bg-purple-600 rounded-full ml-2 animate-pulse"></div>
        </div>
        <div className="tech-tag bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 flex items-center absolute left-0" style={{transform: "translateX(750px)", top: "60%", opacity: 1, transition: "opacity 0.3s ease-in-out"}}>
          <span className="text-orange-600 font-semibold whitespace-nowrap">Firebase</span>
          <div className="w-2 h-2 bg-orange-600 rounded-full ml-2 animate-pulse"></div>
        </div>
        <div className="tech-tag bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 flex items-center absolute left-0" style={{transform: "translateX(900px)", top: "65%", opacity: 1, transition: "opacity 0.3s ease-in-out"}}>
          <span className="text-green-600 font-semibold whitespace-nowrap">Supabase</span>
          <div className="w-2 h-2 bg-green-600 rounded-full ml-2 animate-pulse"></div>
        </div>
      </div>
    ),
    creatingCard: (
      <div className="bg-white flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 p-3 overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed">
            {(() => {
              const line1 = "새로운 도전을 즐기는";
              const line2 = "개발자";
              let charIndex = 0;

              return (
                <>
                  {line1.split("").map((char, index) => (
                    <span
                      key={`line1-${index}`}
                      className="firework-char inline-block"
                      style={{ animationDelay: `${charIndex++ * 0.05}s` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                  <br />
                  {line2.split("").map((char, index) => (
                    <span
                      key={`line2-${index}`}
                      className="firework-char inline-block"
                      style={{ animationDelay: `${charIndex++ * 0.05}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </>
              );
            })()}
          </h3>
        </div>
        <style jsx>{`
          .firework-char {
            opacity: 0;
            animation-name: firework;
            animation-duration: 1.5s; /* 애니메이션 총 시간 */
            animation-timing-function: ease-out;
            animation-iteration-count: infinite; /* 계속 반복 */
            animation-fill-mode: both; 
          }
          @keyframes firework {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.5);
            }
            20% { /* 나타나면서 위로 솟구침 */
              opacity: 1;
              transform: translateY(-10px) scale(1.2);
            }
            40% { /* 잠시 유지 */
              opacity: 1;
              transform: translateY(-10px) scale(1.1);
            }
            100% { /* 사라짐 */
              opacity: 0;
              transform: translateY(10px) scale(0.8);
            }
          }
        `}</style>
      </div>
    )
  };

  // 로딩 오버레이 컴포넌트
  const LoadingSpinner = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[99999] overflow-hidden" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-center whitespace-nowrap">
          <span className="inline-block bouncing-text" style={{animationDelay: '0s'}}>L</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.1s'}}>o</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.2s'}}>a</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.3s'}}>d</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.4s'}}>i</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.5s'}}>n</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.6s'}}>g</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.7s'}}>.</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.8s'}}>.</span>
          <span className="inline-block bouncing-text" style={{animationDelay: '0.9s'}}>.</span>
        </div>
        
        <style jsx>{`
          .bouncing-text {
            animation: bounce 1.5s infinite;
            transform-origin: center bottom;
            display: inline-block;
            position: relative;
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-30px);
            }
            60% {
              transform: translateY(-15px);
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      
      {!isMobile ? (
        <section className="w-full py-2 md:py-4 px-2 md:px-4 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 -z-10"></div>
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-100 rounded-2xl p-1 md:p-1.5">
              <div 
                className="grid grid-cols-5 gap-1.5 md:gap-2" 
                style={{
                  gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr",
                  gridTemplateRows: "minmax(144px, 1fr) minmax(144px, 1fr) minmax(144px, 1fr) minmax(144px, 1fr)"
                }}
              >
                {gridCardComponents.careerCard}
                {gridCardComponents.uiDesignCard}
                {gridCardComponents.mobileEngineerCard}
                {gridCardComponents.gamerCard}
                {gridCardComponents.profileCard}
                {gridCardComponents.aiCard}
                {gridCardComponents.mbtiCard}
                {gridCardComponents.platformsCard}
                {gridCardComponents.flipCard}
                <AiExpertCard />
                {gridCardComponents.techStackCard}
                {gridCardComponents.creatingCard}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 -z-10"></div>
          <div className="w-full mx-auto px-1">
            <div className="bg-gray-100 p-1 min-h-screen">
              <div className="flex flex-col gap-2 h-full">
                {/* 첫 번째 2열 그리드 */}
                <div className="grid grid-cols-2 gap-2 h-[22vh]">
                  {/* 오늘의 개발일기 */}
                  <div className="w-full h-full [&>div]:h-full [&>div]:w-full">
                    {gridCardComponents.mbtiCard}
                  </div>
                  
                  {/* 함께 성장 */}
                  <div className="w-full h-full [&>div]:h-full [&>div]:w-full">
                    <AiExpertCard></AiExpertCard>
                  </div>
                </div>
                
                {/* 장영하입니다 - 전체 너비 */}
                <div className="h-[30vh] [&>div]:h-full [&>div]:w-full">
                  {gridCardComponents.profileCard}
                </div>
                
                {/* Conference - 전체 너비 */}
                <div className="h-[20vh] [&>div]:h-full [&>div]:w-full">
                  {gridCardComponents.gamerCard}
                </div>
                
                {/* 두 번째 2열 그리드 */}
                <div className="grid grid-cols-2 gap-2 h-[28vh]">
                  {/* wear os */}
                  <div className="w-full h-full [&>div]:h-full [&>div]:w-full">
                    {gridCardComponents.platformsCard}
                  </div>
                  
                  {/* gdg */}
                  <div className="w-full h-full [&>div]:h-full [&>div]:w-full">
                    {gridCardComponents.flipCard}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
} 