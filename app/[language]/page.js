import Navbar from "../components/Navbar/Navbar";
import HomeNavbar from "../components/Navbar/HomeNavbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import About from "../components/About us/About";
import Contact from "../components/Contact us/Contact";
import Footer from "../components/Footer/Footer";

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <Navbar>
        <HomeNavbar />
      </Navbar>

      <Hero />
      <Features />
      <About />
      <Contact />

      <Footer />
    </>
  );
}
