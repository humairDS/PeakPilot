import Sidebar from "./Sidebar";

function Layout({ children, profile }) {
  return (
    <div className="app-shell">
      <Sidebar profile={profile} />

      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}

export default Layout;