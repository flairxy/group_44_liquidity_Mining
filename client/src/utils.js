import Web3 from 'web3'
import LiquidityPool from './contracts/LiquidityPool.json'
import detectEthereumProvider from '@metamask/detect-provider'

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    let provider = await detectEthereumProvider()

    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' })

      try {
        const web3 = new Web3(window.ethereum)

        resolve(web3)
      } catch (error) {
        reject(error)
      }
    }
    reject('Install Metamask')
  })

const getContracts = async (web3) => {
  const networkId = await web3.eth.net.getId()
  const deployedNetwork = LiquidityPool.networks[networkId]
  const liquidityPool = new web3.eth.Contract(
    LiquidityPool.abi,
    deployedNetwork && deployedNetwork.address,
  )

  return {
    liquidityPool,
  }
}

export { getWeb3, getContracts }
