"use client"

import { Suspense, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { getProjectBySlug } from "@/lib/projects"
import { ProjectDetail } from "../project-detail"
import { ProjectDetailSkeleton } from "../project-detail-skeleton"
import type { Project as SupabaseProject } from "@/types/supabase"

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<SupabaseProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectBySlug(params.slug)
        if (!data) {
          notFound()
        }
        setProject(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching project:", err)
        setError(err instanceof Error ? err : new Error("프로젝트를 불러오는 중 오류가 발생했습니다."))
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.slug])

  if (loading) {
    return <ProjectDetailSkeleton />
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">프로젝트를 불러오는 중 오류가 발생했습니다</h2>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return notFound()
  }

  return <ProjectDetail project={project} />
} 