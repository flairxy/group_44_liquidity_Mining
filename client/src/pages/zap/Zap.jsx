import React, { useEffect, useState } from 'react'
import './Zap.css'

export const Zap = ({ web3, accounts, contracts }) => {
  const [activeTab, setActiveTab] = useState('deposit')
  const [block, setBlock] = useState(0)
  const [lpBalance, setLpBalance] = useState(0)
  const [underTokenBalance, setUnderTokenBalance] = useState(0)
  const [govTokenBalance, setGovTokenBalance] = useState(0)
  const [amount, setAmount] = useState(0)

  const handleAction = async (e) => {
    e.preventDefault()
    if (activeTab === 'deposit') {
      await contracts.liquidityPool.methods
        .deposit(amount)
        .send({ from: accounts[0] })
      setAmount(0)
    } else {
      await contracts.liquidityPool.methods
        .withdraw(amount)
        .send({ from: accounts[0] })
      setAmount(0)
    }
  }

  const handleSetMax = (e) => {
    e.preventDefault()
    if (activeTab === 'deposit') {
      setAmount(underTokenBalance)
    } else {
      setAmount(lpBalance)
    }
  }

  useEffect(() => {
    const init = async () => {
      const [
        balance,
        checkpoint,
        underTokenBalance,
        govTokenBalance,
      ] = await Promise.all([
        contracts.liquidityPool.methods.balanceOf(accounts[0]).call(),
        contracts.liquidityPool.methods.checkpoints(accounts[0]).call(),
        contracts.liquidityPool.methods.underTokenBalance().call(),
        contracts.liquidityPool.methods.govTokenBalance().call(),
      ])
      setLpBalance(balance)
      setBlock(checkpoint)
      setUnderTokenBalance(underTokenBalance)
      setGovTokenBalance(govTokenBalance)
    }
    init()
    // eslint-disable-next-line
  }, [amount])

  if (
    typeof balance === 'undefined' &&
    typeof checkpoint === 'undefined' &&
    typeof underTokenBalance === 'undefined'
  ) {
    return <div>loading...</div>
  }

  return (
    <div className="zap">
      <div className="card">
        <div className="switch">
          {['deposit', 'withdraw'].map((tab, i) => {
            return (
              <button
                key={i}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? 'active-switch' : null}
              >
                {tab}
              </button>
            )
          })}
        </div>
        <div className="list-info">
          <span>Current Block:</span>
          <b>{block}</b>
        </div>
        <div className="list-info">
          <span>Reward Per Block:</span>
          <b>1</b>
        </div>
        <div className="list-info">
          <span>Total Deposits:</span>
          <b> {lpBalance} UTK</b>
        </div>
        <div className="list-info">
          <span>Governance Token Balance:</span>
          <b> {govTokenBalance} GTK</b>
        </div>
        <div className="list-info">
          <span>Liquidity Pool Token Balance:</span>
          <b> {lpBalance} LTK </b>
        </div>
        <div className="input-group">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter Amount in ${
              activeTab === 'deposit' ? 'UTK' : 'LTK'
            }`}
          />
          <button onClick={(e) => handleSetMax(e)}> Max </button>
        </div>
        <span className="available-balance">
          Available balance: {underTokenBalance}{' '}
          {activeTab === 'deposit' ? 'UTK' : 'LTK'}
        </span>
        <button className="connect-btn" onClick={(e) => handleAction(e)}>
          {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}
        </button>
      </div>
    </div>
  )
}
