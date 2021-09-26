//--------------------------------------------MOCK DATA: For local database
const menuData = [
    [101, 'Hamburger', 10.99, 2, 'https://i.ibb.co/Vq2Ny7x/burger-min.jpg'],
    [102, 'Fries', 6.99, 5, 'https://i.ibb.co/LZj9Z6C/fries-min.jpg'],
    [103, 'Salad', 9.5,1, 'https://i.ibb.co/yyPbfKy/salad-min.jpg'],
    [104, 'Pizza', 24.75, 3, 'https://i.ibb.co/B2xPpKg/pizza-min.jpg'],
    [105, 'Cake', 7.0, 4, 'https://i.ibb.co/pfXKGPN/cake-min.jpg'],
    [106, 'Donuts', 5.45, 3, 'https://i.ibb.co/8N0N8qs/donuts-min.jpg'],
    [107, 'Crepes', 12.5, 2, 'https://i.ibb.co/Fb8CQnj/crepes-min.jpg'],
    [108, 'Cupcake', 3.55, 6, 'https://i.ibb.co/s38mNCT/cupcake-min.jpg'],
    [109, 'Sandwich', 8.99, 8, 'https://i.ibb.co/GHK7JZT/sandwich-min.jpg'],
    [110, 'Steak', 26.98, 4, 'https://i.ibb.co/Dr7qFyk/steak-min.jpg'],
    [111, 'Veggie Thali', 13.45, 9, 'https://i.ibb.co/QjpPR3M/thali-min.jpg'],
    [112, 'Sushi', 18.26, 6, 'https://i.ibb.co/FnBRhmF/sushi-min.jpg'],
    [113, 'Chicken Tenders', 6.79, 3, 'https://i.ibb.co/z5XX7wq/chickentenders-min.jpg'],
    [114, 'Sorbet', 5.75, 2, 'https://i.ibb.co/z4vdbw4/sorbet-min.jpg'],
    [115, 'Dumplings', 11.45, 1, 'https://i.ibb.co/kckDb4D/dumplings-min.jpg']
];

const previousSalesData = [
    ["", 4999, 101.0, 1.0, 10.99, 0.5495],
    ["", 4999, 102.0, 2.0, 7.95, 0.3975],
    ["", 4999, 103.0, 3.0, 8.96, 0.45],
    ["", 5000, 106.0, 1.0, 6.99, 0.35],
    ["", 5000, 107.0, 1.0, 5.95, 0.30]
];

const paymentsData = [
    ["", 4999, 56.46,"cc", 5.00],
    ["", 5000, 13.59,"cash", 0]
]


//----------------------------------------------ORDER INSTANTIATION

const order = new Order();
order.menu = menuData;
order.previousSales = previousSalesData;
Ui.menu(order);
Ui.invoiceNumber(order);


//-----------------------------------------------STATIC  EVENT LISTENERS

document.getElementById('clear-order').addEventListener('click', () => {
    order.clearitems();
})



document.querySelectorAll('.paypad-show').forEach(button => {
    button.addEventListener('click', () => {
        Ui.showPaypad(order);
        order.changePayment(JSON.parse(button.getAttribute("data-payment-type")));
    })
})

document.getElementById('paypad-close').addEventListener('click', () => {
    order.clearPayment();
    Ui.hidePaypad(order);
})

document.getElementById('quantitypad-close').addEventListener('click', () => {
    order.clearPayment();
    Ui.hideQuantityPad(order);
})


document.querySelectorAll('.paypad-btn').forEach(button => {
    button.addEventListener('click', () => {
        Utilities.paypad(button.getAttribute("data-id"), order);
    })
})

document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', () => {
        Utilities.quantitypad(button.getAttribute("data-id"), order);
    })
})

