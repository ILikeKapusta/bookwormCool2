"use client"

import Navbar from '@/components/navbar'
import BookDisplay from "@/components/bookdisplay";

// styles 
import './search.css'
import { useSearchParams } from 'next/navigation';

const Search = () => {
  const searchParams = useSearchParams()
  let search = searchParams.get('query')
  
  return (
    <>
      <body>
      <Navbar/>
        <section>
          <div className="search-Main-Section">
            <BookDisplay bookreview={false} filtertoggle={true} viewalltoggle={false} search={search} title={search ? `Searching for: ${search}` : ''} amount_visable={50}/>
          </div>
        </section>
      </body>
    </>
  )}

export default Search
