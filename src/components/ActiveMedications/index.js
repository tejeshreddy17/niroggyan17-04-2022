import {Component, useCallback} from 'react'

import Loader from 'react-loader-spinner'

import jspdf from "jspdf"



import './index.css'


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

class MedicationPage extends Component {
  state = {medicationData: {medications: []},apiStatus:apiStatusConstants.initial,pdfFile:""}

  componentDidMount() {
    this.gettingDetails()
  }

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

  generatingPdf =  () =>{
    
    var pdf = new jspdf("l", "mm", [1340,1300]);

    const pdfCode = document.querySelector("#smartRxReport")

    const pdfSaved =  pdf.html(pdfCode, {
      callback: async function(doc) {
        
        pdf.save("sample.pdf",pdfCode)

        const apiUrl = 'https://niroggyanbackend.herokuapp.com/'

        const html = pdfCode.outerHTML

        const options = {
          
          method:"POST",

          body: html
         
          
        }

        const response = await fetch(apiUrl,options)

        console.log(response)

    
        
      },
      
    });


        
    

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

  render() {
    return (
      <div id="smartRxReport" className="app-background">
        {this.renderingUI()}
      </div>
    )
  }
}

export default MedicationPage
