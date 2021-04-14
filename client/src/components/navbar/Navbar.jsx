import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export const Navbar = ({ connectWallet, isConnected }) => {
  return (
    <nav>
      <b className="logo">FarmBin</b>

      <div className="nav-links">
        <Link to="/"> Farm </Link>
        <Link to="/admin"> Admin </Link>
      </div>

      <button className="connect-btn" onClick={connectWallet}>
        {isConnected ? 'Connected' : 'Connect Wallet'}
      </button>
    </nav>
  )
}
