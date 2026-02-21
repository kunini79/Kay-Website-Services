import '../../system/globals.css';

export default function ThinkBoxProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="thinkbox-root"
      data-theme="light"
      style={{
        backgroundColor: '#F7F7F7',
        minHeight: '100vh',
        colorScheme: 'light',
      }}
    >
      {children}
    </div>
  );
}
