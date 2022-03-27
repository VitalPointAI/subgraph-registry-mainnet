import { near, log, json, JSONValueKind, BigInt } from "@graphprotocol/graph-ts";
import { PutDID,
  PutIdDID,
  DeleteIdDID,
  DeleteDID,
  Init,
  StoreAliase,
  DeleteAliase,
  TransferAdmin,
  RemoveVerifier,
  AddVerifier,
  AddRole,
  RemoveRole,
  ChangeVerificationStatuse,
  ChangeIdVerificationStatuse,
  AddAdmin,
  RemoveAdmin,
  AddFundingKey,
  DeleteFundingKey } from "../generated/schema";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i], 
      receipt.receipt, 
      receipt.block.header,
      receipt.outcome,
      receipt.receipt.signerPublicKey
      );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
  publicKey: near.PublicKey
): void {
  
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  } 
  
  const functionCall = action.toFunctionCall();

  if (functionCall.methodName == "putDID") {
    const receiptId = receipt.id.toBase58()
    let logs = new PutDID(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'accountId':
                  logs.accountId = data.entries[i].value.toString()
                  break
                case key == 'did':
                  logs.did = data.entries[i].value.toString()
                  break
                case key == 'type':
                  logs.type = data.entries[i].value.toString()
                  break
                case key == 'registered':
                  logs.registered = data.entries[i].value.toBigInt()
                  break
                case key == 'owner':
                  logs.owner = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "putIdDID") {
    const receiptId = receipt.id.toBase58()
    let logs = new PutIdDID(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'id':
                  logs.identifier = data.entries[i].value.toString()
                  break
                case key == 'did':
                  logs.did = data.entries[i].value.toString()
                  break
                case key == 'type':
                  logs.type = data.entries[i].value.toString()
                  break
                case key == 'registered':
                  logs.registered = data.entries[i].value.toBigInt()
                  break
                case key == 'owner':
                  logs.owner = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "init") {
    const receiptId = receipt.id.toBase58()
    let logs = new Init(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'adminId':
                  logs.adminId = data.entries[i].value.toString()
                  break
                case key == 'adminSet':
                  logs.adminSet = data.entries[i].value.toBigInt()
                  break
                case key == 'accountId':
                  logs.accountId = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "transferAdmin") {
    const receiptId = receipt.id.toBase58()
    let logs = new TransferAdmin(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'transferredFrom':
                  logs.transferredFrom = data.entries[i].value.toString()
                  break
                case key == 'transferred':
                  logs.transferred = data.entries[i].value.toBigInt()
                  break
                case key == 'transferredTo':
                  logs.transferredTo = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "changeVerificationStatus") {
    const receiptId = receipt.id.toBase58()
    let logs = new ChangeVerificationStatuse(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'accountId':
                  logs.accountId = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'verified':
                  logs.verified = data.entries[i].value.toBool()
                  break
                case key == 'changedBy':
                  logs.changedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "changeIdVerificationStatus") {
    const receiptId = receipt.id.toBase58()
    let logs = new ChangeIdVerificationStatuse(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'id':
                  logs.identifier = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'verified':
                  logs.verified = data.entries[i].value.toBool()
                  break
                case key == 'changedBy':
                  logs.changedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "removeRole") {
    const receiptId = receipt.id.toBase58()
    let logs = new RemoveRole(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'contractId':
                  logs.contractId = data.entries[i].value.toString()
                  break
                case key == 'accountId':
                  logs.accountId = data.entries[i].value.toString()
                  break
                case key == 'role':
                  logs.role = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'removedBy':
                  logs.removedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "addRole") {
    const receiptId = receipt.id.toBase58()
    let logs = new AddRole(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'contractId':
                  logs.contractId = data.entries[i].value.toString()
                  break
                case key == 'accountId':
                  logs.accountId = data.entries[i].value.toString()
                  break
                case key == 'role':
                  let roles = data.entries[i].value.toArray()
                  for(let x = 0; x < roles.length; x++){
                    logs.role.push(roles[x].toString())
                  }
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'addedBy':
                  logs.addedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "addVerifier") {
    const receiptId = receipt.id.toBase58()
    let logs = new AddVerifier(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'accountId':
                  logs.accountId = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'whitelistedBy':
                  logs.whitelistedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "removeVerifier") {
    const receiptId = receipt.id.toBase58()
    let logs = new RemoveVerifier(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'accountId':
                  logs.accountId = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'removedBy':
                  logs.removedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "deleteDID") {
    const receiptId = receipt.id.toBase58()
    let logs = new DeleteDID(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'accountId':
                  logs.accountId = data.entries[i].value.toString()
                  break
                case key == 'did':
                  logs.did = data.entries[i].value.toString()
                  break
                case key == 'type':
                  logs.type = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'deletedBy':
                  logs.deletedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "deleteIdDID") {
    const receiptId = receipt.id.toBase58()
    let logs = new DeleteIdDID(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'id':
                  logs.identifier = data.entries[i].value.toString()
                  break
                case key == 'did':
                  logs.did = data.entries[i].value.toString()
                  break
                case key == 'type':
                  logs.type = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'deletedBy':
                  logs.deletedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "storeAlias") {
    const receiptId = receipt.id.toBase58()
    let logs = new StoreAliase(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'alias':
                  let splits = data.entries[i].value.toString().split(':')
                  logs.aliasOwner = splits[0]
                  logs.alias = splits[1]
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'storedBy':
                  logs.storedBy = data.entries[i].value.toString()
                  break
                case key == 'definition':
                  logs.definition = data.entries[i].value.toString()
                  break
                case key == 'description':
                  logs.description = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "deleteAlias") {
    const receiptId = receipt.id.toBase58()
    let logs = new DeleteAliase(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'alias':
                  let splits = data.entries[i].value.toString().split(':')
                  logs.aliasOwner = splits[0]
                  logs.alias = splits[1]
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'deletedBy':
                  logs.deletedBy = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "addAdmin") {
    const receiptId = receipt.id.toBase58()
    let logs = new AddAdmin(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'addedBy':
                  logs.addedBy = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'adminAdded':
                  logs.adminAdded = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "removeAdmin") {
    const receiptId = receipt.id.toBase58()
    let logs = new RemoveAdmin(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'removedBy':
                  logs.removedBy = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'adminRemoved':
                  logs.adminRemoved = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "_addFundingKey") {
    const receiptId = receipt.id.toBase58()
    let logs = new AddFundingKey(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'fundingAccountPublicKey':
                  logs.fundingAccountPublicKey = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
                case key == 'keyAllowance':
                  logs.keyAllowance = data.entries[i].value.toString()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "_deleteFundingKey") {
    const receiptId = receipt.id.toBase58()
    let logs = new DeleteFundingKey(`${receiptId}`)

    // Standard receipt properties
    logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
    logs.blockHeight = BigInt.fromU64(blockHeader.height)
    logs.blockHash = blockHeader.hash.toBase58()
    logs.predecessorId = receipt.predecessorId
    logs.receiverId = receipt.receiverId
    logs.signerId = receipt.signerId
    logs.signerPublicKey = publicKey.bytes.toBase58()
    logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
    logs.tokensBurned = outcome.tokensBurnt
    logs.outcomeId = outcome.id.toBase58()
    logs.executorId = outcome.executorId
    logs.outcomeBlockHash = outcome.blockHash.toBase58()

    // Log Parsing
    if(outcome.logs !=null && outcome.logs.length > 0){        
        let parsed = json.fromString(outcome.logs[0])
        if(parsed.kind == JSONValueKind.OBJECT){

          let entry = parsed.toObject()

          //EVENT_JSON
          let eventJSON = entry.entries[0].value.toObject()

          //standard, version, event (these stay the same for a NEP 171 emmitted log)
          for(let i = 0; i < eventJSON.entries.length; i++){
            let key = eventJSON.entries[i].key.toString()
            switch (true) {
              case key == 'standard':
                logs.standard = eventJSON.entries[i].value.toString()
                break
              case key == 'event':
                logs.event = eventJSON.entries[i].value.toString()
                break
              case key == 'version':
                logs.version = eventJSON.entries[i].value.toString()
                break
            }
            
            //data
            let data = eventJSON.entries[0].value.toObject()
            for(let i = 0; i < data.entries.length; i++){
              let key = data.entries[i].key.toString()
              switch (true) {
                case key == 'deletedFundingAccountPublicKey':
                  logs.deletedFundingAccountPublicKey = data.entries[i].value.toString()
                  break
                case key == 'time':
                  logs.time = data.entries[i].value.toBigInt()
                  break
              }
            }
          }
        }
        logs.save()
    }      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }
}
