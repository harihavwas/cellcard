
document.getElementById("transactionTypeSellin").addEventListener("change", transactionType);
document.getElementById("transactionTypeSellout").addEventListener("change", transactionType);
document.getElementById("customerTypeSelect").addEventListener("change", customertype);
document.getElementById("commercialTypeSelect").addEventListener("change", levelOptions);

window.onload = function () {
    transactionType(); // apply default Sellin UI
    updateInvoiceType();
    loadProductTypes();
    updatePartnerList();
    loadProductsByType();
    showSelectedProduct();

};

// MAIN handler for both radios
function transactionType() {
    let type = document.querySelector('input[name="transactionType"]:checked').value;

    if (type === "Sellout") {
        // Show Sellout related fields
        document.getElementById("saleTypeDiv").style.display = "block";
        document.getElementById("customerTypeDiv").style.display = "block";

        // Hide Sellin fields
        document.getElementById("commercialChannelDiv").style.display = "none";
        document.getElementById("levelDiv").style.display = "none";
        document.getElementById("partnerDiv").style.display = "none";

        customertype();
    }
    else if (type === "Sellin") {
        // Show Sellin related fields
        document.getElementById("commercialChannelDiv").style.display = "block";
        document.getElementById("levelDiv").style.display = "block";
        document.getElementById("partnerDiv").style.display = "block";
        levelOptions();

        // Hide Sellout fields
        document.getElementById("saleTypeDiv").style.display = "none";
        document.getElementById("customerTypeDiv").style.display = "none";
        document.getElementById("serviceTypeDiv").style.display = "none";
    }
}


// CUSTOMER TYPE LOGIC (works only for Sellout)
function customertype() {
    let customerTypeValue = document.getElementById("customerTypeSelect").value;
    let type = document.querySelector('input[name="transactionType"]:checked').value;

    if (type === "Sellout" && customerTypeValue === "General") {
        document.getElementById("serviceTypeDiv").style.display = "block";
    }
    else {
        document.getElementById("serviceTypeDiv").style.display = "none";
    }
}
// Initial call to set the correct visibility on page load


function levelOptions() {
    let commercialValue = document.getElementById("commercialTypeSelect").value;
    let levelSelect = document.getElementById("levelSelect");
    let partnerSelect = document.getElementById("partnerSelect"); // IMPORTANT: Added this

    // Clear existing options
    levelSelect.innerHTML = "";
    partnerSelect.innerHTML = "";

    if (commercialValue === "distributionChannel") {
        levelSelect.innerHTML = `
            <option value="reseller">Reseller</option>
        `;
        updatePartnerList(); // update partner
    }
    else if (commercialValue === "alternativeChannel") {
        levelSelect.innerHTML = `
            <option value="bankingPartner">Banking Partner</option>
            <option value="onlinePartner">Online Partner</option>
            <option value="convinientStore">Convenient Store</option>
        `;
        updatePartnerList(); // update partner
    }
}

function updatePartnerList() {
    let levelSelectValue = document.getElementById("levelSelect").value;
    let partnerSelect = document.getElementById("partnerSelect");

    partnerSelect.innerHTML = ""; // clear

    if (levelSelectValue === "reseller") {
        partnerSelect.innerHTML = `
            <option value="1111">1111 | Partner A</option>
        `;
    }
    else if (levelSelectValue === "bankingPartner") {
        partnerSelect.innerHTML = `
            <option value="2222">2222 | Partner B</option>
            <option value="3333">3333 | Partner C</option>
        `;
    }
    else if (levelSelectValue === "onlinePartner") {
        partnerSelect.innerHTML = `
            <option value="4444">4444 | Partner D</option>
        `;
    }
    else if (levelSelectValue === "convinientStore") {
        partnerSelect.innerHTML = `
            <option value="5555">5555 | Partner E</option>
            <option value="6666">6666 | Partner F</option>
        `;
    }
}


