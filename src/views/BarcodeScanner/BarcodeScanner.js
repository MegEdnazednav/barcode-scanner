import React, { useState } from 'react'
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
// import { BarcodeService } from '../services/barcode'

const BarcodeScanner = () => {
  const [ data, setData ] = useState();

  if (data) {
    console.log(data)
    // BarcodeService.markAsManufactured(data).then(res => {
    //   console.log(res)
    // })
  }

    return (
      <>
        <BarcodeScannerComponent
          width={500}
          height={500}
          onUpdate={(err, result) => {
            if (result) setData(result.text)
            // else setData('Not Found')
          }}
        />
        <p>{data}</p>

        <input type="text" />
      </>
    )
}
export default BarcodeScanner
