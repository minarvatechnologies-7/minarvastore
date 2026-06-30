export default function SetupScreen() {
  return (
    <div className="setup">
      <div className="setup-card">
        <div className="logo">MINARVA<span>.</span></div>
        <h1>Almost there</h1>
        <p>The store can't reach its database yet. Add your Supabase keys to finish setup.</p>
        <ol>
          <li>Open your project on Vercel → Settings → Environment Variables.</li>
          <li>Add <code>VITE_SUPABASE_URL</code> with your Supabase project URL.</li>
          <li>Add <code>VITE_SUPABASE_ANON_KEY</code> with your anon public key.</li>
          <li>Redeploy, then refresh this page.</li>
        </ol>
        <p className="setup-fine">Supabase keys are found under Project Settings → API.</p>
      </div>
    </div>
  )
}
