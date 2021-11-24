import { near, BigInt, log, json, JSONValue, JSONValueKind } from "@graphprotocol/graph-ts";
import { Account, DataReceiver } from "../generated/schema";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i], 
      receipt.receipt, 
      receipt.block.header,
      receipt.outcome
      );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }

  const functionCall = action.toFunctionCall();
  if (functionCall.methodName == "putDID") {
    // let account = Account.load(receipt.signerId);
    // if (account == null) {
      const receiptId = receipt.id.toHexString()
      let account = new Account(receipt.signerId);
      account.accountId = receipt.signerId;
      account.actionData = BigInt.fromU64(action.data);
      account.actionKind = action.kind
      account.gasPrice = receipt.gasPrice
      account.inputDataIds = receipt.inputDataIds
      account.actionLogs = outcome.logs

      const dataReceivers = receipt.outputDataReceivers
      for (let i = 0; i < dataReceivers.length; i++) {
        const dataReceiver = new DataReceiver(`${receiptId}-${i}`)
        dataReceiver.dataId = dataReceivers[i].dataId
        dataReceiver.receiverId = dataReceivers[i].receiverId
        dataReceiver.save()

        account.dataReceiver.push(dataReceiver.id)
      }
     
      
    
      //account.actionOutputDataReceivers = receipt.outputDataReceivers
     // account.actionOutcome = outcome.logs
     
      account.save();
    // }

    // const did = new Did(receipt.id.toBase58());
    // // did.accountId = account.id;
    // did.did = account.data
    // // did.timestamp = BigInt.fromU64(blockHeader.timestampNanosec);
    // did.save();
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }
}
