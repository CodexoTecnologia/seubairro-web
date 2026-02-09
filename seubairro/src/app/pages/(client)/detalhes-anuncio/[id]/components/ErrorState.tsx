import { BackButton } from '@/components/ui';

interface ErrorStateProps {
  message?: string | null;
}

export const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <main className="ad-page-container">
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <i className="ri-error-warning-line" style={{ 
          fontSize: '3rem', 
          color: '#EF4444' 
        }}></i>
        <h2 style={{ marginTop: '20px' }}>Anúncio não encontrado</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
          {message || 'O anúncio que você procura não existe ou foi removido.'}
        </p>
        <div style={{ marginTop: '20px' }}>
          <BackButton />
        </div>
      </div>
    </main>
  );
};
