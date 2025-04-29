import { useState } from "react"
import { generateMnemonic, mnemonicToSeed } from "bip39"
import { Keypair } from "@solana/web3.js"
import { derivePath } from "ed25519-hd-key"
import nacl from 'tweetnacl'
import { Wallet, HDNodeWallet } from 'ethers'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import bs58 from 'bs58';
import WalletCard from "@/components/WalletCard";
function App() {

  // TODO: Add balance fetch logic
  // TODO: Add Devnet and Mainnet diffs

  const [mneumonic, setMneumonic] = useState<string | null>(null)
  const [solAccounts, setSolAccounts] = useState<any[] | null>(null)
  const [ethAccounts, setEthAccounts] = useState<any[] | null>(null)

  const generateMneumonicHandler = async () => {
    if (mneumonic) {

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
      const sna = {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        secretHidden: true
      }
      setSolAccounts([sna])

      const derivationPath = `m/44'/60'/0'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);

      const ena = {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        secretHidden: true
      }

      setEthAccounts([ena])

    }
  }

  const addSolAccount = async () => {
    if (mneumonic) {
      const seed = await mnemonicToSeed(mneumonic)
      console.log(seed)
      const path = `m/44'/501'/${solAccounts?.length}'/0'`
      const derivedSeed = derivePath(path, seed.toString("hex")).key
      const naclkeyPair = nacl.sign.keyPair.fromSeed(derivedSeed)
      const keypair = Keypair.fromSecretKey(naclkeyPair.secretKey);
      console.log('Solana public key', keypair.publicKey.toBase58())
      const sna = {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        secretHidden: true
      }

      setSolAccounts((prev) => [...prev!, sna])
    }
  }

  const addEthAccount = async () => {
    if (mneumonic) {
      const seed = await mnemonicToSeed(mneumonic)
      const derivationPath = `m/44'/60'/${ethAccounts?.length}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      console.log("Ethereum wallet", wallet)

      const ena = {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        secretHidden: true
      }
      setEthAccounts((prev) => [...prev!, ena])
    }
  }
    const toggleVisibility = (account:any, setAccounts:any) => {
    if (!setAccounts) return;
    
    setAccounts((prev:any) => 
      prev?.map((a:any) => 
        a.publicKey === account.publicKey 
          ? { ...a, secretHidden: !account.secretHidden } 
          : a 
      ) || []
    );
  };

  return (
    <div className="p-5 h-screen overflow-y-auto w-screen dark bg-background text-foreground">
      <div className="flex gap-3 flex-col w-full justify-center items-center">
        <Button onClick={generateMneumonicHandler} className="">Generate an Account</Button>
        {mneumonic && <Input readOnly value={mneumonic} />}
      </div>
      <div className="flex w-full justify-around min-h-[600px] lg:min-h-[420px] 2xl:h-[800px] py-5">
        <div className="w-full border-r-2 border-black dark:border-white relative">
          <h1 className="text-4xl text-center my-5">Solana Network</h1>
          <div className="h-[650px] lg:h-[220px] 2xl:h-[650px] flex flex-col gap-2 overflow-y-auto p-5">

            {solAccounts && solAccounts.length != 0 && solAccounts.map((account, index) => {
              return (
                <WalletCard account={account} index={index} setAccounts={setSolAccounts} toggleVisibility={toggleVisibility}/>
              )
            })}
          </div>
          <div className="absolute bottom-0 w-full flex justify-center">
            <Button onClick={addSolAccount}>Add Wallet</Button>
          </div>
        </div>
        <div className="w-full relative">
          <h1 className="text-4xl text-center my-5">Ethereum Network</h1>
          <div className="h-[650px] lg:h-[220px] 2xl:h-[650px] flex flex-col gap-2 overflow-y-auto p-5">

            {ethAccounts && ethAccounts.length != 0 && ethAccounts.map((account, index) => {
              return (
                <WalletCard account={account} index={index} setAccounts={setEthAccounts} toggleVisibility={toggleVisibility}/>
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
// const PrivateKeyDisplay = ({ account = {}, setSolAccounts }) => {
//   // Add safety checks and default values
//   const {
//     publicKey = '',
//     privateKey = '',
//     secretHidden = true
//   } = account || {};

// }


