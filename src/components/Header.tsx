import { renderItalics } from "../utils/renderItalics";

interface HeaderProps {
  title: string;
  lead: string;
}

export function Header({ title, lead }: HeaderProps) {
  return (
    <header className="page-header-box">
      <div className="container">
        <h1 className="display-4 mb-2">{title}</h1>
        {/* Pages whose lead has not been written yet get the title alone
            rather than an empty paragraph. */}
        {lead && <p className="lead mb-0">{renderItalics(lead)}</p>}
      </div>
    </header>
  );
}
