import {SubstrateExtrinsic} from "@subql/types";
import {RemarkedNftAddress} from "../types";

const nftRemarkPrefix = "NFT amount: 1; Rewards receiving address: 0x";

export async function handleSystemRemarkCall(extrinsic: SubstrateExtrinsic): Promise<void> {
    const remark = (extrinsic.extrinsic.toHuman() as any)?.method?.args?.remark;
    if (remark?.startsWith(nftRemarkPrefix)) {
        const record = new RemarkedNftAddress(extrinsic.extrinsic.hash.toString());

        record.signer = extrinsic.extrinsic.signer.toString();
        record.value = remark;
        record.addressValue = remark?.slice(nftRemarkPrefix.length - 2);  // TODO: Web3 util check address if valid or not
        record.blockNumber = extrinsic.block.block.header.number.toNumber();
        record.extrinsicIndex = extrinsic.idx;
        record.extrinsicHash = extrinsic.extrinsic.hash.toString();
        record.extrinsicTimestamp = extrinsic.block.timestamp;
        await record.save();
    }
}
