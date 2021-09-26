class Order {
    constructor() {
        this._menu = [];
        this._previousSales = [];
        this._invoiceNumber = "";
        this._items = [];
        this._currentIndex = 0;
        this._payment = {
            amountPaid: 0,
            type: "",
            changeTip: 0
        };
    }

    get menu() {
        return this._menu;
    }

    set menu(menuArray) {
        this._menu;

        menuArray.forEach(menuItem => {
            //Do Data validation before inputting values
            let currItem = {};
            currItem.sku = menuItem[0];
            currItem.description = menuItem[1];
            currItem.price = menuItem[2];
            currItem.taxCode = menuItem[3];
            currItem.image = menuItem[4];
            this._menu.push(currItem);
        })
    }

    get previousSales() {
        return this._previousSales;
    }

    set previousSales(salesData) {
        this._previousSales = salesData;
    }

    get invoiceNumber() {
        return this._invoiceNumber;
    }

    set invoiceNumber(num) {
        this._invoiceNumber = num.toString();
    }

    get items() {
        return this._items;
    }

    set items(data) {
        this._items = data;

    }

    get payment() {
        return this._payment;
    }

    set payment(payment) {
        this._payment = payment;
    }

    generateInvoiceNumber() {
        if (this.previousSales.length < 1 || this.previousSales == undefined) {
            this.invoiceNumber = 1;
        }
        else {
            let skuArray = this.previousSales.map(sku => sku[1]);
            let highest = skuArray.reduce(function (a, b) {
                return Math.max(a, b);
            });
            this.invoiceNumber = highest + 1;
        }
    }

    //Called when an item from the menu is clicked.
    addOrderLine(quantity, data) {
        let currentLine = {};
        let lineData = JSON.parse(data);
        let position = 0;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].sku == lineData.sku) {
                position = i + 1;
            }
            else {
                position = 0;
            }
        }
        if (position == 0) {
            currentLine.sku = lineData.sku;
            currentLine.description = lineData.description;
            currentLine.quantity = quantity;
            currentLine.price = Utilities.roundToTwo(parseFloat(lineData.price));
            currentLine.subtotal = currentLine.quantity * currentLine.price;
            currentLine.taxCode = lineData.taxCode;
            currentLine.tax = Utilities.roundToTwo(lineData.taxCode * currentLine.quantity);
            this.items.push(currentLine);
            Ui.showQuantityPad(this.items.length - 1);
            Ui.recieptDetails(this);
        }
        else {
            //open quantity pad for that matched item
            Ui.showQuantityPad(position - 1);
        }

    }

    deleteitemsLine(index) {
        this.items.splice(index, 1);
        Ui.recieptDetails(this);
        Ui.hideQuantityPad();
    }

    clearitems() {
        this.items = [];

        Ui.recieptDetails(this);
    }

    getSummary() {
        const summary = {
            subtotal: 0,
            tax: 0,
            grandtotal: 0
        }

        this.items.forEach(item => {
            summary.subtotal += item.subtotal;
            summary.tax += item.tax;
        })


        summary.grandtotal = summary.subtotal + summary.tax;

        return summary;
    }

    setCurrentId(id) {
        this.currentIndex = id;
    }
    changeQuantity(id, input) {
        this.items[id].quantity = this.items[id].quantity * 10 + input;
        if (this.items[id].quantity == 0) {
            document.getElementById("quantitypad-close").disabled = true;
        }
        else {
            document.getElementById("quantitypad-close").disabled = false;
        }
        this.items[id].subtotal = this.items[id].quantity * this.items[id].price;
        this.items[id].tax = Utilities.roundToTwo(this.items[id].taxCode * this.items[id].quantity);
        Ui.recieptDetails(this);


    }

    removeQuantity(id) {
        //Deleting the Quantity & Changing Qty, Tax and SubTotal.
        this.items[id].quantity = parseInt(this.items[id].quantity / 10);
        if (this.items[id].quantity == 0) {
            document.getElementById("quantitypad-close").disabled = true;
        }
        else {
            document.getElementById("quantitypad-close").disabled = false;

        }
        this.items[id].tax = Utilities.roundToTwo(this.items[id].taxCode * this.items[id].quantity);
        this.items[id].subtotal = this.items[id].quantity * this.items[id].price;
        Ui.recieptDetails(this);
    }

    cancelChange(id) {
        this.items[id].quantity = this.items[id].prevQty;
        this.items[id].tax = Utilities.roundToTwo(this.items[id].taxCode * this.items[id].quantity);
        this.items[id].subtotal = this.items[id].quantity * this.items[id].price;
        Ui.recieptDetails(this);
        Ui.hideQuantityPad();
    }

    changePayment(input) {
        const itemsGrandTotal = this.getSummary().grandtotal;
        if (input.amountPaid != null) this.payment.amountPaid = parseFloat(input.amountPaid);
        if (input.type != null) this.payment.type = input.type;
        if (this.payment.amountPaid >= itemsGrandTotal && this.payment.amountPaid!=0 && itemsGrandTotal!=0) {
            this.payment.changeTip = this.payment.amountPaid - itemsGrandTotal;
            Ui.closeButton(true);
        }
        else if (this.payment.amountPaid < itemsGrandTotal) {
            Ui.closeButton(false);
        }
        else if(itemsGrandTotal==0){
            Ui.closeButton(false);
            this.payment.changeTip = 0;
        }

        Ui.paymentSummary(this);
    }

    clearPayment() {
        this.payment = {
            amountPaid: 0,
            type: "",
            changeTip: 0
        };

        Ui.paymentSummary(this);
    }

    setPreviousQty() {
        this.items[this.currentIndex].prevQty = this.items[this.currentIndex].quantity;
    }

    exportitems(date) {
        this.items.forEach(itemsLine => {
            let currentLine = [];
            currentLine[0] = date;
            currentLine[1] = this.invoiceNumber;
            currentLine[2] = itemsLine.sku;
            currentLine[3] = itemsLine.quantity;
            currentLine[4] = itemsLine.price;
            currentLine[5] = itemsLine.tax;

            this.previousSales.push(currentLine);
        })
    }

    exportPayment(date) {
        const currentPayment = [];
        const tipChange = Utilities.roundToTwo(this.payment.amountPaid - this.getSummary().grandtotal);

        currentPayment[0] = date;
        currentPayment[1] = this.invoiceNumber;
        currentPayment[2] = this.getSummary().grandtotal;
        currentPayment[3] = this.payment.type;

        if (this.payment.type == "cash") {
            currentPayment[4] = 0;
        } else {
            currentPayment[4] = tipChange;
        }
        paymentsData.push(currentPayment);
    }

    closeSale() {
        const date = new Date();
        this.exportitems(date);
        this.exportPayment(date);

        Ui.hidePaypad(this);
        this.clearPayment();
        this.clearitems();
        Ui.invoiceNumber(this);

    }

}