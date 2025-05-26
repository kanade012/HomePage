"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import NProgress from "nprogress"
import { Suspense } from "react"

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: "ease",
  speed: 300,
})

export function NavigationEvents() {
  return (
    <Suspense fallback={null}>
      <NavigationEventsContent />
    </Suspense>
  )
}

function NavigationEventsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 경로 변경 시 NProgress 시작
    NProgress.start();

    return () => {
      // 다음 경로로 변경되기 직전 또는 언마운트 시 NProgress 완료
      NProgress.done();
    };
  }, [pathname, searchParams]);

  // 초기 마운트 시 NProgress.done() 호출 (선택적)
  // 애플리케이션 로드 시 이전에 실행된 NProgress가 있다면 정리
  useEffect(() => {
    NProgress.done();
  }, []);

  return null
} 