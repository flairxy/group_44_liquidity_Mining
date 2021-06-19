const LiquidityPool = artifacts.require('LiquidityPool')
const UnderlyingToken = artifacts.require('UnderlyingToken')
const GovernanceToken = artifacts.require('GovernanceToken')

module.exports = async function (deployer, _network, accounts) {
  const [trader1] = accounts
  await Promise.all(
    [UnderlyingToken, GovernanceToken].map((contract) =>
      deployer.deploy(contract),
    ),
  )

  const [underlyingToken, governanceToken] = await Promise.all(
    [UnderlyingToken, GovernanceToken].map((contract) =>
      deployer.deploy(contract),
    ),
  )

  await deployer.deploy(
    LiquidityPool,
    underlyingToken.address,
    governanceToken.address,
  )

  const liquidityPool = await LiquidityPool.deployed()

  await governanceToken.transferOwnership(liquidityPool.address)

  const amount = web3.utils.toWei("10");
  const seedTokenBalance = async (trader) => {
    await underlyingToken.faucet(trader, amount)
    await underlyingToken.approve(liquidityPool.address, amount, {
      from: trader,
    })
  }

  await Promise.all(
    [trader1].map((trader) => seedTokenBalance(trader)),
  )
}
