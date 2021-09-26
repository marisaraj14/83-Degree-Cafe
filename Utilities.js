class Utilities {

    static convertFloatToString(float) {
        let priceParams = {
            style: "currency",
            currency: "INR"
        };

        return float.toLocaleString("en-in", priceParams);
    }

    static roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    static paypad(input, orderInstance) {
        if (!isNaN(parseInt(input))) {
            this.numberPaypad(parseInt(input), orderInstance);
        } else if (input === "back") {
            this.backPaypad(orderInstance);
        } else if (input === "clear") {
            this.clearPaypad(orderInstance);
        } else {
            orderInstance.closeSale();
        }
    }

    static quantitypad(input, orderInstance) {
        const id = orderInstance.currentIndex;
        if (!isNaN(parseInt(input))) {
            orderInstance.changeQuantity(id, parseInt(input));
        } else if (input === "back") {
            orderInstance.removeQuantity(id);
        } else if (input === "delete") {
            orderInstance.deleteitemsLine(id);
        }
        else if (input == "cancel") {
            orderInstance.cancelChange(id);
        }
    }

    static numberPaypad(input, orderInstance) {
        const currentInput = this.roundToTwo(input * .01);
        const currentAmountPaid = this.roundToTwo(orderInstance.payment.amountPaid);
        const newAmountPaid = this.roundToTwo((currentAmountPaid * 10) + currentInput);

        if (currentAmountPaid === 0) {
            orderInstance.changePayment({ amountPaid: currentInput });
        } else {
            orderInstance.changePayment({ amountPaid: newAmountPaid });
        }
    }

    static backPaypad(orderInstance) {
        const currentPayment = orderInstance.payment.amountPaid;

        if (currentPayment > 0) {
            const toSubtract = ((currentPayment * 100) % 10) * 0.01;
            const newAmount = (currentPayment - toSubtract) * 0.1;
            orderInstance.changePayment({ amountPaid: newAmount });
        }
    }

    static clearPaypad(orderInstance) {
        orderInstance.changePayment({ amountPaid: 0 });
    }


}