function updateInvoiceType() {
    const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
    const customerType = document.getElementById("customerTypeSelect").value;
    const serviceType = document.getElementById("serviceTypeSelect").value;
    const commercialChannel = document.getElementById("commercialTypeSelect").value;
    const level = document.getElementById("levelSelect").value;

    const invoiceType = document.getElementById("invoiceTypeSelect");

    // Always clear first
    invoiceType.innerHTML = `
        <option value="">Select Invoice Type</option>
        <option value="Commercial">Commercial</option>
        <option value="Tax">Tax</option>
    `;

    // ------------------------------
    // SELL OUT LOGIC
    // ------------------------------
    if (transactionType === "Sellout") {

        if (customerType === "General" && serviceType === "Prepaid") {
            // Auto Commercial
            invoiceType.value = "Commercial";
            invoiceType.disabled = true;
            return;
        }

        if (customerType === "General" && serviceType === "nonPrepaid") {
            // User must choose
            invoiceType.disabled = false;
            return;
        }

        if (customerType === "Partner") {
            // User must choose
            invoiceType.value = "Tax";
            invoiceType.disabled = true;
            return;
        }

        // Default: user selects
        invoiceType.disabled = false;
        return;
    }


    // ------------------------------
    // SELL IN LOGIC
    // ------------------------------
    if (transactionType === "Sellin") {

        // Case 1: Distribution Channel → Reseller → Commercial
        if (commercialChannel === "distributionChannel" && level === "reseller") {
            invoiceType.value = "Commercial";
            invoiceType.disabled = true;
            return;
        }

        // Case 2: Alternate Channel → Online / Banking / Convenient → Tax
        if (commercialChannel === "alternativeChannel" &&
            (level === "onlinePartner" || level === "bankingPartner" || level === "convinientStore")) {
            invoiceType.value = "Tax";
            invoiceType.disabled = true;
            return;
        }

        // If no rule matched
        invoiceType.disabled = true;
        invoiceType.value = "";
    }
}

const today = new Date();

// Format the date as 'YYYY-MM-DD' which is required for the input type="date"
function formatDate(date) {
    // Get the year, month, and day
    const year = date.getFullYear();
    // Add 1 to month because getMonth() returns 0-11
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Return the formatted string
    return `${year}-${month}-${day}`;
}

// Get the input element by its ID
const dateInput = document.getElementById('transactionDate');

// Set the value of the input to today's formatted date
if (dateInput) {
    dateInput.value = formatDate(today);
}


function loadProductTypes() {
    let transactionType = document.querySelector('input[name="transactionType"]:checked').value;
    let saleType = document.getElementById("saleTypeSelect") ? document.getElementById("saleTypeSelect").value : "";
    let productSelect = document.getElementById("productTypeSelect");

    productSelect.innerHTML = ""; // clear

    // ---------------------- SELLIN ----------------------
    if (transactionType === "Sellin") {
        productSelect.innerHTML = `
            <option value="SIM">SIM</option>
            <option value="scratchCards">Scratch Cards</option>
        `;
        return;
    }

    // ---------------------- SELLOUT ----------------------
    if (transactionType === "Sellout") {

        if (saleType === "Product") {
            productSelect.innerHTML = `
                <option value="SIM">SIM</option>
                <option value="scratchCards">Scratch Cards</option>
                <option value="devices">Device</option>
            `;
            return;
        }

        if (saleType === "Service") {
            productSelect.innerHTML = `
                <option value="services">Services</option>
            `;
            return;
        }
    }
}


function loadProductsByType() {
    let selectedType = document.getElementById("productTypeSelect").value;
    let productDropdown = document.getElementById("productSelect");

    productDropdown.innerHTML = ""; // reset

    if (selectedType === "SIM") {
        productDropdown.innerHTML = `
                <option value="Blank SIM">Blank SIM</option>
                <option value="USIM_JAVA">USIM_JAVA</option>            `;
        return;
    }

    if (selectedType === "scratchCards") {
        productDropdown.innerHTML = `
                <option value="1$">1$</option>
                <option value="5$">5$</option>
                <option value="10$">10$</option>            `;
        return;
    }

    if (selectedType === "devices") {
        productDropdown.innerHTML = `
                <option value="iPhone">iPhone</option>
                <option value="Samsung">Samsung</option>
          `;
        return;
    }
}


