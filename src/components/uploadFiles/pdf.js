import React from 'react';
import Pdf from "react-to-pdf";

const ref = React.createRef();

const PDF = (props) =>  (
    <div className="Post" ref={ref}>
        <h1>Hi</h1>
        <Pdf targetRef={ref} filename="post.pdf">
        {({ toPdf }) => <button onClick={toPdf}>Capture as PDF</button>}
      </Pdf>
      </div>
)
  


export default PDF