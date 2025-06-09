"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Suspense } from "react"

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

  // 페이지 전환 감지용 코드는 유지하되 NProgress는 제거
  useEffect(() => {
    // 페이지 전환 감지 로직만 유지 (NProgress 제거)
    // console.log('Page changed:', pathname);
  }, [pathname, searchParams]);

  return null
} 