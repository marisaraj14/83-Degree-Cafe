class Ui {

    static menu(orderInstance) {
        let frag = document.createDocumentFragment();

        orderInstance.menu.forEach(item => {
            let menuElement = `<img src="${item.image}" alt="${item.description}" class="menu-img" style="width:150px;">
            <figcaption>${item.description}</figcaption>
            <figcaption>${Utilities.convertFloatToString(item.price)}</figcaption>`

            let node = document.createElement("figure");
            node.className = "menu-item";
            let dataString = JSON.stringify({ sku: `${item.sku}`, description: `${item.description}`, price: `${item.price}`, taxCode: `${item.taxCode}` })
            node.setAttribute("data-sku", dataString);
            node.innerHTML = menuElement;
            frag.appendChild(node);
        });
        document.getElementById('menu').appendChild(frag);

        document.querySelectorAll(".menu-item").forEach(button => {
            button.addEventListener('click', () => {
                orderInstance.addOrderLine(1, button.getAttribute("data-sku"));
            })
        })


    }

    static recieptDetails(orderInstance) {
        let frag = document.createDocumentFragment();
        orderInstance.items.forEach((orderLine, index) => {
            let reciepttLine = `
            <td class="description">${orderLine.description}</td>
            <td class="qty" onclick="Ui.showQuantityPad(${index.toString()})">${orderLine.quantity}</td>
            <td class="price">${Utilities.convertFloatToString(orderLine.price)}</td>
            <td class="subtotal">${Utilities.convertFloatToString(orderLine.subtotal)}</td>
        `
            let node = document.createElement("tr");
            node.setAttribute("data-index", `${index.toString()}`);
            node.innerHTML = reciepttLine;
            frag.appendChild(node);

        });

        let receiptDetails = document.getElementById("receipt-details");
        while (receiptDetails.hasChildNodes()) {
            receiptDetails.removeChild(receiptDetails.childNodes[0]);
        }

        receiptDetails.appendChild(frag);
        this.summary(orderInstance);

    }

    static invoiceNumber(orderInstance) {
        orderInstance.generateInvoiceNumber();
        const invoiceNumber = orderInstance.invoiceNumber;
        document.getElementById('invoice-number').textContent = `Invoice# ${invoiceNumber}`
    }

    static summary(orderInstance) {
        const summary = orderInstance.getSummary();
        const subtotal = document.getElementById("subtotal-summary");
        const tax = document.getElementById("tax-summary");
        const grandtotal = document.getElementById("grandtotal-summary");

        subtotal.textContent = Utilities.convertFloatToString(summary.subtotal);
        tax.textContent = Utilities.convertFloatToString(summary.tax);
        grandtotal.textContent = Utilities.convertFloatToString(summary.grandtotal);
    }

    static showQuantityPad(id) {
        order.setCurrentId(id);
        order.setPreviousQty();
        const paypad = document.getElementById('quantity-overlay');
        paypad.style.display = "grid";
    }

    static hideQuantityPad(orderInstance) {

        const paypad = document.getElementById('quantity-overlay');
        paypad.style.display = "none";
    }

    static showPaypad(orderInstance) {
        const paypad = document.getElementById('payment-overlay');
        paypad.style.display = "grid";
    }

    static hidePaypad(orderInstance) {
        const paypad = document.getElementById('payment-overlay');
        paypad.style.display = "none";
    }

    static paymentSummary(orderInstance) {
        document.getElementById('amount-paid').textContent = Utilities.convertFloatToString(orderInstance.payment.amountPaid);

        const changeTipTitle = document.getElementById('tip-change-title');
        const paymentType = document.getElementById('payment-type');

        if (orderInstance.payment.type === 'credit') {
            changeTipTitle.textContent = "Tip:";
            paymentType.textContent = "CC";
        } else if (orderInstance.payment.type === 'cash') {
            changeTipTitle.textContent = "Change:";
            paymentType.textContent = "Cash";
        } else {
            changeTipTitle.textContent = "Change:";
            paymentType.textContent = "";
        }

        document.getElementById("tip-change-value").textContent = Utilities.convertFloatToString(orderInstance.payment.changeTip);
    }

    static closeButton(bool) {
        const closeButton = document.getElementById('close-sale');
        if (bool!=false) {
            closeButton.style.display = "grid";
            document.getElementById("close-sale").disabled = false;

        }
        else {
            closeButton.style.display = "grid";
            document.getElementById("close-sale").disabled = true;
        }
    }

}