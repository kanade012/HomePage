export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          author_id: string
          summary: string
          cover_image: string | null
          is_published: boolean
          published_at: string
          enable_comments: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          author_id: string
          summary: string
          cover_image?: string | null
          is_published?: boolean
          published_at?: string
          enable_comments?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          author_id?: string
          summary?: string
          cover_image?: string | null
          is_published?: boolean
          published_at?: string
          enable_comments?: boolean
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          content: string
          slug: string
          image_url: string | null
          github_url: string | null
          demo_url: string | null
          is_featured: boolean
          order: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          content: string
          slug: string
          image_url?: string | null
          github_url?: string | null
          demo_url?: string | null
          is_featured?: boolean
          order?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          content?: string
          slug?: string
          image_url?: string | null
          github_url?: string | null
          demo_url?: string | null
          is_featured?: boolean
          order?: number | null
        }
      }
      project_technologies: {
        Row: {
          id: string
          project_id: string
          technology_id: string
        }
        Insert: {
          id?: string
          project_id: string
          technology_id: string
        }
        Update: {
          id?: string
          project_id?: string
          technology_id?: string
        }
      }
      technologies: {
        Row: {
          id: string
          name: string
          icon_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          icon_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      post_versions: {
        Row: {
          id: string
          post_id: string
          version_number: number
          title: string
          content: string
          summary: string
          created_at: string
          created_by: string
          change_description: string | null
        }
        Insert: {
          id?: string
          post_id: string
          version_number: number
          title: string
          content: string
          summary: string
          created_at?: string
          created_by: string
          change_description?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          version_number?: number
          title?: string
          content?: string
          summary?: string
          created_at?: string
          created_by?: string
          change_description?: string | null
        }
      }
      posts_tags: {
        Row: {
          post_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      post_images: {
        Row: {
          id: string
          post_id: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          url?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          username: string
          full_name?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          avatar_url?: string | null
        }
      }
    },
    Views: {
      secure_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: never
        Update: never
      }
    },
    Functions: Record<string, never>,
    Enums: Record<string, never>
  }
}

export type Tag = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export type Technology = {
  id: string
  name: string
  icon_url?: string | null
  created_at: string
  updated_at: string
}

export type Project = Database['public']['Tables']['projects']['Row'] & {
  technologies?: Technology[]
}

export type BlogPost = Database['public']['Tables']['posts']['Row'] & {
  tags?: Tag[]
  author?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
} 