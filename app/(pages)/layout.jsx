import Footer from "../components/Footer";
import Header from "../components/Header";
import Redbar from "../components/Redbar";

export default function Layout({ children }) {
  return (
    <main>
      <Redbar />
      <Header />
      {children}
      <Footer />
    </main>
  );
}
