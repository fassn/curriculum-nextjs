import AboutMe from './components/about-me'
import Curriculum from './components/curriculum'
import ILove from './components/i-love'
import WrappedContactForm from './components/contact-form'
import Projects from './components/projets'

export default function Home() {
  return (
    <>
      <AboutMe />

      <Projects />

      <Curriculum />

      <ILove />

      <WrappedContactForm />
    </>
  )
}
