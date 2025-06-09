'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { projectsData } from '../../../lib/projects'
import type { Project } from '../../../types/content'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt, FaApple, FaGooglePlay } from 'react-icons/fa'
import { SiVelog } from 'react-icons/si'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      const updateMatch = () => setMatches(media.matches);
      updateMatch();
      media.addEventListener('change', updateMatch);
      return () => media.removeEventListener('change', updateMatch);
    }
  }, [query]);

  return matches;
}

const sectionTitle = 'Projects';

const getTextDetailsVariants = (isMobile: boolean) => ({
  hidden: { opacity: 0, maxHeight: 0, transition: { duration: isMobile ? 0.3 : 0.15 } },
  visible: { opacity: 1, maxHeight: '1000px', transition: { duration: isMobile ? 0.4 : 0.2 } },
  exit: { opacity: 0, maxHeight: 0, transition: { duration: isMobile ? 0.3 : 0.3, ease: isMobile ? "easeInOut" : [0.4, 0, 0.2, 1] } },
});

const getCarouselVariants = (isMobile: boolean) => ({
  hidden: { opacity: 0, transition: { duration: isMobile ? 0.2 : 0.15 } },
  visible: { opacity: 1, transition: { duration: isMobile ? 0.3 : 0.2, delay: isMobile ? 0 : 0.4 } },
});

const mobileExpandedImageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const projectCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const titleContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut", delay: 0.1 }
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 1,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 1,
  }),
};

interface CustomBadgeProps {
  children: React.ReactNode;
  className?: string;
  borderColorClass?: string;
}

function CustomBadge({ children, className = '', borderColorClass = 'border-transparent' }: CustomBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${borderColorClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

export function ProjectsSection() {
  const projects: Project[] = projectsData;

  return (
    <section
      id="projects"
      className='w-full bg-background px-4 py-16 md:px-6 md:py-24 lg:py-32'
    >
      <div className="container mx-auto max-w-6xl space-y-16 md:space-y-20">
        <motion.div
          className="mb-12 text-center md:mb-16"
          variants={titleContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="inline-block relative pb-5.5">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-5xl">
              {sectionTitle}
            </h2>
            <div className="absolute bottom-0 left-0 w-full h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-400"></div>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={projectCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="relative w-full max-w-5xl rounded-lg border border-border bg-card transition-all duration-200 hover:border-zinc-400/70 dark:hover:border-zinc-500/70 hover:shadow-sm overflow-hidden flex flex-col md:flex-row p-6 md:p-8 md:gap-0"
            >
              <div className="flex flex-col gap-4 w-full md:w-[50%] md:pr-8">
                <div> 
                    <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{project.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{project.period}</p>
                    {project.statusTags && project.statusTags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {project.statusTags.map((tag) => (
                                <CustomBadge 
                                  key={tag} 
                                  className="bg-primary/10 text-primary"
                                  borderColorClass="border-primary/20"
                                >
                                    {tag}
                                </CustomBadge>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-x-4 mt-auto pt-4">
                  {project.githubUrl && (<Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"><FaGithub className="h-4 w-4" /> GitHub</Link>)}
                  {project.appStoreUrl && (<Link href={project.appStoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"><FaApple className="h-4 w-4" /> App Store</Link>)}
                  {project.playStoreUrl && (<Link href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"><FaGooglePlay className="h-4 w-4" /> Play Store</Link>)}
                  {project.liveUrl && (<Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"><FaExternalLinkAlt className="h-3.5 w-3.5" /> Live</Link>)}
                  {project.velogUrl && (<Link href={project.velogUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"><SiVelog className="h-4 w-4" /> Velog</Link>)}
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">{project.introduction}</p>

              </div>
              
              {project.images && project.images.length > 0 && (
                <div className="relative mt-6 md:mt-0 w-full md:w-[50%] aspect-video">
                  <Image src={project.images[0]} alt={`${project.title} thumbnail`} fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 