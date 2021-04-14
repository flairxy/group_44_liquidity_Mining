import React, { useEffect, useState } from 'react'
import './Admin.css'

export const Admin = ({ contracts }) => {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPool, setTotalPool] = useState(0)
  useEffect(() => {
    const init = async () => {
      const [users, totalPool] = await Promise.all([
        contracts.liquidityPool.methods.getUsers().call(),
        contracts.liquidityPool.methods.totalPool().call(),
        contracts.liquidityPool.methods.totalPool().call(),
      ])
      setTotalUsers(users.length)
      setTotalPool(totalPool)
    }
    init()
    // eslint-disable-next-line
  }, [])
  return (
    <div className="admin">
      <div className="card">
        <div className="analytic">
          <h5>Total Pool Balance (UTK)</h5>
          <h1>{totalPool}</h1>
        </div>

        <div className="analytic">
          <h5>Total Users</h5>
          <h1>{totalUsers}</h1>
        </div>
      </div>
    </div>
  )
}
