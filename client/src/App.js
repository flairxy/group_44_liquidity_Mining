import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar } from './components'
import { Zap, Admin } from './pages'
import { getWeb3, getContracts } from './utils'

import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [web3, setWeb3] = useState(undefined)
  const [accounts, setAccounts] = useState([])
  const [contracts, setContracts] = useState(undefined)
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async () => {
    if (isConnected) return
    const web3 = await getWeb3()
    const contracts = await getContracts(web3)
    const accounts = await web3.eth.getAccounts()
    setWeb3(web3)
    setContracts(contracts)
    setAccounts(accounts)
    setIsConnected(true)
  }

  return (
    <div className="App">
      <Router>
        <Navbar connectWallet={connectWallet} isConnected={isConnected} />
        {isConnected && (
          <Switch>
            {/* <Route exact path="/" component={Zap} /> */}
            <Route
              exact
              path="/"
              render={() => (
                <Zap web3={web3} accounts={accounts} contracts={contracts} />
              )}
            />
            <Route
              path="/admin"
              render={() => (
                <Admin contracts={contracts} />
              )}
            />
          </Switch>
        )}
      </Router>
    </div>
  )
}

export default App
