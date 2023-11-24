import Navbar from './components/navbar'
import AboutMe from './components/about-me'
import Curriculum from './components/curriculum'
import ILove from './components/i-love'
import ContactForm from './components/contact-form'

export default function Home() {
  return (
    <>
      <Navbar />

      <AboutMe />

      <Curriculum />

      <ILove />

      <ContactForm />
    </>
  )
}
