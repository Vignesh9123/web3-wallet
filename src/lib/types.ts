export interface WalletAccount {
    publicKey: string
    privateKey: string
    secretHidden: boolean     
    balance?: number
}

export interface WalletContextType {
  solAccounts: WalletAccount[] | null;
  ethAccounts: WalletAccount[] | null;
  mnemonic: string | null;
  error: string | null;
  generateMnemonicHandler: () => Promise<void>;
  addSolAccount: () => Promise<void>;
  addEthAccount: () => Promise<void>;
  toggleVisibility: (account: WalletAccount, type: 'sol' | 'eth') => void;
}