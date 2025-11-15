import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-contant">
            <div className="footer-contant-left">
                <img src={assets.logo} alt="" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem vel minus in optio, accusantium earum? Ducimus obcaecati tempora voluptate autem reiciendis, earum, corporis quae impedit atque saepe architecto dolor vel?</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-contant-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-contant-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91-1234567890</li>
                    <li>tomato@gmail.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className='footer-copyright'>Copyright 2024 Tomato.com - All Right Riserved</p>
    </div>
  )
}

export default Footer;
