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
  
  let accounts = new Account(receipt.signerId);
  const functionCall = action.toFunctionCall();
  if (functionCall.methodName == "putDID") {
    const receiptId = receipt.id.toHexString();
      accounts.signerId = receipt.signerId;
      accounts.log = outcome.logs;
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "init") {
    const receiptId = receipt.id.toHexString();
      accounts.signerId = receipt.signerId;
      accounts.log = outcome.logs;     
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "transferAdmin") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;  
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

if (functionCall.methodName == "changeVerificationStatus") {
  const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;    
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "addVerifier") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;    
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "removeVerifier") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs; 
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "addEditor") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;    
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "removeEditor") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;    
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "deleteDID") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "storeAlias") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs; 
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "deleteAlias") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "addEditor") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "removeEditor") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }
  accounts.save();
}
