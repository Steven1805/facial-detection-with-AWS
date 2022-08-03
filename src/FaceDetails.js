import React from 'react';

export default function FaceDetails(props) {
    return (
        <>
            {Object.keys(props.ligne).map((val)=>{
                return <p>{val}: {props.ligne[val].toString()}</p>
            })}
        </>
    );
}
