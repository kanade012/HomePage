"use client"

import { motion } from "framer-motion"

export default function CVPage() {
  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">CV / Resume</h1>
        
        <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
          <p className="text-muted-foreground mb-8">
            This page will display CV information. Under construction.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 