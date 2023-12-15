import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

//Styles 
import './policy.css'

export default function Policy() {
  
  if (typeof window !== 'undefined') {
    return (
      <>
          <Navbar/>
          <div className="policy-container">
              <div className="policy-container-box">
                  <iframe className="policy-iframe" src="https://app.termly.io/document/privacy-policy/5b729288-2222-4215-8bc1-3c3052fab36d"/>
              </div>
          </div>
          <Footer/>
      </>
    )
  }
}
