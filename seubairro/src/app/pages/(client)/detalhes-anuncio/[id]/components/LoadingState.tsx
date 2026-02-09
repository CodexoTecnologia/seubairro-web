export const LoadingState = () => {
  return (
    <div className="ad-page-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <i className="ri-loader-4-line" style={{ 
          fontSize: '3rem', 
          color: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }}></i>
        <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>
          Carregando anúncio...
        </p>
      </div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
