import Sidebar from "./Sidebar";

function Layout({ children, profile }) {
  return (
    <div className="app-shell">
      <Sidebar profile={profile} />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;