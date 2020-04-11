import React from 'react'
import {NavLink} from 'react-router-dom'
import './Nav.css'

function Nav() {
    return (
        <nav className="navBar">
                <ul>
                    <li><NavLink exact to="/">Home</NavLink></li>
                    <li><NavLink exact to="/graddesc">Gradient Descent</NavLink></li>
                    <li><NavLink exact to="/contact">Contact</NavLink></li>
                </ul>
            </nav>
    )
}

export default Nav