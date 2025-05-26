"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MessageSquare, ChevronDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Project } from "@/types/supabase"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

export function ProjectDetail({ project, isModal = false }: { project: Project, isModal?: boolean }) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Transform values based on scroll position - enhanced blur effect
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const imageBlur = useTransform(scrollYProgress, [0, 0.4], [0, 12])
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 0.95])
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  useEffect(() => {
    setIsMounted(true)

    // If this is a modal, prevent scrolling of the body
    if (isModal) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "auto"
      }
    }

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
  }, [isModal, hasScrolled])

  const isDarkMode = isMounted && document.documentElement.classList.contains("dark")

  const handleClose = () => {
    router.back()
  }

  const handleScrollDown = () => {
    if (contentRef.current) {
      const cardTop = contentRef.current.getBoundingClientRect().top + window.scrollY
      const titleOffset = 100; // Offset to make the title visible

      window.scrollTo({
        top: cardTop - titleOffset,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden" ref={containerRef} style={{ overscrollBehavior: 'none' }}>
      {/* Cover Image with parallax effect */}
      <div className="fixed top-0 left-0 w-full h-[120vh] z-0 overflow-hidden">
        <motion.div
          className="w-full h-full"
          style={{
            scale: imageScale,
          }}
        >
          <motion.img
            src={project.image_url || "/placeholder.svg?height=600&width=1200"}
            alt={project.title}
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
              bottom: '-50px', // Extend gradient below
            }}
          />
        </motion.div>
      </div>

      <div className="relative min-h-screen pt-[70vh]" style={{ overscrollBehavior: 'contain' }}>
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
          className="bg-card w-full rounded-t-3xl shadow-2xl overflow-hidden border border-border z-10 relative min-h-[80vh]"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            boxShadow: "0 -10px 50px rgba(0, 0, 0, 0.15)",
          }}
        >
          {isModal && (
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card border-b backdrop-blur-md bg-card/80">
              <h2 className="text-xl font-bold">{project.title}</h2>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              {!isModal && <h1 className="text-3xl font-bold mb-4">{project.title}</h1>}

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies && project.technologies.map((tech) => (
                  <Badge key={tech.id} variant="secondary">
                    {tech.name}
                  </Badge>
                ))}
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {project.content || ''}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-medium mb-3">Links</h3>
                <div className="flex flex-wrap gap-2">
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Contact shortcut card */}
              <div className="mt-12">
                <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">이 프로젝트에 대해 질문이 있으신가요?</CardTitle>
                    <CardDescription>
                      프로젝트에 대해 더 알고 싶으시다면 언제든지 연락해주세요.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/contact" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        문의하기
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 