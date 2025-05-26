import { supabase } from "./supabase";
import type { BlogPost, Tag, Database } from "@/types/supabase";

// 태그 관계 테이블의 행 타입
// interface PostTagRelation {
// tag_id: string;
// }

// 게시글의 태그를 가져오는 헬퍼 함수
// async function _getTagsForPost(postRow: Database['public']['Tables']['posts']['Row']): Promise<Tag[]> {
// console.log(`포스트 "${postRow.title}"의 태그 데이터 요청...`);
// try {
// const { data: tagRelations, error: relError } = await supabase
// .from("posts_tags")
// .select("tag_id")
// .eq("post_id", postRow.id);
//
// if (relError) {
// console.error(`포스트 ${postRow.id}와 태그 관계를 가져오는 중 오류:`, relError);
// return [];
// }
//
// if (!tagRelations || tagRelations.length === 0) {
// console.log(`포스트 "${postRow.title}"에 연결된 태그가 없습니다.`);
// return [];
// }
//
// const tagIds = tagRelations.map((rel: PostTagRelation) => rel.tag_id);
// console.log(`포스트 "${postRow.title}"에 ${tagIds.length}개의 태그 ID를 찾았습니다.`);
//
// const { data: tags, error: tagError } = await supabase
// .from("tags")
// .select("id, name")
// .in("id", tagIds);
//
// if (tagError) {
// console.error(`태그 세부 정보를 가져오는 중 오류:`, tagError);
// return [];
// }
// console.log(`포스트 "${postRow.title}"에 ${tags?.length || 0}개의 태그를 가져왔습니다.`);
// return tags || [];
// } catch (err) {
// console.error(`포스트 ${postRow.id}의 태그를 처리하는 중 예외 발생:`, err);
// return [];
// }
// }

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    console.log("블로그 포스트 데이터 요청 시작 (N+1 최적화 시도)...");

    const { data: postsData, error } = await supabase
      .from("posts")
      .select(`
        id,
        created_at,
        title,
        slug,
        excerpt,
        cover_image_url,
        content,
        is_published,
        published_at,
        author_id, 
        tags (id, name),
        users (id, username, avatar_url) /* 'users'는 author 테이블/관계명에 따라 수정 */
      `)
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("블로그 포스트 및 관련 데이터(태그, 작성자)를 가져오는 중 오류:", error);
      return [];
    }

    if (!postsData || postsData.length === 0) {
      console.log("게시된 블로그 포스트가 없습니다.");
      return [];
    }

    console.log(`${postsData.length}개의 블로그 포스트와 관련 세부 정보를 가져왔습니다.`);

    type PostWithDetailsFromDb = Database['public']['Tables']['posts']['Row'] & { 
      tags?: Tag[] | null;
      users?: { id: string; username: string; avatar_url: string; } | null; // users는 단일 객체 또는 null
    };

    return (postsData as PostWithDetailsFromDb[]).map((p) => {
      const authorData = p.users ? { id: p.users.id, name: p.users.username, avatar_url: p.users.avatar_url } : undefined;
      return {
        ...p,
        tags: p.tags || [],
        author: authorData,
        // posts 테이블의 필드와 BlogPost 타입의 필드를 일치시켜야 함
        // 예를 들어 BlogPost에 content가 없다면 제거하거나, DB의 content를 BlogPost.content에 매핑
      } as BlogPost; // 최종적으로 BlogPost 타입으로 변환 보장
    });

  } catch (error) {
    console.error("getBlogPosts 함수에서 예외 발생 (N+1 최적화 시도 중):", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log(`슬러그 "${slug}"로 블로그 포스트 데이터 요청 (N+1 최적화 시도)...`);
    
    const { data: postData, error } = await supabase
      .from("posts")
      .select(`
        id,
        created_at,
        title,
        slug,
        excerpt,
        cover_image_url,
        content,
        is_published,
        published_at,
        author_id,
        tags (id, name),
        users (id, username, avatar_url) /* 'users'는 author 테이블/관계명에 따라 수정 */
      `)
      .eq("slug", slug)
      .single();

    if (error || !postData) {
      console.error(`슬러그 ${slug}로 블로그 포스트를 가져오는 중 오류:`, error);
      return null;
    }

    console.log(`포스트 "${postData.title}"와 관련 세부 정보를 가져왔습니다.`);
    
    type PostWithDetailsFromDbSingle = Database['public']['Tables']['posts']['Row'] & { 
      tags?: Tag[] | null;
      users?: { id: string; username: string; avatar_url: string; } | null; 
    };
    
    const typedPostData = postData as PostWithDetailsFromDbSingle;
    const authorData = typedPostData.users ? { id: typedPostData.users.id, name: typedPostData.users.username, avatar_url: typedPostData.users.avatar_url } : undefined;

    return {
      ...typedPostData,
      tags: typedPostData.tags || [],
      author: authorData,
    } as BlogPost;

  } catch (error) {
    console.error(`슬러그 ${slug}의 getBlogPostBySlug 함수에서 예외 발생 (N+1 최적화 시도 중):`, error);
    return null;
  }
} 