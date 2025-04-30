import { Eye, EyeOff } from "lucide-react"
import { WalletAccount } from "@/lib/types"

const WalletCard = ({account,index,type,toggleVisibility}: {account: WalletAccount, index: number, type: 'sol' | 'eth', toggleVisibility: (account: WalletAccount, type: 'sol' | 'eth') => void})=>{
    return(
    <div className="bg-muted w-full h-auto p-5">
                    <h1 className="text-center font-bold text-lg mb-2">Wallet {index + 1}</h1>
                    <ul className="flex flex-col gap-2">
                    <div className="grid grid-cols-1 place-items-center  md:grid-cols-[auto_auto_auto] items-center gap-4 rounded-md border border-gray-200 bg-background p-3 shadow-sm">
        <div className="font-medium text">Private key:</div> 
        <div className="break-all font-mono text-sm overflow-hidden">
          {account.secretHidden ? <span className="text-sm tracking-tight">{'•'.repeat(Math.min(account.privateKey?.length))}</span> : account.privateKey}
        </div> 
        <button 
          onClick={() => toggleVisibility(account,type)}
          className="flex items-center gap-1 rounded-md px-3 py-1 text-sm hover:bg-muted transition-colors"
          aria-label={account.secretHidden ? "Show private key" : "Hide private key"}
          type="button"
        > 
          {account.secretHidden ? (
            <>
              <Eye size={16} />
              <span>Show</span>
            </>
          ) : (
            <>
              <EyeOff size={16} />
              <span>Hide</span>
            </>
          )}
        </button> 
      </div>
                      <li className="bg-background p-2 break-all">Public key: {account.publicKey}</li>
                      <li className="bg-background p-2">Balance: {account.balance || 0} {type === 'sol' ? 'SOL' : 'ETH'}</li>
                    </ul>
                  </div>
    )
}
export default WalletCard