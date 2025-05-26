import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 미리 선언 - 개발 모드에서 URL 없이도 동작하도록
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

// 환경 변수가 설정된 경우에만 클라이언트 생성
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log("Supabase 클라이언트가 성공적으로 초기화되었습니다.");
  } catch (error) {
    console.error("Supabase 클라이언트 생성 중 오류가 발생했습니다:", error);
  }
} else {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 추가하세요.');
}

// SchemaName 타입을 Database의 키로부터 추출 (위치 이동)
type SchemaName = Extract<keyof Database, string>;

// 내부 헬퍼 함수: 특정 옵션으로 Supabase 클라이언트 생성
function _createConfiguredClient(options?: SupabaseClientOptions<SchemaName>): ReturnType<typeof createClient<Database>> {
  // 함수 내부에서 URL과 Key 존재를 재확인하고, 없으면 에러 발생
  if (!supabaseUrl || !supabaseAnonKey) {
    // 이전에 console.warn을 사용했지만, 여기서는 에러를 던져서 클라이언트 생성이 불가능함을 명확히 함
    throw new Error("Supabase URL and Anon Key are required to create a configured client.");
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey, options);
}

// 더미 클라이언트 생성 (환경 변수가 없는 경우 사용)
export const supabase = supabaseClient || {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
      error: null,
    }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      order: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  }),
} as any;

// Helper function to get authenticated supabase client
export function getServerSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요. 더미 클라이언트를 반환합니다.');
    return supabase; // 더미 반환
  }
  return _createConfiguredClient({
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Authentication with JWT token
export function getAuthenticatedSupabase(token: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요. 더미 클라이언트를 반환합니다.');
    return supabase; // 더미 반환
  }
  return _createConfiguredClient({
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
} 