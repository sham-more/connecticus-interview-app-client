import React from 'react'
import pageNotFound from "../assets/images/pagenotfound.png"

const NotFoundPage = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>

            <img style={{ width: "500px" }} src={pageNotFound} alt="401 Error" />

        </div>
    )
}

export default NotFoundPage