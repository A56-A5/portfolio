export const metadata = {
  title: 'Alvi AV — Terminal Portfolio',
  description: 'Dynamic terminal portfolio built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

