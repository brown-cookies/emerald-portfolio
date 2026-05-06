import { NavProvider } from '@/components/providers/NavProvider'
import { BgProvider }  from '@/components/providers/BgProvider'
import Navbar          from '@/components/layout/Navbar'
import Footer          from '@/components/layout/Footer'
import ParticlesBackground from '@/components/shared/ParticlesBackground'
import SectionTransition   from '@/components/shared/SectionTransition'
import SectionDots         from '@/components/shared/SectionDots'
import SectionCounter      from '@/components/shared/SectionCounter'
import Hero         from '@/components/sections/Hero'
import About        from '@/components/sections/About'
import Projects     from '@/components/sections/Projects'
import Skills       from '@/components/sections/Skills'
import Experience   from '@/components/sections/Experience'
import Testimonials from '@/components/sections/Testimonials'
import Contact      from '@/components/sections/Contact'

const SECTION_MAP = {
  hero:         <Hero />,
  about:        <About />,
  projects:     <Projects />,
  skills:       <Skills />,
  experience:   <Experience />,
  testimonials: <Testimonials />,
  contact: (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="flex-1"><Contact /></div>
      <Footer />
    </div>
  ),
}

export default function Home() {
  return (
    <BgProvider>
      <NavProvider>
        <ParticlesBackground />
        <Navbar />
        <SectionDots />
        <SectionCounter />
        <main className="h-[100dvh] overflow-hidden">
          <SectionTransition sections={SECTION_MAP} />
        </main>
      </NavProvider>
    </BgProvider>
  )
}
