import { Camunda8 } from '@camunda8/sdk';
import 'dotenv/config';

const c8 = new Camunda8();
const zeebe = c8.getZeebeGrpcApiClient();

zeebe.createWorker({
  taskType: "card-payment",
  taskHandler: (job) => {
    console.log(`[Zeebe Worker] handling job of type ${job.type}`);

    let resultStatus, resultMessage;

    switch (job.variables.cardHolderName) {
      case "Jordan":
        resultStatus = "refused";
        resultMessage = "Payment refused. Please contact your bank.";
        break;

      case "Ragnar":
        resultStatus = "error";
        resultMessage = "Technical issue at the payment provider. Please try again later.";
        break;

      case "William":
        resultStatus = "success";
        resultMessage = "Payment successful. Thank you!";
        break;

      default:
        resultStatus = "unknown";
        resultMessage = "Cardholder not recognized. Please check the name and try again.";
        break;
    }

    return job.complete({
        resultStatus: resultStatus,
        resultMessage: resultMessage
    });
  },
});