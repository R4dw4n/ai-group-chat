import Navbar from "../components/Navbar/Navbar";
import HomeNavbar from "../components/Navbar/HomeNavbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";

export default function Home() {

  return (
    <>
      {/* Navbar */}
      <Navbar>
        <HomeNavbar />
      </Navbar>

      {/* MAIN HERO SECTION */}
      <Hero />

      {/* FEATURES */}
      <Features />
    </>
  );
}
