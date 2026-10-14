export default function Perfil() {
  return (
    <section className="container section-page">
      <span className="mono page-eyebrow">SUA ÁREA</span>
      <h1>Perfil</h1>
      <p className="page-intro">Esta área vai reunir suas informações e seu progresso de estudos.</p>

      <article className="profile-placeholder-card">
        <div className="profile-avatar" aria-hidden="true">P</div>
        <div>
          <h2>Seu perfil</h2>
          <p>O perfil ainda não está conectado a um sistema de autenticação. Quando essa etapa for implementada, você poderá acompanhar seu progresso e salvar seus resultados aqui.</p>
          <span className="profile-status">Perfil demonstrativo · sem login ativo</span>
        </div>
      </article>
    </section>
  );
}
