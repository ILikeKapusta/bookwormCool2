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
                  <iframe className="policy-iframe" src="https://app.termly.io/document/terms-of-service/608cf7b9-f2ed-414e-b749-f92948ea5282"/>
              </div>
          </div>
          <Footer/>
      </>
    )

  }
}