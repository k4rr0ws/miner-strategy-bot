import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts'
import { pulsechain } from 'viem/chains';
import cron from 'node-cron';

import MinerABI from './abi/Miner.json' assert { type: 'json' }

const minerAddress = "0x10429803B5F28832a5793E4080A006Ae6574b473"; //plsx
const PK = ""; //account private key
const account = privateKeyToAccount(PK);
const accountAddress = account.address;

console.log(`Account Address: ${accountAddress}\n`);

const pulseChainClient = createWalletClient({
    account,
    chain: pulsechain,
    transport: http()
}).extend(publicActions);

const compound = async() => {
    console.log('Compounding..');

    const totalMiners = await pulseChainClient.readContract({
        address: minerAddress,
        abi: MinerABI,
        functionName: 'trainers',
        args: [accountAddress]
    });

    const formatMnrs = Number(totalMiners).toLocaleString('en-Us');

    console.log(`Total miners: ${formatMnrs}\n`);

    const compoundTx = await pulseChainClient.writeContract({
        address: minerAddress,
        abi: MinerABI,
        functionName: 'compound',
        args: [accountAddress]
    });

    console.log(`Compounded ore: ${compoundTx}`);
    
}

cron.schedule('0 * * * *', async() => {
    compound();
});
