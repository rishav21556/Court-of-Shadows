export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-[url('/auth_background.png')] bg-cover bg-center min-h-screen"
    >
        <div className="bg-black/40 min-h-screen">
            {children}
        </div>
      
    </div>
  );
}