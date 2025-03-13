import Navbar from "../components/Navbar/Navbar";
import HomeNavbar from "../components/Navbar/HomeNavbar";
import Hero from "../components/Hero/Hero";

export default function Home() {

  return (
    <>
      <Navbar>
        <HomeNavbar />
      </Navbar>

      <Hero />
    </>
  );
}
