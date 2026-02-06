'use client'
import Header from './components/header'
import Hero from './components/hero'
import InfoBar from './components/info-bar'
import Purpose from './components/purpose'
import ForWho from './components/for-who'
import Roadmap from './components/roadmap'
import Footer from '@/components/layout/footer'
import '@/styles/landingpage/landing.css'

export default function LandingPage() {
    return (
        <>
            <div className="map-grid-bg"></div>
            <div className="glow-spot top-center"></div>
            <Header />
            <main>
                <Hero />
                <InfoBar />
                <Purpose />
                <ForWho />
                <Roadmap />
            </main>
            <Footer />
        </>
    )
}