const productData = {
    "SIM": [
        { "name": "Blank SIM", "itemCode": "Blank SIM", "Description": "Blank SIM", "price": 1 },
        { "name": "USIM_JAVA", "itemCode": "USIM_JAVA", "Description": "USIM_JAVA", "price": 12 }
    ],
    "scratchCards": [
        { "name": "1$", "itemCode": "1$", "Description": "1$", "price": 1 },
        { "name": "5$", "itemCode": "5$", "Description": "5$", "price": 5 },
        { "name": "10$", "itemCode": "10$", "Description": "10$", "price": 10 }
    ],
    "devices": [
        { "name": "iPhone 15", "itemCode": "iPhone 15", "Description": "iPhone 15", "price": 15 },
        { "name": "Samsung", "itemCode": "Samsung", "Description": "Samsung", "price": 15 }
    ],
    "services": [
        { "name": "Service", "itemCode": "Service", "Description": "Service", "price": 20 }
    ]
};


function showSelectedProduct() {

    let selectedProduct = document.getElementById("productSelect").value;
    let productDescription = document.getElementById("productSelect").value;
    let productType = document.getElementById("productTypeSelect").value;
    let product = productData[productType].find(item => item.itemCode === selectedProduct);
    let qty = parseInt(document.getElementById("quantityInput").value);

    let totalAmount = product.price * qty;
    let exclVat = totalAmount / 1.1;
    let Vat = totalAmount / 11;


    document.getElementById("selectedProductDisplay").textContent =
        selectedProduct ? "ItemCode: " + selectedProduct : "";
    document.getElementById("productDescription").textContent =
        productDescription ? "Description: " + productDescription : "";
    if (product) {
        document.getElementById("productPriceDisplay").textContent =
            "Unit Price: $" + product.price;
        document.getElementById("productTotalPriceWithoutTaxDisplay").textContent =
            "Total Amount (Excl. VAT): $" + exclVat.toFixed(2);
        document.getElementById("productTotalPriceTaxDisplay").textContent =
            "VAT (10%): $" + Vat.toFixed(2);
        document.getElementById("subTotal").textContent =
            "Subtotal (VAT Included): $" + totalAmount.toFixed(2);
    }

}

function decreaseQty() {
    let qty = parseInt(document.getElementById("quantityInput").value);
    if (qty > 1) {
        qty--;
        document.getElementById("quantityInput").value = qty;
    }
    showSelectedProduct();
}

function increaseQty() {
    let qty = parseInt(document.getElementById("quantityInput").value);
    qty++;
    document.getElementById("quantityInput").value = qty;
    showSelectedProduct();
}

function isVisible(id) {
    const el = document.getElementById(id);
    return el && el.style.display !== "none";
}

function saveForm() {

    const transactionType = document.querySelector('input[name="transactionType"]:checked').value;

    const customerType = isVisible("customerTypeDiv")
        ? document.getElementById("customerTypeSelect").value
        : "";

    const serviceType = isVisible("serviceTypeDiv")
        ? document.getElementById("serviceTypeSelect").value
        : "";

    const saleType = isVisible("saleTypeDiv")
        ? document.getElementById("saleTypeSelect").value
        : "";

    const commercialChannel = isVisible("commercialChannelDiv")
        ? document.getElementById("commercialTypeSelect").value
        : "";

    const level = isVisible("levelDiv")
        ? document.getElementById("levelSelect").value
        : "";

    const partner = isVisible("partnerDiv")
        ? document.getElementById("partnerSelect").value
        : "";

    const invoiceType = isVisible("invoiceTypeDiv")
        ? document.getElementById("invoiceTypeSelect").value
        : "";

    const store = document.getElementById("storeSelect").value;
    const employee = document.getElementById("employeeSelect").value;
    const transactionReference = document.getElementById("transactionReference").value;
    const transactionDate = document.getElementById("transactionDate").value;

    const productType = isVisible("productTypeDiv")
        ? document.getElementById("productTypeSelect").value
        : "";

    const formData = {
        transactionType,
        customerType,
        serviceType,
        saleType,
        commercialChannel,
        level,
        partner,
        invoiceType,
        store,
        employee,
        transactionReference,
        transactionDate,
        productType
    };

    localStorage.setItem("formData", JSON.stringify(formData));

    window.location.href = "setProductDetails.html";
}


let data = JSON.parse(localStorage.getItem("formData"));

console.log(data.transactionType);
console.log(data.customerType);
console.log(data.saleType);
