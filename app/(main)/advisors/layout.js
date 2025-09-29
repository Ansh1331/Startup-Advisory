export const metadata = {
  title: "Find Advisors - StartupConnect",
  description: "BBrowse and book sessions with top startup advisors.",
};

export default async function AdvisorsLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}
