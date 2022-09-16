const { Seaport } = require("@opensea/seaport-js");
const { ethers } = require("ethers");
const { data } = require("./details.json");

// Provider must be provided to the signer when supplying a custom signer
const provider = new ethers.providers.JsonRpcProvider(
    data.apiKey.goerli.alchemy.url
);
// connecting first add as signer 1 and other as signer 2
const signer1 = new ethers.Wallet(data.accounts.acc1["private-key"], provider);
const signer2 = new ethers.Wallet(data.accounts.acc2["private-key"], provider);

// implemented two seaports obj for different signers
const seaport1 = new Seaport(signer1);
const seaport2 = new Seaport(signer2);


async function main() {
    const offerer = data.accounts.acc2.address; // offerer address which is going to offer
    const fulfiller = data.accounts.acc1.address; // fulfiller address which is going to accept or fullfill
    console.log("creating order !");
    // creating order by signer 2
    const { executeAllActions } = await seaport2.createOrder(
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
                    amount: ethers.utils.parseEther("0.1").toString(),  // in return we are asking for 0.1 eth
                    recipient: offerer, // and the recipient must be offerer
                },
            ],
        },
        offerer
    );
    console.log("created order success");

    const order = await executeAllActions(); // getting the order array to pass in fullfill block
    console.log("order : ", order)

    // this will be call by signer 1 to fullfill the order 
    const { executeAllActions: executeAllFulfillActions } =
        await seaport1.fulfillOrder({
            order, // providing ther order which we are fullfilling 
            accountAddress: fulfiller, // the address through which we will fulfill
        });

    const transaction = await executeAllFulfillActions(); // getting the transaction details

    console.log("transaction success");
    console.log(transaction);
}
main();