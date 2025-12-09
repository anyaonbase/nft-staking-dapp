import React from "react";
import { ThirdwebProvider, ConnectWallet, useAddress, useContract, Web3Button } from "thirdweb/react";

const nftContractAddress = "0x09d21cc7a65e5efac638b31a185c00834f2e66bf";
const stakingContractAddress = "0xBb580453030333aDA869A05b3aAFF048753F88A0";
const rewardTokenAddress = "0x986Ffb3BFA039F3798B4e01a36C21CD721eD361c";

function App() {
  const address = useAddress();
  const { contract: stakingContract } = useContract(stakingContractAddress);

  return (
    <ThirdwebProvider desiredChainId={56}>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>NFT Staking DApp</h1>

        {!address ? (
          <ConnectWallet />
        ) : (
          <>
            <p>Connected as: {address}</p>

            <Web3Button
              contractAddress={stakingContractAddress}
              action={async (contract) => {
                await contract.call("stake", [nftContractAddress]);
              }}
            >
              Stake NFT
            </Web3Button>

            <Web3Button
              contractAddress={stakingContractAddress}
              action={async (contract) => {
                await contract.call("unstake", [nftContractAddress]);
              }}
              style={{ marginLeft: "10px" }}
            >
              Unstake NFT
            </Web3Button>
          </>
        )}
      </div>
    </ThirdwebProvider>
  );
}

export default App;
