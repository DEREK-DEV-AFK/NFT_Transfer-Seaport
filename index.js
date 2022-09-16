const { Seaport } = require("@opensea/seaport-js");
const { ethers } = require("ethers");
const { data } = require("./details.json");

// Provider must be provided to the signer when supplying a custom signer
const provider = new ethers.providers.JsonRpcProvider(
    data.apiKey.goerli.alchemy.url
);

const signer1 = new ethers.Wallet(data.accounts.acc1["private-key"], provider);
const signer2 = new ethers.Wallet(data.accounts.acc2["private-key"], provider);

const seaport1 = new Seaport(signer1);
const seaport2 = new Seaport(signer2);
/// offering nad fullfillin it

async function main() {
    const offerer = data.accounts.acc1.address;
    const fulfiller = data.accounts.acc2.address;
    console.log("creating order !");
    const { executeAllActions } = await seaport1.createOrder(
        {
            offer: [
                {
                    itemType: 2,
                    token: data.contract.goerli.nft,
                    identifier: "0",
                },
            ],
            consideration: [
                {
                    amount: ethers.utils.parseEther("0.1").toString(),
                    recipient: offerer,
                },
            ],
        },
        offerer
    );
    console.log("created order success");

    const order = await executeAllActions();
    console.log("order : ", order)

    const { executeAllActions: executeAllFulfillActions } =
        await seaport2.fulfillOrder({
            order,
            accountAddress: fulfiller,
        });

    const transaction = await executeAllFulfillActions();

    console.log("transaction success");
    console.log(transaction);
}


main();