import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WalletCard from "@/components/WalletCard"
import { useWalletStore } from "@/contexts/WalletContext"
import { Button } from "./ui/button"

function NetworkTabs() {
  const { solAccounts, ethAccounts, toggleVisibility , addSolAccount, addEthAccount} = useWalletStore()
  return (
    <Tabs defaultValue="solana" className="lg:hidden gibber mt-5">
      <TabsList className=" mx-auto">
        <TabsTrigger value="solana">
          Solana
        </TabsTrigger>
        <TabsTrigger value="ethereum">
          Ethereum
        </TabsTrigger>
      </TabsList>
      <TabsContent value="solana">
        <div className="relative h-[calc(100vh-200px)]">
          <div className="h-[calc(100vh-250px)] flex flex-col gap-2 overflow-y-auto">

            {solAccounts && solAccounts.length != 0 && solAccounts.map((account: any, index: any) => {
              return (
                <WalletCard key={index} account={account} index={index} type={'sol'} toggleVisibility={toggleVisibility} />
              )
            })}
          </div>
          <div className="absolute bottom-0 w-full flex justify-center">
            <Button onClick={addSolAccount}>Add Wallet</Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="ethereum">
        <div className="relative h-[calc(100vh-200px)]">
          <div className="h-[calc(100vh-250px)] flex flex-col gap-2 overflow-y-auto">
            {ethAccounts && ethAccounts.length != 0 && ethAccounts.map((account: any, index: any) => {
              return (
                <WalletCard key={index} account={account} index={index} type={'eth'} toggleVisibility={toggleVisibility} />
              )
            })}
          </div>
          <div className="absolute bottom-0 w-full flex justify-center">
            <Button onClick={addEthAccount}>Add Wallet</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default NetworkTabs
