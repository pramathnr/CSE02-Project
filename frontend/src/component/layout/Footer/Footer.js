import React from 'react'
import "./Footer.css";

const Footer = () => {
  return (
    <footer className='footer'>
        <div className='leftFooter'>
            <h4>Download our App</h4>
            <p>Download app for Android and IOS</p>
            <img src="https://woosports.com/wp-content/uploads/2020/07/toppng.com-android-app-store-app-store-and-android-icons-2145x1493-1.png" alt=""/>
            <img src='https://woosports.com/wp-content/uploads/2020/07/toppng.com-android-app-store-app-store-and-android-icons-2145x1493-copy.png' alt=''/>
        </div>
        <div className='midFooter'>
            <h1>MYKART</h1>
            <p>High quality is our first priority</p>
            <p>Copyright 2022 &copy;PNR </p>
        </div>
        <div className='rightFooter'>
            <h4>Follow Us</h4>
            <a href='#'>Instagram</a>
            <a href='#'>Facebook</a>
            <a href='#'>Linkedin</a>
        </div>
    </footer>
  )
}

export default Footer