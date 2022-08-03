import FaceDetails from "./FaceDetails";
import React from "react";

export function FaceDetailsInfo(props){
    let fields = ["BoundingBox", "AgeRange", "Smile", "Eyeglasses", "Sunglasses", "Gender", "Beard", "Mustache","EyesOpen", "MouthOpen"];
    return(
        <div>
            {Object.keys(props.detail).length!==0 && fields.map((val)=>{
                return (
                    <div className="card-contains">
                        <b>{val}</b>
                        <FaceDetails ligne={props.detail[val]} />
                    </div>
                )
            })}
        </div>
    )
}