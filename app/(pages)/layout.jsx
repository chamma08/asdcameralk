import Footer from "../components/Footer";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Redbar from "../components/Redbar";

export default function Layout({ children }) {
  return (
    <main>
      <Redbar />
      <Header />
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
