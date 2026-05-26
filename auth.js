// Supabase クライアント（supabase-config.js より後に読み込むこと）
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const auth = {
  // ログイン中のセッションを取得
  getSession: async () => {
    const { data } = await sb.auth.getSession();
    return data.session;
  },

  // GitHub OAuth ログイン
  signInWithGitHub: async () => {
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin + '/mypage.html' }
    });
    if (error) throw error;
  },

  // メール + パスワード ログイン
  signInWithEmail: async (email, password) => {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  // 新規登録
  signUp: async (email, password) => {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + '/mypage.html' }
    });
    if (error) throw error;
    return data;
  },

  // ログアウト
  signOut: async () => {
    await sb.auth.signOut();
    window.location.href = 'BetaLink.html';
  },

  // 認証状態の変化を監視
  onChange: (cb) => sb.auth.onAuthStateChange(cb),
};

// ナビゲーションのログイン状態を更新（各ページ共通）
async function updateNavAuth() {
  const session = await auth.getSession();
  const loginBtn  = document.getElementById('navLoginBtn');
  const userArea  = document.getElementById('navUserArea');
  if (!loginBtn && !userArea) return;

  if (session) {
    const u = session.user;
    const avatar   = u.user_metadata?.avatar_url;
    const username = u.user_metadata?.user_name || u.email?.split('@')[0] || 'user';
    if (loginBtn)  loginBtn.classList.add('hidden');
    if (userArea) {
      userArea.classList.remove('hidden');
      const img  = userArea.querySelector('img');
      const name = userArea.querySelector('[data-username]');
      if (img)  img.src = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
      if (name) name.textContent = `@${username}`;
    }
  } else {
    if (loginBtn)  loginBtn.classList.remove('hidden');
    if (userArea)  userArea.classList.add('hidden');
  }
}
