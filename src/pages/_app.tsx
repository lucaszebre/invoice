import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { InvoiceProvider } from '@/context/InvoiceContext'
import { UserDataProvider } from '@/context/UserDataContext.tsx'
export default function App({ Component, pageProps }: AppProps) {


  return (
    <UserDataProvider>
    <InvoiceProvider>
  
      <Component {...pageProps} />
    </InvoiceProvider>
    </UserDataProvider>
  );
}
