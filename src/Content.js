import React, { useState, useRef } from 'react';
import './index.css';

import { RekognitionClient, DetectFacesCommand } from '@aws-sdk/client-rekognition';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { FaceDetailsInfo } from './FaceDetailsInfo';


function Content() {

    const REGION = "eu-west-2";
    const client = new RekognitionClient({
        region: REGION,
        credentials: fromCognitoIdentityPool({
            client: new CognitoIdentityClient({ region: REGION}),
            identityPoolId: "eu-west-2:371cdf1c-657e-4e3f-a6a0-3cdcf905bfdc"
        })
    }) 

    const [file, setFile] = useState(null);
    let cvs = useRef(null);
    let fileOnChange = (event) => {
        setFile(event.target.files[0])
   }

   let convertBase64ToBytes = (base64) => {
    let image = atob(base64.split(",")[1]);
    let imageBytes = new ArrayBuffer(image.length);
    let ua = new Uint8Array(imageBytes);
    for (var i=0;i<image.length;i++){
        ua[i] = image.charCodeAt(i);
    }
    return ua;
   }

   const [detail, setDetail] = useState({});
   const [readerURL, setReaderURL] = useState(null);
    let detectFace = () => {
     if(file){
        let fileReader = new FileReader();
        fileReader.onload = async (e) => {
            const { result } = e.target;
            let params = {
                "Attributes": ["ALL"],
                Image: {
                    Bytes: convertBase64ToBytes(result)
                }
            }
            
            let command = new DetectFacesCommand(params);
            client.send(command).then((details)=>{
                console.log(details);
                let ctx = cvs.current.getContext("2d");
                let img = new Image();
                img.src = result;
                img.onload = ()=>{
                    var max_width = 500;
                    var max_height = 700;
                    var width = img.width;
                    var height = img.height;
    
                    if (width > height) {
                        if (width > max_height) {
                            width *= max_width / height;
                            height = max_width;
                        } else {
                            if (height > max_height) {
                                width *= max_height / height;
                                height = max_height;
                            }
                        }
                    }

                    ctx.drawImage(img,0,0,width,height);
                    ctx.strokeStyle ="yellow";
                    var h = details.FaceDetails[0].BoundingBox.Height * height;
                    var l = details.FaceDetails[0].BoundingBox.Left * width;
                    var t = details.FaceDetails[0].BoundingBox.Top * height;
                    var w = details.FaceDetails[0].BoundingBox.Width * width;
                    ctx.strokeRect(l,t,w,h);
                }
                setDetail(details.FaceDetails[0]);
            }).catch((err)=>console.log(err))          
        }
        fileReader.readAsDataURL(file);
     }
    }

    return(
        <div>
            <div className='container'>
                <input type="file" className='upload-box' onChange={fileOnChange}/>
                <button className='button' onClick={detectFace}>BROWSE </button>
            </div>
            <div className='containt'>
            <canvas ref={cvs} width="500" height="700"></canvas>
            <FaceDetailsInfo detail={detail}/>
            </div>
        </div>
        ); 
}
export default Content;
