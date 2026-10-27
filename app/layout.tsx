import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'成長志 · Student ERP',description:'Private student records, school results and learning progress.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body>{children}</body></html>}
