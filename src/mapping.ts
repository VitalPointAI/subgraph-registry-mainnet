import { near, BigInt, log } from "@graphprotocol/graph-ts";
import { DID, Account } from "../generated/schema";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  for (let i = 0; i < actions.length; i++) {
    handleAction(actions[i], receipt.receipt, receipt.block.header);
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }

  const functionCall = action.toFunctionCall();
  if (functionCall.methodName == "putDID") {
    let account = Account.load(receipt.signerId);
    if (account == null) {
      account = new Account(receipt.signerId);
      account.accountId = receipt.signerId;
      account.save();
    }

    const did = new DID(receipt.id.toBase58());
    did.accountId = account.id;
    //did.timestamp = BigInt.fromU64(blockHeader.timestampNanosec);
    did.save();
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }
}
