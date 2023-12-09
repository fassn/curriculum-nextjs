import AboutMe from './components/curriculum/AboutMe'
import Experiences from './components/curriculum/Experiences'
import ILove from './components/curriculum/ILove'
import WrappedContactForm from './components/curriculum/ContactForm'
import Projects from './components/curriculum/Projects'

export default function Home() {
  return (
    <>
      <AboutMe />

      <Projects />

      <Experiences />

      <ILove />

      <WrappedContactForm />
    </>
  )
}
