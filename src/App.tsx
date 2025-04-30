import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import WalletCard from "@/components/WalletCard";
import { useWalletStore } from "@/contexts/WalletContext";
import NetworkTabs from "./components/NetworkTabs";
function App() {
  const {generateMnemonicHandler, solAccounts,  addSolAccount, toggleVisibility, mnemonic, ethAccounts, addEthAccount} = useWalletStore()
  // TODO: Add balance fetch logic
  // TODO: Add Devnet and Mainnet diffs

  return (
    <div className="p-5 h-screen overflow-y-auto w-screen dark bg-background text-foreground">
      <div className="flex gap-3 flex-col w-full justify-center items-center">
        <Button onClick={generateMnemonicHandler} className="">Generate an Account</Button>
        { <Input readOnly value={mnemonic || ""} />}
      </div>
      <div className="hidden lg:flex w-full justify-around min-h-[calc(100vh-150px)] 2xl:h-[calc(100vh-150px)] py-5">
        <div className="w-full border-r-2 border-black dark:border-white relative">
          <h1 className="text-4xl text-center my-5">Solana Network</h1>
          <div className="h-[calc(100vh-350px)] flex flex-col gap-2 overflow-y-auto p-5">

            {solAccounts && solAccounts.length != 0 && solAccounts.map((account, index) => {
              return (
                <WalletCard key={index} account={account} index={index} type="sol" toggleVisibility={toggleVisibility}/>
              )
            })}
          </div>
          <div className="absolute bottom-0 w-full flex justify-center">
            <Button onClick={addSolAccount}>Add Wallet</Button>
          </div>
        </div>
        <div className="w-full relative">
          <h1 className="text-4xl text-center my-5">Ethereum Network</h1>
          <div className="h-[calc(100vh-350px)] flex flex-col gap-2 overflow-y-auto p-5">

            {ethAccounts && ethAccounts.length != 0 && ethAccounts.map((account, index) => {
              return (
                <WalletCard key={index} account={account} index={index} type="eth" toggleVisibility={toggleVisibility}/>
              )
            })}
          </div>
          <div className="absolute bottom-0 w-full flex justify-center">
            <Button onClick={addEthAccount}>Add Wallet</Button>
          </div>
        </div>
      </div>

   <NetworkTabs/>

    </div>
  )
}

export default App



