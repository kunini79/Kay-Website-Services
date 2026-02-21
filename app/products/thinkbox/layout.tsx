import '../../system/globals.css';

export default function ThinkBoxProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="thinkbox-root" style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>{children}</div>;
}
