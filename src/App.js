import {Switch, Route} from 'react-router-dom'

import './App.css'




import FormPage from "./components/SecondTask"

import UploadFiles from "./components/uploadFiles"

const App = () => (
  <Switch>
    <Route exact path="/" component={FormPage} />
    <Route exact path= "/upload" component={UploadFiles}/>
  </Switch>
)

export default App
