function Greeting({ name }) {
  return (
    <div className="page-header">
      <h1>Good morning, {name || "User"} 👋</h1>
      <p>Here's your health snapshot for today.</p>
    </div>
  );
}

export default Greeting;