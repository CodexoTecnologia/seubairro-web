import { ImageResponse } from 'next/og'

export const alt = 'SeuBairro — Conecte-se ao comércio local'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          background: 'linear-gradient(135deg, #0B1226 0%, #0F1E45 45%, #1E3A8A 100%)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700 }}>
          Seu<span style={{ color: '#60A5FA' }}>Bairro</span>
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: 'rgba(255,255,255,0.9)' }}>
          A tecnologia a favor do comércio local
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>
          De vizinho para vizinho
        </div>
      </div>
    ),
    { ...size },
  )
}
