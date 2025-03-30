const simulateCardPayment = async (paymentInfo, amount) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Vérification basique du numéro de carte (doit contenir 16 chiffres)
      if (!paymentInfo.cardNumber || paymentInfo.cardNumber.length !== 16) {
        return reject(new Error("Invalid card number"));
      }
      // Simulation d'un paiement approuvé
      resolve({ status: "approved", transactionId: `TX-${Date.now()}` });
    }, 1000);
  });
};

module.exports = {
  simulateCardPayment,
};
