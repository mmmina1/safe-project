function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/80 rounded-2xl shadow-xl border border-slate-700/60 px-8 py-10">
        <h1 className="text-2xl font-semibold text-slate-50 mb-2">회원가입</h1>
        <p className="text-sm text-slate-400 mb-6">
          스미싱 피해를 예방하고, 위험 패턴을 함께 기록해 나가요.
        </p>

        {/* 나머지 form 그대로 붙이면 됨 */}
      </div>
    </div>
  );
}

export default SignupPage;
