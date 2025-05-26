import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center py-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        찾으시려는 페이지가 삭제되었거나, 이름이 변경되었거나, 일시적으로 사용할 수 없습니다.
      </p>
      <Link 
        href="/" 
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
} 