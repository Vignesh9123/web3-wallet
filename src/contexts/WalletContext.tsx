import React, { createContext, useContext, useState } from "react";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from 'tweetnacl';
import { Wallet, HDNodeWallet } from 'ethers';
import bs58 from 'bs58';
import { WalletAccount, WalletContextType } from "@/lib/types";


const WalletContext = createContext<WalletContextType>({
  solAccounts: null,
  ethAccounts: null,
  mnemonic: null,
  error: null,
  generateMnemonicHandler: async () => {},
  addSolAccount: async () => {},
  addEthAccount: async () => {},
  toggleVisibility: () => {},
});

// Create prvider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [solAccounts, setSolAccounts] = useState<WalletAccount[] | null>(null);
  const [ethAccounts, setEthAccounts] = useState<WalletAccount[] | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const generateMnemonicHandler = async () => {
    try {
      if (mnemonic) {
        return;
      }
      
      const mn = generateMnemonic();
      setMnemonic(mn);
      const seed = await mnemonicToSeed(mn);
      
      const solPath = `m/44'/501'/0'/0'`;
      const derivedSeed = derivePath(solPath, seed.toString("hex")).key;
      const naclkeyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
      const keypair = Keypair.fromSecretKey(naclkeyPair.secretKey);
      const sna = {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        secretHidden: true
      };
      setSolAccounts([sna]);
  
      const ethPath = `m/44'/60'/0'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(ethPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
  
      const ena = {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        secretHidden: true
      };
  
      setEthAccounts([ena]);
      setError(null);
    } catch (err) {
      console.error("Error generating wallet:", err);
      setError("Failed to generate wallet. Please try again.");
    }
  };
  
  const addSolAccount = async () => {
    try {
      if (!mnemonic) {
        setError("No mnemonic phrase available. Generate an account first.");
        return;
      }
      
      const seed = await mnemonicToSeed(mnemonic);
      const accountIndex = solAccounts?.length || 0;
      const path = `m/44'/501'/${accountIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const naclkeyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
      const keypair = Keypair.fromSecretKey(naclkeyPair.secretKey);
      
      const sna = {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        secretHidden: true
      };
  
      setSolAccounts((prev) => prev ? [...prev, sna] : [sna]);
      setError(null);
    } catch (err) {
      console.error("Error adding Solana account:", err);
      setError("Failed to add Solana account. Please try again.");
    }
  };
  
  const addEthAccount = async () => {
    try {
      if (!mnemonic) {
        setError("No mnemonic phrase available. Generate an account first.");
        return;
      }
      
      const seed = await mnemonicToSeed(mnemonic);
      const accountIndex = ethAccounts?.length || 0;
      const derivationPath = `m/44'/60'/${accountIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      
      const ena = {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        secretHidden: true
      };
      
      setEthAccounts((prev) => prev ? [...prev, ena] : [ena]);
      setError(null);
    } catch (err) {
      console.error("Error adding Ethereum account:", err);
      setError("Failed to add Ethereum account. Please try again.");
    }
  };
  
  const toggleVisibility = (account: WalletAccount, type: 'sol' | 'eth') => {
    const setAccounts = type === 'sol' ? setSolAccounts : setEthAccounts;
    const accounts = type === 'sol' ? solAccounts : ethAccounts;
    
    setAccounts(
      accounts?.map((a) => 
        a.publicKey === account.publicKey 
          ? { ...a, secretHidden: !a.secretHidden } 
          : a 
      ) || []
    );
  };
  

  const value = {
    solAccounts,
    ethAccounts,
    mnemonic,
    error,
    generateMnemonicHandler,
    addSolAccount,
    addEthAccount,
    toggleVisibility,
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook for using wallet context
export const useWalletStore = () => useContext(WalletContext);