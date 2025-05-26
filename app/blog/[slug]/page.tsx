"use client"

import { useState, useEffect, useRef } from "react"
import { notFound, useRouter } from "next/navigation"
import { format } from "date-fns"
import { getBlogPostBySlug } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronDown } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import type { BlogPost } from "@/types/supabase"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasScrolled, setHasScrolled] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Transform values based on scroll position
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const imageBlur = useTransform(scrollYProgress, [0, 0.4], [0, 12])
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 0.95])
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true)
        const postData = await getBlogPostBySlug(params.slug)

        // 존재하지 않는 글이거나 게시되지 않은 글일 경우 404 페이지
        if (!postData || !postData.is_published) {
          return notFound()
        }

        setPost(postData)
      } catch (err) {
        console.error("Error fetching post:", err)
        setError(err instanceof Error ? err : new Error("블로그 포스트를 불러오는 중 오류가 발생했습니다."))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  useEffect(() => {
    // Add scroll listener to detect when user has scrolled
    const handleScroll = () => {
      if (window.scrollY > 50 && !hasScrolled) {
        setHasScrolled(true)
      } else if (window.scrollY <= 50 && hasScrolled) {
        setHasScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hasScrolled])

  const handleScrollDown = () => {
    if (contentRef.current) {
      const cardTop = contentRef.current.getBoundingClientRect().top + window.scrollY

      // Scroll to the card with smooth animation
      window.scrollTo({
        top: cardTop,
        behavior: "smooth",
      })
    }
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>에러</AlertTitle>
          <AlertDescription>
            {error.message || "블로그 포스트를 불러오는 중 오류가 발생했습니다. 나중에 다시 시도하거나 관리자에게 문의하세요."}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
            ← 블로그 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <BlogPostSkeleton />
  }

  if (!post) {
    notFound()
  }

  // 작성자 이름 표시 (없으면 "익명" 표시)
  const authorName = post.author?.full_name || "익명"

  const publishedDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at)
  const formattedDate = format(publishedDate, "yyyy년 MM월 dd일")

  // 커버 이미지 유무 확인
  const hasCoverImage = post.cover_image && post.cover_image.trim() !== ""

  // 커버 이미지가 없을 경우 컨텐츠만 직접 렌더링
  if (!hasCoverImage) {
    return (
      <div className="container max-w-4xl mx-auto py-8 md:py-12">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
            ← 블로그 목록으로 돌아가기
          </Link>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            {post.author?.avatar_url ? (
              <img
                src={post.author.avatar_url || "/placeholder.svg"}
                alt={authorName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {authorName[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm">{authorName}</span>
          </div>

          <span className="text-sm text-muted-foreground">{formattedDate}</span>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/blog/tags/${tag.id}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 마크다운 렌더링 */}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {post.content || ''}
          </ReactMarkdown>
        </div>
      </div>
    )
  }

  // 커버 이미지가 있을 경우 패럴렉스 효과로 렌더링
  return (
    <div className="relative min-h-screen" ref={containerRef}>
      {/* Cover Image with parallax effect */}
      <div className="fixed top-0 left-0 w-full h-[100vh] z-0 overflow-hidden">
        <motion.div
          className="w-full h-full"
          style={{
            scale: imageScale,
          }}
        >
          <motion.img
            src={post.cover_image || "/placeholder.svg?height=1200&width=1920"}
            alt={post.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              filter: `blur(${imageBlur.get()}px)`,
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background"
            style={{
              opacity: gradientOpacity,
            }}
          />
        </motion.div>
      </div>

      {/* Content Card - Scrolls over the image */}
      <div className="relative min-h-screen pt-[70vh]">
        {/* Scroll indicator arrow - Positioned above the content card */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div
              className="absolute left-0 right-0 mx-auto top-[calc(70vh-48px)] w-fit z-20"
              initial={{ opacity: 1, y: 0 }}
              animate={{
                y: [0, 10, 0],
                opacity: scrollOpacity.get()
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                opacity: { duration: 0.3 },
                y: { repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" },
              }}
              onClick={handleScrollDown}
            >
              <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-border/50 cursor-pointer hover:bg-background/90 transition-colors">
                <ChevronDown className="h-6 w-6 text-foreground" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          ref={contentRef}
          className="bg-card w-full rounded-t-3xl shadow-2xl overflow-hidden border border-border z-10 relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            boxShadow: "0 -10px 50px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div className="p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
                  ← 블로그 목록으로 돌아가기
                </Link>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  {post.author?.avatar_url ? (
                    <img
                      src={post.author.avatar_url || "/placeholder.svg"}
                      alt={authorName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {authorName[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm">{authorName}</span>
                </div>

                <span className="text-sm text-muted-foreground">{formattedDate}</span>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link key={tag.id} href={`/blog/tags/${tag.id}`}>
                        <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 마크다운 렌더링 */}
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {post.content || ''}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function BlogPostSkeleton() {
  return (
    <div className="w-full min-h-screen">
      {/* Fixed background skeleton */}
      <div className="fixed top-0 left-0 w-full h-[100vh] z-0">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Content skeleton */}
      <div className="relative min-h-screen pt-[70vh]">
        <div className="bg-card w-full rounded-t-3xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <Skeleton className="h-6 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-12 w-1/2 mb-8" />

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-4 w-32" />

              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 