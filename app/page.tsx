import Footer from "@/components/footer";
import Link from "next/link";

// app/page.tsx
const Home = ({
  children
}:{
  children: React.ReactNode;
}) => {
  return (
    <main style={{ width: '30rem', height: '30rem'}}>
      {children}
      Main Page
      <br />
      <Link href="/gamewengine">
      Play with bot
      </Link>
      <br />
      <Link href="/gamewfriend">
        Play with friend (local)
      </Link>

      <Footer />
    </main>
  );
};

export default Home;
