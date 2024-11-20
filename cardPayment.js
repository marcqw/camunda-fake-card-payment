import { Camunda8 } from '@camunda8/sdk';
import 'dotenv/config';

const c8 = new Camunda8();
const zeebe = c8.getZeebeGrpcApiClient();


console.log("Starting worker...");

zeebe.createWorker({
  taskType: "card-payment",
  taskHandler: (job) => {
    console.log(`[Zeebe Worker] handling job of type ${job.type}`);

    let resultStatus, resultMessage;

    switch (job.variables.cardHolderName) {
      case "Jordan":
        resultStatus = "declined";
        resultMessage = "Transaction denied.";
        break;

      case "Aurel":
        resultStatus = "limit_exceeded";
        resultMessage = "Card limit exceeded.";
        break;

      case "Ragnar":
        resultStatus = "error";
        resultMessage = "Technical issue at the payment provider. Please try again later.";
        break;

      case "William":
        resultStatus = "approved";
        resultMessage = "Transaction successful.";
        break;

      default:
        resultStatus = "unknown";
        resultMessage = "Cardholder not recognized. Please check the name and try again.";
        break;
    }

    if (resultStatus === "approved") {
      return job.complete({
        resultStatus: resultStatus,
        resultMessage: resultMessage
      });
    } else if (resultStatus === "declined") {
      return job.error({
        errorCode: "CARD_PAYMENT_FAILED",
        resultStatus: resultStatus,
        resultMessage: resultMessage
      });
    } else if (resultStatus === "limit_exceeded") {
      return job.error({
        errorCode: "CARD_PAYMENT_FAILED",
        resultStatus: resultStatus,
        resultMessage: resultMessage
      });
    } 
  },
});