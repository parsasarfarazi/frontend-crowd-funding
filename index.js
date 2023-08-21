import { ethers } from "./ethers.5.7.2.js"
import { abi, contractAddress } from "./constants.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalance = document.getElementById("getBalance")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
getBalance.onclick = Balance
withdrawButton.onclick = withdraw

async function connect() {
   if (typeof window.ethereum !== "undefined") {
      window.ethereum.request({ method: "eth_requestAccounts" })
      connectButton.innerHTML = "connected!!!"
   } else {
      console.log("no metamask :(")
   }
}
async function withdraw() {
   const provider = new ethers.providers.Web3Provider(window.ethereum)
   const signer = provider.getSigner()
   const contract = new ethers.Contract(contractAddress, abi, signer)
   try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
   } catch (error) {
      console.log(error)
   }
}

async function Balance() {
   if (true) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const balance = await provider.getBalance(contractAddress)
      document.getElementById("pool").innerHTML =
         ethers.utils.formatEther(balance)
   }
}
async function fund() {
   const ethAmount = document.getElementById("ethAmount").value
   console.log(`funding with ${ethAmount} ...`)
   const provider = new ethers.providers.Web3Provider(window.ethereum)
   const signer = provider.getSigner()
   console.log(signer)
   const contract = new ethers.Contract(contractAddress, abi, signer)
   const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
   })
   await listenForTransactionMine(transactionResponse, provider)
   console.log("done!")
}
function listenForTransactionMine(transactionResponse, provider) {
   console.log(`mining ${transactionResponse.hash}`)
   return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReciept) => {
         console.log(
            `completed with ${transactionReciept.confirmations} confirmations`,
         )
         resolve()
      })
   })
}
