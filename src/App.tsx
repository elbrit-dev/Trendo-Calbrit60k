import Header from './components/Header'
import Hero from './components/Hero'
import Calbrit60K from './components/Calbrit60K'
import About from './components/About'
import Portfolio from './components/Portfolio'
import RegistrationForm from './components/form/RegistrationForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a
        href="#register"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to registration
      </a>
      <Header />
      <main>
        <Hero />
        <Calbrit60K />
        <About />
        <Portfolio />
        <RegistrationForm />
      </main>
      <Footer />
    </>
  )
}
