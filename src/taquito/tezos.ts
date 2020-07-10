import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { validateAddress, ValidationResult } from "@taquito/utils";
import { ThanosWallet, ThanosDAppNetwork } from "@thanos-wallet/dapp";

const tezos = new TezosToolkit();
export const NETWORKS = {
  mainnet: "Tezos Mainnet",
  carthagenet: "Carthage Testnet",
};
export default async function initContract(contractAddress: string) {
  try {
    const signer = await InMemorySigner.fromSecretKey(
      "edskRvJ57F7SM8yJi96rASgBSeLd6a8DCkqQg9p4WyMtMSR5skd9jPWRfHaY3jwjc8yHYRKbmKpj4t7KwGUyH6cK6quLrXqS6K"
    );
    await tezos.setProvider({
      rpc: "https://api.tez.ie/rpc/carthagenet",
      signer,
    });
  } catch (e) {
    console.log(e, "init exception");
  }
  const contract = await tezos.contract.at(contractAddress);
  return contract;
}

export async function getStorage(contractAddress: string) {
  const contract = await initContract(contractAddress);
  const storage = await contract.storage<any>();
  return storage;
}

export async function getTezosBalance(pkh: string) {
  const balance: any = await tezos.tz.getBalance(pkh);
  return balance;
}

export async function getTokenBalance(contractAddress: string, pkh: string) {
  const storage = await getStorage(contractAddress);
  return storage.ledger.get(pkh) ? Number(storage.ledger.get(pkh).balance) : 0;
}

export async function isCorrectAddress(address: string) {
  const isAddress = await validateAddress(address);
  return isAddress === ValidationResult.VALID;
}

export async function useThanosWallet(forcePermission: boolean = false) {
  const wallet = new ThanosWallet("Quipuswap");
  const network: ThanosDAppNetwork = localStorage.getItem("network") as ThanosDAppNetwork;
  await wallet.connect(network, { forcePermission });
  const thanosWallet = wallet.toTezos();
  return thanosWallet;
}