import { supabase } from "./supabase";
import type { Project, Technology, Database } from "@/types/supabase";

// 프로젝트-기술 관계 테이블의 행 타입
// interface ProjectTechRelation {
// technology_id: string;
// }

// 프로젝트의 기술 스택을 가져오는 헬퍼 함수
// async function _getTechnologiesForProject(projectRow: Database['public']['Tables']['projects']['Row']): Promise<Technology[]> {
// console.log(`프로젝트 "${projectRow.title}"의 기술 스택 데이터 요청...`);
// try {
// const { data: techRelations, error: relError } = await supabase
// .from("projects_technologies")
// .select("technology_id")
// .eq("project_id", projectRow.id);
//
// if (relError) {
// console.error(`프로젝트 ${projectRow.id}와 기술 스택 관계를 가져오는 중 오류:`, relError);
// return [];
// }
//
// if (!techRelations || techRelations.length === 0) {
// console.log(`프로젝트 "${projectRow.title}"에 연결된 기술 스택이 없습니다.`);
// return [];
// }
//
// const techIds = techRelations.map((rel: ProjectTechRelation) => rel.technology_id);
// console.log(`프로젝트 "${projectRow.title}"에 ${techIds.length}개의 기술 스택 ID를 찾았습니다.`);
//
// const { data: technologies, error: techError } = await supabase
// .from("technologies")
// .select("id, name, icon_url")
// .in("id", techIds);
//
// if (techError) {
// console.error(`기술 스택 세부 정보를 가져오는 중 오류:`, techError);
// return [];
// }
//
// console.log(`프로젝트 "${projectRow.title}"에 ${technologies?.length || 0}개의 기술 스택을 가져왔습니다.`);
// return technologies || [];
// } catch (err) {
// console.error(`프로젝트 ${projectRow.id}의 기술 스택을 처리하는 중 예외 발생:`, err);
// return [];
// }
// }

export async function getProjects(): Promise<Project[]> {
  try {
    console.log("프로젝트 데이터 요청 시작 (N+1 최적화 시도)...");
    
    const { data: projectsData, error } = await supabase
      .from("projects")
      .select(`
        id,
        created_at,
        title,
        slug,
        description,
        cover_image_url,
        github_url,
        live_url,
        is_featured,
        sort_order,
        technologies (id, name, icon_url) /* Supabase 관계명에 따라 수정 필요 */
      `)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("프로젝트 및 기술스택 데이터를 가져오는 중 오류:", error);
      return [];
    }

    if (!projectsData || projectsData.length === 0) {
      console.log("가져온 프로젝트가 없습니다.");
      return [];
    }

    console.log(`${projectsData.length}개의 프로젝트와 관련 기술 스택을 가져왔습니다.`);

    return projectsData.map((p: Database['public']['Tables']['projects']['Row'] & { technologies?: Technology[] | null }) => ({
      ...p,
      technologies: p.technologies || [] 
    })) as Project[];

  } catch (error) {
    console.error("getProjects 함수에서 예외 발생 (N+1 최적화 시도 중):", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    console.log(`슬러그 "${slug}"로 프로젝트 데이터 요청 (N+1 최적화 시도)...`);
    
    const { data: projectData, error } = await supabase
      .from("projects")
      .select(`
        id,
        created_at,
        title,
        slug,
        description,
        cover_image_url,
        github_url,
        live_url,
        is_featured,
        sort_order,
        technologies (id, name, icon_url) /* Supabase 관계명에 따라 수정 필요 */
      `)
      .eq("slug", slug)
      .single();

    if (error || !projectData) {
      console.error(`슬러그 ${slug}로 프로젝트를 가져오는 중 오류:`, error);
      return null;
    }

    console.log(`프로젝트 "${projectData.title}"와 관련 기술 스택을 가져왔습니다.`);
    
    // projectData가 단일 객체이므로, 타입은 Database['public']['Tables']['projects']['Row'] & { technologies?: Technology[] | null }
    // 타입 단언 시 이 점을 명확히 함
    const typedProjectData = projectData as Database['public']['Tables']['projects']['Row'] & { technologies?: Technology[] | null };

    return {
      ...typedProjectData,
      technologies: typedProjectData.technologies || []
    } as Project;

  } catch (error) {
    console.error(`슬러그 ${slug}의 getProjectBySlug 함수에서 예외 발생 (N+1 최적화 시도 중):`, error);
    return null;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    console.log("주요 프로젝트 데이터 요청 시작 (N+1 최적화 시도)...");
    
    const { data: projectsData, error } = await supabase
      .from("projects")
      .select(`
        id,
        created_at,
        title,
        slug,
        description,
        cover_image_url,
        github_url,
        live_url,
        is_featured,
        sort_order,
        technologies (id, name, icon_url) /* Supabase 관계명에 따라 수정 필요 */
      `)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("주요 프로젝트 및 기술스택 데이터를 가져오는 중 오류:", error);
      return [];
    }

    if (!projectsData || projectsData.length === 0) {
      console.log("가져온 주요 프로젝트가 없습니다.");
      return [];
    }

    console.log(`${projectsData.length}개의 주요 프로젝트와 관련 기술 스택을 가져왔습니다.`);

    return projectsData.map((p: Database['public']['Tables']['projects']['Row'] & { technologies?: Technology[] | null }) => ({
      ...p,
      technologies: p.technologies || []
    })) as Project[];

  } catch (error) {
    console.error("getFeaturedProjects 함수에서 예외 발생 (N+1 최적화 시도 중):", error);
    return [];
  }
} 