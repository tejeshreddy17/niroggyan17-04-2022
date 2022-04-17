import { useState } from "react"

import "../SecondTask/index.css"

const UploadFiles = () => {

    const [file,setFile] = useState();

    const reader = new FileReader()

    const updatingFile = event =>{
        setFile(event.target.files[0])
    }

    let finalList =[]

    const onUploading = (event) =>{
        if(file){
            reader.onload = function(event){
                const CSVOutput = event.target.result
                csvtoObject(CSVOutput.split("\n"))
            }
            reader.readAsText(file)
        }
    }

    const csvtoObject = (csv) =>{
        
        const headers = csv[0].split(",")
        for (var i=1; i< csv.length-1; i++){
            let object = {}
            const ItemsinCUrrentLine = csv[i].split(",")
            for (var j=0; j<ItemsinCUrrentLine.length;j++){
                object[headers[j]] = ItemsinCUrrentLine[j]               
            }

            finalList.push(object)
        }
        console.log(finalList)

        

    }

    
    const gettingSmartReport = () =>{

        const gettingEachSmartReport = async (eachData) =>{

            eachData["sendbase64"] = true
        const options = {
            method:"POST",
            body:JSON.stringify(finalList),
          }
          const response = await fetch("https://rnxsohimg1.execute-api.ap-south-1.amazonaws.com/Production/testproxy",options)      
          const data = await response.json()
          const {pdfData} = data
          const downloadPDF= (pdf) => {
            const linkSource = `data:application/pdf;base64,${pdf}`
            const downloadLink = document.createElement("a")
            const fileName = "Report.pdf"
            downloadLink.href = linkSource
            downloadLink.download = fileName
            downloadLink.click()}
          downloadPDF(pdfData)

        }
        finalList.map(eachData=> gettingEachSmartReport(eachData))

        

    }

    return(
        <div className="upload-section">
        <input className="input-style" onChange={updatingFile} type = "file" accept={'.csv'}/>
        <div className='buttons'>
        <button className='print-button' onClick={onUploading}>Upload</button>
        <button className='print-button' onClick={gettingSmartReport} >GetSmartReport</button>
        </div>
    </div>
    )
}
    


export default UploadFiles