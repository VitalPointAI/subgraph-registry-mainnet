import { near, BigInt, log, json, JSONValue, JSONValueKind } from "@graphprotocol/graph-ts";
import { Account } from "../generated/schema";

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
  if (functionCall.methodName == "createDAO") {
      const receiptId = receipt.id.toHexString()
      let account = new Account(receipt.signerId);
      account.accountId = receipt.signerId;
      account.actionLogs = outcome.logs
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "inactivateDAO") {
      const receiptId = receipt.id.toHexString()
      let account = new Account(receipt.signerId);
      account.accountId = receipt.signerId;
      account.actionLogs = outcome.logs     
      account.save();
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }
}
