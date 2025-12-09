import React, { useState, useEffect } from "react";
import { ThirdwebProvider, useAddress, ConnectWallet, useContract, Web3Button } from "thirdweb/react";
import { contractAddresses } from "./config";

function App() {
  const address = useAddress();
  const { contract: nft } = useContract(contractAddresses.nft);
  const { contract: stake } = useContract(contractAddresses.stake);
  const { contract: reward } = useContract(contractAddresses.reward);

  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [stakedNFTs, setStakedNFTs] = useState([]);
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    if (!address || !nft || !stake) return;
    const load = async () => {
      try {
        const userNFTs = await nft.getOwned(address);
        setOwnedNFTs(userNFTs);

        const stData = await stake.call("getStakeInfo", [address]);
        setStakedNFTs(stData[0]);
        setRewards(Number(stData[1]));
      } catch (e) {
        console.error("Error loading stake info:", e);
      }
    };
    load();
  }, [address, nft, stake]);

  return (
    <div style={{ padding: 20, backgroundColor: "#121212", color: "white", minHeight: "100vh" }}>
      <h1>NFT Staking DApp</h1>
      <ConnectWallet />
      {address && (
        <>
          <h2>Your NFTs</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {ownedNFTs.map((nft) => (
              <div key={nft.metadata.id} style={{ border: "1px solid #444", margin: 5, padding: 10, width: 120 }}>
                <img src={nft.metadata.image} alt="" style={{ width: "100%" }} />
                <Web3Button
                  contractAddress={contractAddresses.stake}
                  action={(c) => c.call("stake", [[nft.metadata.id]])}
                >
                  Stake
                </Web3Button>
              </div>
            ))}
          </div>

          <h2>Staked NFTs</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {stakedNFTs.map((id) => (
              <div key={id} style={{ border: "1px solid #444", margin: 5, padding: 10, width: 120 }}>
                <p>ID: {id}</p>
                <Web3Button
                  contractAddress={contractAddresses.stake}
                  action={(c) => c.call("withdraw", [[id]])}
                >
                  Unstake
                </Web3Button>
              </div>
            ))}
          </div>

          <h2>Rewards</h2>
          <p>{rewards} REWARD</p>
          <Web3Button
            contractAddress={contractAddresses.stake}
            action={(c) => c.call("claimRewards")}
          >
            Claim
          </Web3Button>
        </>
      )}
    </div>
  );
}

export default function WrappedApp() {
  return (
    <ThirdwebProvider activeChain="bsc">
      <App />
    </ThirdwebProvider>
  );
}
