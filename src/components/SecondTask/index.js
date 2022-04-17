import {Component, useCallback} from 'react'

import Loader from 'react-loader-spinner'

import jspdf from "jspdf"

import './index.css'
import jsPDF from 'jspdf'


const apiStatusConstants = {
  success:"success",
  failure:"failure",
  loading:"loading",
  initial:"initial"
}





const MedicineData = props => {
  const {medicine} = props
  return (
    <div className="medicine-container">
      <h1 className="tablet-name">{medicine.medication_name.toUpperCase()}</h1>
      <div className="sections">
        <div className="left-section">
          <p className="tablet-appearance">APPEARANCE</p>
          <img
            alt="tablet"
            className="tablet-image"
            src={medicine.image_side_A}
          />
          <p className="tablet-appearance">REASON FOR MEDICATION</p>
          <p className="medication_reason">{medicine.medication_reason}</p>
        </div>
        <div className="middle-section">
          <p className="tablet-appearance">DIRECTIONS / NOTES</p>
          <p className="directions-of-usage">{medicine.directions_to_use}</p>
          {medicine.detail_directions !== '' && (
            <p className="detailed-directions">{medicine.detail_directions}</p>
          )}
          <div className="tabletscontainer">
            {medicine.timings.map(timing => (
              <div className="tablets-container">
                {medicine.no_of_medications_to_be_consumed_at_a_time.map(
                  eachtime => (
                    <img
                      alt="tablet"
                      className="tablet-image"
                      src={medicine.image_side_A}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
          <div className="timingsContainer">
            {medicine.timings.map(timing => (
              <p>{timing}</p>
            ))}
          </div>
        </div>
        <div className="right-section">
          <p className="side-effects">POSSIBLE SIDE EFFECTS</p>
          {medicine.possible_side_effects.map(sideEffect => (
            <div className="side-effect-container">
              <img className="logo-capsule" src={sideEffect.logo} />
              <p className="side-effect-heading">{sideEffect.side_effect}</p>
            </div>
          ))}
          {medicine.medical_emergency_reasons !== '' && (
            <>
              <p className="medical-help-heading">GET MEDICAL HELP IF</p>
              <p className="medication_reason">
                {medicine.medical_emergency_reasons}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

class FormPage extends Component {
  state = {details:{}, name:"",age:"",dob:"",sex:"", passportno:"", 
  nationality:"",patientid:"",registrationdatetime:"",sidno:"",srfid:"",
  reportdate:"",reportdatetime:"",refby:"",type:"",icmrid:"",sampleCollectiondatetime:"",
  lab:"",testresult:"",ctvalueegene:"",ctvaluengene:"",ctvaluesgene:"",ctvaluedrp:"",ctvalueorf1a:"",ctvalueorf1b:"",getSmartReport:false}



  gettingDetails = async () => {
    this.setState({apiStatus:apiStatusConstants.loading})
    const apiUrl = 'https://niroggyanbackend.herokuapp.com/'
    const response = await fetch(apiUrl)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      this.setState({medicationData: data,apiStatus:apiStatusConstants.success})
    }
    else{
      this.setState({apiStatus:apiStatusConstants.failure})
    }
  }


  generatingPdf =  async () =>{
    const {details} = this.state
    console.log(JSON.stringify(details))

    const options = {
      method:"POST",
      body:JSON.stringify([details,]),
    }

    const response = await fetch("https://rnxsohimg1.execute-api.ap-south-1.amazonaws.com/Production/testproxy",options)
  

    const data = await response.json()

    const {pdfData} = data


    const downloadPDF= (pdf) => {
      const linkSource = `data:application/pdf;base64,${pdf}`;
      const downloadLink = document.createElement("a");
      const fileName = "Report.pdf";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();}

    downloadPDF(pdfData)
 
    

  }

  renderingUI = () =>{
    const {apiStatus} = this.state
    switch(apiStatus){
      case apiStatusConstants.success:
      return this.renderingContent()
      case apiStatusConstants.loading:
      return this.renderingLoader()
      case apiStatusConstants.failure:
      return this.renderingFailureView()
      default:
      return null
    }
  }

  renderingContent = () =>{
    const {medicationData} = this.state
    return (
      <>
        <nav className="header-container">
          <div className="header-main-heading-container">
            <h1 className="heading">Medications</h1>
            <div className="logo-container">
              <img
                className="logo-capsule"
                alt="capsule"
                src="https://res.cloudinary.com/tejeshreddy17/image/upload/v1648389940/pill-capsule_zbsv5x.png"
              />
              <h1 className="main-heading">
                Active Medications ({medicationData.medications.length})
              </h1>
            </div>
          </div>
          <div className="all-details-container">
            <button onClick={this.generatingPdf} className='print-button'>Print</button>
            <div className="details-container">
              <p className="sub-heading">Patient Name</p>
              <p className="patient-details">{medicationData.patient_name}</p>
            </div>
            <div className="details-container">
              <p className="sub-heading">Date of Birth</p>
              <p className="patient-details">{medicationData.date_of_birth}</p>
            </div>
            <div className="details-container">
              <p className="sub-heading">Date of Issue</p>
              <p className="patient-details">{medicationData.date_of_issue}</p>
            </div>
          </div>
        </nav>
        <hr className="border-line" />
        <div className="medication-container">
          {medicationData.medications.map(medicine => (
            <MedicineData key={medicine.medication_name} medicine={medicine} />
          ))}
        </div>
        </>
    )
  
  }

  renderingLoader = () => <Loader type ="ThreeDots" />

  renderingFailureView = () => (
    <div className="loader-container-home-posts">
      <img
        className="failure-view-image"
        src="https://res.cloudinary.com/tejeshreddy17/image/upload/v1643991735/alert-triangle_wwsh5r.jpg"
        alt="failure view"
      />
      <p className="failure-view-description">
        Something went wrong. Please try again
      </p>
      <button
        className="failure-view-button"
        onClick={this.gettingUserHomeDetails}
        type="button"
      >
        Try again
      </button>
    </div>
  )

  updatingName = event => {
    this.setState({name:event.target.value})
    
  }

  updatingAge = event => {
    this.setState({age:event.target.value})
    
  }

  updatingDOB = event =>{
    this.setState({dob:event.target.value})
  }

  updatingSex = event =>{
    this.setState({sex:event.target.value})
  }

  updatingPassportID = event =>{
    this.setState({passportid:event.target.value})
  }

  updatingNationality = event =>{
    this.setState({nationality:event.target.value})
  }

  updatingPatientID = event =>{
    this.setState({patientid:event.target.value})
  }

  updatingRegistrationDateTime = event =>{
    this.setState({registrationdatetime:event.target.value})
  }

  updatingSIdNo = event =>{
    this.setState({sidno:event.target.value})
  }

  updatingSRFID = event =>{
    this.setState({srfid:event.target.value})
  }
  updatingReportDate = event =>{
    this.setState({reportdate:event.target.value})
  }
  updatingReportDateTime = event =>{
    this.setState({reportdatetime:event.target.value})
  }
  updatingReferBy = event =>{
    this.setState({refby:event.target.value})
  }
  updatingType = event =>{
    this.setState({type:event.target.value})
  }
  updatingICMRID = event =>{
    this.setState({icmrid:event.target.value})
  }
  updatingSampleCollectionDateTime = event =>{
    this.setState({sampleCollectiondatetime:event.target.value})
  }
  updatingLabName = event =>{
    this.setState({lab:event.target.value})
  }
  updatingTestResult = event =>{
    this.setState({testresult:event.target.value})
  }
  updatingCTValueEgene = event =>{
    this.setState({ctvalueegene:event.target.value})
  }
  updatingCTValueSgene = event =>{
    this.setState({ctvaluesgene:event.target.value})
  }
  updatingCTValueNgene = event =>{
    this.setState({ctvaluengene:event.target.value})
  }

  updatingCTValueDRP = event =>{
    this.setState({ctvaluedrp:event.target.value})
  }
  updatingCTValueORF1A = event =>{
    this.setState({ctvalueorf1a:event.target.value})
  }
  updatingCTValueORF1B = event =>{
    this.setState({ctvalueorf1b:event.target.value})
  }

  savingForm = (event) => {
    
    event.preventDefault()

    const {name,age,dob,sex, passportno, 
    nationality,patientid,registrationdatetime,sidno,srfid,
    reportdate,reportdatetime,refby,type,icmrid,sampleCollectiondatetime,
    lab,testresult,ctvalueegene,ctvaluengene,ctvaluesgene,ctvaluedrp,ctvalueorf1a} = this.state

    this.setState({details:{name,age,dob,sex, passportno, 
      nationality,patientid,registrationdatetime,sidno,srfid,
      reportdate,refby,type,icmrid,sampleCollectiondatetime,
      lab,testresult,ctvalueegene,ctvaluengene,ctvaluesgene,ctvaluedrp,ctvalueorf1a,sendbase64:true}})

    }


  renderingForm = () => {
    
    
    return(
        <>
          <form id = "smartId" className='form-style' onSubmit={this.savingForm} >
            <h1>Get Your Smart Report</h1>
            <div id = "smartId2" className='all-inputs-container'>
                <div className='input-container'>
                  <label className='label-style' htmlFor='patientName'>Patient Name</label>
                  <input placeholder='name' onChange={this.updatingName}  className='input-style' id = "patientName" type = "text"/>    
                </div> 
                <div className='input-container'>
                  <label className='label-style' htmlFor='Age'>Age</label>
                  <input placeholder='age' onChange={this.updatingAge}  className='input-style' id = "Age" type ="number"/>
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='patientName'>Date of Birth</label>
                  <input onChange={this.updatingDOB} className='input-style' id = "patientName" type = "date"/>    
                </div>
                <div className='input-container'> 
                <label className='label-style'>Sex</label>
                <div className='radio-container'>
                    <div className='radio-group-single'>
                      <label htmlFor='male'>Male</label>
                      <input onChange={this.updatingSex} type="radio" id = "male" value="Male" name='Sex'/>
                    </div>
                    <div className='radio-group-single'>
                      <label htmlFor='Female'>Female</label>
                      <input onChange={this.updatingSex} type="radio" id = "female" name='Sex' value="Female"/>
                      
                    </div>

                </div>
            
          
          
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Passport No'>Passport No</label>
                  <input placeholder='passport no' onChange={this.updatingPassportID} className='input-style' id = "Passport No" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Nationality'>Nationality</label>
                  <input placeholder='nationality' onChange={this.updatingNationality} className='input-style' id = "Nationality" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Patient ID' placeholder='id'>Patient ID</label>
                  <input placeholder='id' onChange={this.updatingPatientID} className='input-style' id = "Patient ID" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='patientName'>Registration Date & Time</label>
                  <input onChange={this.updatingRegistrationDateTime} className='input-style' id = "patientName" type = "datetime-local"/>    
                </div>
                <div className='input-container'>
                <label className='label-style' htmlFor='SID No'>SID No</label>
                <input placeholder='sid no' onChange={this.updatingSIdNo} className='input-style' id = "SID No" type = "text"/>    
                </div>   
                <div className='input-container'>
                  <label className='label-style' htmlFor='SRF ID'>SRF ID</label>
                  <input placeholder='srf no' onChange={this.updatingSRFID} className='input-style' id = "SRF ID" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Report Date'>Report Date</label>
                  <input onChange={this.updatingReportDate} className='input-style' id = "Report Date" type = "date"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Report Date & Time'>Report Date & Time</label>
                  <input onChange={this.updatingReportDateTime} className='input-style' id = "Report Date & Time" type ="datetime-local"/>
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Refer By'>Refer By</label>
                  <input placeholder='refer by' onChange={this.updatingReferBy} className='input-style' id = "Refer By" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Type'>Type</label>
                  <input placeholder='type' onChange={this.updatingType}className='input-style' id = "Type" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='patientName'>ICMR ID</label>
                  <input placeholder='icmr id' onChange={this.updatingICMRID} className='input-style' id = "patientName" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Sample Collected Date_Time'>Sample Collected Date & Time</label>
                  <input onChange={this.updatingSampleCollectionDateTime} className='input-style' id = "Sample Collected Date_Time" type ="datetime-local"/>
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Lab Name'>Lab Name</label>
                  <input placeholder='lab' onChange={this.updatingLabName} className='input-style' id = "Lab Name" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='Test Result'>Test Result</label>
                  <input placeholder='result' onChange={this.updatingTestResult} className='input-style' id = "Test Result" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='CT Value(E-gene)'>CT Value(E-gene)</label>
                  <input placeholder='e-gene value' onChange={this.updatingCTValueEgene} className='input-style' id = "CT Value(E-gene)" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='CT Value (N-gene)'>CT Value (S-gene)</label>
                  <input placeholder='n-gene value'  onChange={this.updatingCTValueNgene} className='input-style' id = "CT Value (S-gene)" type = "text"/>    
                </div>                
                <div className='input-container'>
                  <label className='label-style' htmlFor='CT Value (S-gene)'>CT Value (S-gene)</label>
                  <input placeholder='s-gene value'  onChange={this.updatingCTValueSgene} className='input-style' id = "CT Value (S-gene)" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='CT Value DRP'>CT Value DRP</label>
                  <input placeholder='drp' onChange={this.updatingCTValueDRP} className='input-style' id = "CT Value DRP" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='CT Value (ORF1A)'>CT Value (ORF1A)</label>
                  <input placeholder='orf1a' onChange={this.updatingCTValueORF1A} className='input-style' id = "CT Value (ORF1A)" type = "text"/>    
                </div>
                <div className='input-container'>
                  <label className='label-style' htmlFor='CT Value (ORF1B)'>CT Value (ORF1B)</label>
                  <input placeholder='orf1b' onChange={this.updatingCTValueORF1B} className='input-style' id = "CT Value (ORF1B)" type = "text"/>    
                </div>            
            </div>
            <div className='buttons'>
            <button className='print-button' type="submit">Save Report</button>
            <button className='print-button' onClick={this.generatingPdf}>Get Smart Report</button>
            </div>
          </form>
          
        </>
    )
    
  }
    
  
  render() {
    return (
      <div  className="app-background">
        {this.renderingForm()}
        
      </div>
      
    )
  }
}

export default FormPage

