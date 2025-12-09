import React, { useState } from "react";
import {
  ThirdwebProvider,
  ConnectWallet,
  useAddress,
  useContract,
  Web3Button,
  useOwnedNFTs,
  useNFTCollection,
} from "thirdweb/react";

const nftContractAddress = "0x09d21cc7a65e5efac638b31a185c00834f2e66bf";
const stakingContractAddress = "0xBb580453030333aDA869A05b3aAFF048753F88A0";

function App() {
  const address = useAddress();
  const { contract: stakingContract } = useContract(stakingContractAddress);
  const nftCollection = useNFTCollection(nftContractAddress);
  const { data: ownedNFTs } = useOwnedNFTs(nftCollection, address);
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  return (
    <ThirdwebProvider desiredChainId={56}>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>NFT Staking DApp</h1>

        {!address ? (
          <ConnectWallet />
        ) : (
          <>
            <p>Connected as: {address}</p>

            {ownedNFTs && ownedNFTs.length > 0 ? (
              <div style={{ margin: "20px 0" }}>
                <h3>Select an NFT to Stake/Unstake:</h3>
                <select
                  value={selectedTokenId || ""}
                  onChange={(e) => setSelectedTokenId(e.target.value)}
                >
                  <option value="" disabled>
                    -- Select NFT --
                  </option>
                  {ownedNFTs.map((nft) => (
                    <option key={nft.metadata.id} value={nft.metadata.id}>
                      #{nft.metadata.id} {nft.metadata.name || ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p>You don't own any NFTs from this collection.</p>
            )}

            <div style={{ marginTop: "20px" }}>
              <Web3Button
                contractAddress={stakingContractAddress}
                action={async (contract) => {
                  if (!selectedTokenId) return alert("Please select an NFT");
                  await contract.call("stake", [selectedTokenId]);
                }}
              >
                Stake NFT
              </Web3Button>

              <Web3Button
                contractAddress={stakingContractAddress}
                action={async (contract) => {
                  if (!selectedTokenId) return alert("Please select an NFT");
                  await contract.call("unstake", [selectedTokenId]);
                }}
                style={{ marginLeft: "10px" }}
              >
                Unstake NFT
              </Web3Button>
            </div>
          </>
        )}
      </div>
    </ThirdwebProvider>
  );
}

export default App;
