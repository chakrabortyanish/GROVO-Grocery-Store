import React from 'react'
import "./AppDownload.css"

import {appstore,
googleplay,
mobile} from "../../assets/index.js"

const AppDownload = () => {
  return (
    <div className="AppDownload">
      <div className='download-container'>
        <div className="mobile">
          <img src={mobile} alt="mobile" />
        </div>
        <div className="content">
           <h1 className="title">Download App</h1>
           <p>Grocery shopping made easier. Now, you don't need to open the website for placing orders. Download the Grovo app from Play Store and App Store to start shopping easily and faster.</p>
           <div className="happy-shopping">HAPPY SHOPPING!</div>
           <div className="logos">
              <img src={appstore} alt="appstore" onClick={()=> alert("This project is for display purposes only. The app is not available for download.")}/>
              <img src={googleplay} alt="googleplay" onClick={()=> alert("This project is for display purposes only. The app is not available for download.")}/>
           </div>
        </div>
    </div>
    </div>
  )
}

export default AppDownload
