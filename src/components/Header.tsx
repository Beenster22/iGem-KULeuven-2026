interface HeaderProps {
  title: string;
  lead: string;
}

export function Header({ title, lead }: HeaderProps) {
  return (
    <header className="page-header-box">
      <div className="container">
        <h1 className="display-4 mb-2">{title}</h1>
        <p className="lead mb-0">{lead}</p>
      </div>
    </header>
  );
}
