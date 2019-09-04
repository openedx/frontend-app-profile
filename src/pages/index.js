import React from "react"
import { Link } from "gatsby"


const IndexPage = () => (
  <>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>

    </div>
    <Link to="/profile/">Go to profile</Link>

    <Link to="/404/">go to 404</Link>
  </>
)

export default IndexPage
