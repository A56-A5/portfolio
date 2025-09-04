export const metadata = {
  title: 'Alvi AV — Terminal Portfolio',
  description: 'Dynamic terminal portfolio built with Next.js', 
  icons: {
    icon: '/icons/logo.png', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  );
}

