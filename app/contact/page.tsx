"use client"

import { motion } from "framer-motion"

export default function ContactPage() {
  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Contact</h1>
        
        <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
          <p className="text-muted-foreground mb-8">
            Feel free to reach out to me through any of the following channels:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-medium">Email:</span>
              <a href="mailto:example@email.com" className="text-primary hover:underline">
                example@email.com
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-medium">GitHub:</span>
              <a 
                href="https://github.com/username" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/username
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-medium">LinkedIn:</span>
              <a 
                href="https://linkedin.com/in/username" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                linkedin.com/in/username
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 