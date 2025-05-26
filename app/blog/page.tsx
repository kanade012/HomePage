"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getBlogPosts } from "@/lib/blog"
import type { BlogPost as SupabaseBlogPost } from "@/types/supabase"

// 메타데이터 내보내기 제거 (별도 파일로 이동)

export default function BlogPage() {
  const [posts, setPosts] = useState<SupabaseBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts()
        setPosts(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError("블로그 포스트를 불러오는 중 오류가 발생했습니다.")
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Blog</h1>
        
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card animate-pulse rounded-lg p-6">
                <div className="h-7 bg-muted-foreground/20 w-1/3 rounded mb-3"></div>
                <div className="h-4 bg-muted-foreground/20 w-full rounded mb-2"></div>
                <div className="h-4 bg-muted-foreground/20 w-5/6 rounded mb-4"></div>
                <div className="h-4 bg-muted-foreground/20 w-1/4 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-card rounded-lg p-6 text-center">
            <p className="text-muted-foreground">아직 작성된 블로그 포스트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function BlogPostCard({ post }: { post: SupabaseBlogPost }) {
  const formattedDate = new Date(post.published_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div 
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="p-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2">
              {post.tags && post.tags.map((tag) => (
                <span key={tag.id} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                  {tag.name}
                </span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
          <p className="text-muted-foreground mb-4">{post.summary}</p>
          
          <span className="text-primary hover:underline font-medium">
            Read More →
          </span>
        </div>
      </Link>
    </motion.div>
  )
} 