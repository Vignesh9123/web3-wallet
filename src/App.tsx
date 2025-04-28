import { useState } from "react"
import { generateMnemonic ,mnemonicToSeed } from "bip39"
import { Keypair } from "@solana/web3.js"
import { derivePath } from "ed25519-hd-key"
import nacl from 'tweetnacl'
import {Wallet, HDNodeWallet} from 'ethers'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import bs58 from 'bs58';
function App() {
  const [mneumonic, setMneumonic] = useState<string | null>(null)
  const [solAccounts, setSolAccounts] = useState<any[] | null>(null)
  const [ethAccounts, setEthAccounts] = useState<any[] | null>(null)
 
  const generateMneumonicHandler = async () =>{
    if(mneumonic){

    }
    else {
      const mn = generateMnemonic();
      setMneumonic(mn)
        const seed = await mnemonicToSeed(mn)
        console.log(seed)
        const path = `m/44'/501'/0'/0'`
        const derivedSeed = derivePath(path, seed.toString("hex")).key
        const naclkeyPair = nacl.sign.keyPair.fromSeed(derivedSeed)
        const keypair = Keypair.fromSecretKey(naclkeyPair.secretKey);
        console.log('Solana public key', bs58.encode(keypair.secretKey))
        const sna = {
          publicKey: keypair.publicKey.toBase58(),
          privateKey: bs58.encode(keypair.secretKey)
        }
        setSolAccounts([sna])

        const derivationPath = `m/44'/60'/0'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        console.log("Ethereum wallet", wallet)

        const ena = {
          publicKey: wallet.address,
          privateKey: wallet.privateKey
        }

        setEthAccounts([ena])

    }
  }

  const addSolAccount = async()=>{
    if(mneumonic){
    const seed = await mnemonicToSeed(mneumonic)
        console.log(seed)
        const path = `m/44'/501'/${solAccounts?.length}'/0'`
        const derivedSeed = derivePath(path, seed.toString("hex")).key
        const naclkeyPair = nacl.sign.keyPair.fromSeed(derivedSeed)
        const keypair = Keypair.fromSecretKey(naclkeyPair.secretKey);
        console.log('Solana public key', keypair.publicKey.toBase58())
        const sna = {
          publicKey: keypair.publicKey.toBase58(),
          privateKey: bs58.encode(keypair.secretKey)
        }

        setSolAccounts((prev)=>[...prev!, sna])
    }
  }

  const addEthAccount = async()=>{
    if(mneumonic){
      const seed = await mnemonicToSeed(mneumonic)
      const derivationPath = `m/44'/60'/${ethAccounts?.length}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      console.log("Ethereum wallet", wallet)

      const ena = {
        publicKey: wallet.address,
        privateKey: wallet.privateKey
      }
      setEthAccounts((prev)=>[...prev!, ena])
    }
  }
  return (
   <div className="p-5 h-screen overflow-y-auto w-screen dark bg-background text-foreground">
    <div className="flex gap-3 flex-col w-full justify-center items-center">
      <Button onClick={generateMneumonicHandler} className="">Generate an Account</Button>
      {mneumonic && <Input readOnly value={mneumonic}/>}
    </div>
    <div className="flex w-full justify-around min-h-[600px] lg:min-h-[600px] 2xl:h-[800px] py-5">
      <div className="w-full border-r-2 border-black dark:border-white relative">
        <h1 className="text-4xl text-center">Solana Network</h1>
        <div className="2xl:h-[650px] flex flex-col gap-2 overflow-y-auto p-5">

       {solAccounts && solAccounts.length != 0 && solAccounts.map((account, index)=>{
        return (
        <div className="bg-muted w-full h-auto p-5">
        <h1 className="text-center font-bold text-lg mb-2">Wallet {index + 1}</h1>
        <ul className="flex flex-col gap-2">
          <li className="bg-background p-2">Private key: {account.privateKey}</li>
          <li className="bg-background p-2">Public key: {account.publicKey}</li>
          <li className="bg-background p-2">Balance: 14000 SOL</li>
        </ul>
      </div>
        )
       })}
        </div>
        <div className="absolute bottom-0 w-full flex justify-center">
        <Button onClick={addSolAccount}>Add Wallet</Button>
        </div>
      </div>
      <div className="w-full relative">
        <h1 className="text-4xl text-center">Ethereum Network</h1>
        <div className="2xl:h-[650px] flex flex-col gap-2 overflow-y-auto p-5">

        {ethAccounts && ethAccounts.length != 0 && ethAccounts.map((account, index)=>{
        return (
        <div className="bg-muted w-full h-auto p-5">
        <h1 className="text-center font-bold text-lg mb-2">Wallet {index + 1}</h1>
        <ul className="flex flex-col gap-2">
          <li className="bg-background p-2">Private key: {account.privateKey}</li>
          <li className="bg-background p-2">Public key: {account.publicKey}</li>
          <li className="bg-background p-2">Balance: 14000 SOL</li>
        </ul>
      </div>
        )
       })}
</div>
        <div className="absolute bottom-0 w-full flex justify-center">
        <Button onClick={addEthAccount}>Add Wallet</Button>
        </div>
      </div>
    </div>

   </div>
  )
}

export default App
