"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getProjects } from "@/lib/projects"
import type { Project as SupabaseProject } from "@/types/supabase"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<SupabaseProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("프로젝트를 불러오는 중 오류가 발생했습니다.")
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Projects</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card animate-pulse rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-muted-foreground/20"></div>
                <div className="p-5">
                  <div className="h-6 bg-muted-foreground/20 w-2/3 rounded mb-3"></div>
                  <div className="h-4 bg-muted-foreground/20 w-full rounded mb-2"></div>
                  <div className="h-4 bg-muted-foreground/20 w-5/6 rounded mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 bg-muted-foreground/20 w-16 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-card rounded-lg p-6 text-center">
            <p className="text-muted-foreground">아직 등록된 프로젝트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function ProjectCard({ project }: { project: SupabaseProject }) {
  return (
    <motion.div 
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="h-48 bg-muted/50 flex items-center justify-center">
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground">Project Image</span>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies && project.technologies.map((tech) => (
              <span key={tech.id} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                {tech.name}
              </span>
            ))}
          </div>
          
          <div className="flex gap-3 mt-auto">
            {project.github_url && (
              <span className="text-sm text-primary hover:underline">
                GitHub
              </span>
            )}
            {project.demo_url && (
              <span className="text-sm text-primary hover:underline">
                Live Demo
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 