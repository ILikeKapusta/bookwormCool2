"use client"

import './globals.css'
import { Inter, Rubik } from 'next/font/google'
import { AuthContextProvider } from '@/context/AuthContext'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const rubik = Rubik({subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-rubik'})


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Bookworm</title>
        <meta name="viewport" content="width=device-width"></meta>
      </head>
      <Script
      id='googleAnalytics'
      strategy='afterInteractive'
      src="https://www.googletagmanager.com/gtag/js?id=G-47MBYXCM17"
      />
      <Script
        id='googleAnalytics2'
        strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-47MBYXCM17');
        `}
      </Script>
      <Script 
        async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1173299949486738"
        crossorigin="anonymous">
     </Script>
    <AuthContextProvider>
      <body className={rubik.className}>
        {children}
      </body>
    </AuthContextProvider>
    </html>
  )
}
