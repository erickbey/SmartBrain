import React from 'react';
import './FaceRecognition.css';

function FaceRecognition({ imageUrl, boxCoordinates }) {
  return (
    <div className='center'>
      <div className='absolute mt2'>
        <img id='inputImage' src={imageUrl} alt='' width='500px' height='auto' />
        <div className='bounding-box' style={{top: boxCoordinates.topRow, right: boxCoordinates.rightColumn, bottom: boxCoordinates.bottomRow, left: boxCoordinates.leftColumn}} ></div>
      </div>
    </div>
  )
}


export default FaceRecognition



