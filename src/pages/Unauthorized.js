import React from 'react'
import unauthorized from "../assets/images/401.png"

const Unauthorized = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>

            <img style={{ width: "500px" }} src={unauthorized} alt="401 Error" />

        </div>
    )
}

export default Unauthorized