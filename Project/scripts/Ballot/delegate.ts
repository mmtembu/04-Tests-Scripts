import { ethers, Contract } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { Ballot } from "../../typechain";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "a8b513369437e05aee54948867a86923858a71d5ac380e7db91fd9717e453909";

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  const lastBlock = await provider.getBlock('latest');
//   console.log(`Connected to ropsten network at height`)
//   console.log(lastBlock);
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  console.log("Delegating");
  console.log("Delegating my vote...");
  if(process.argv.length < 3) throw new Error("No user address provided")
  const userAddress = process.argv[2];


  console.log(`Voter address given as: ${userAddress}`);
//   console.log(`Proposal given as: ${userAddress}`);

  const ballotContract: Ballot = new Contract(
    userAddress,
    ballotJson.abi,
    signer
  ) as Ballot;

  ballotContract.delegate(userAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

