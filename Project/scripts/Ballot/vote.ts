import { ethers, Contract } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { Ballot } from "../../typechain";

const proposals = ["Proposal 1", "Proposal 2", "Proposal 3"]
// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "a8b513369437e05aee54948867a86923858a71d5ac380e7db91fd9717e453909";

// function convertStringArrayToBytes32(array: string[]) {
//   const bytes32Array = [];
//   for (let index = 0; index < array.length; index++) {
//     bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
//   }
//   return bytes32Array;
// }

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
  console.log("Voting");
  console.log("Checking for address...");
  if(process.argv.length < 3) throw new Error("No voter address provided")
  const voterAddress = process.argv[2];
  if(process.argv.length < 4) throw new Error("No proposal given")
  const proposal = process.argv[3];

  console.log(`Voter address given as: ${voterAddress}`);
  console.log(`Proposal given as: ${proposal}`);

  const ballotContract: Ballot = new Contract(
    voterAddress,
    ballotJson.abi,
    signer
  ) as Ballot;

  ballotContract.vote(proposals.indexOf(proposal));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
