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
    </main>
  );
};

export default Home;
