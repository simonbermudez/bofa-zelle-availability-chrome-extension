let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

chrome.storage.local.get(["transactions"], (result) => {
    if (!result.transactions) {
        return
    }
    let transactions = result.transactions

    transactions = transactions.filter(transaction => 
        (transaction.description.includes("Zelle payment to") || 
        transaction.description.includes("Zelle Transfer CONF#")) &&
        transaction.date > Date.now() - 1000 * 60 * 60 * 24 * 30 // 30 days
    )

    let totalTransactions = transactions.length
    let totalAmount = transactions.reduce((acc, transaction) => {
        return acc + parseFloat(transaction.amount.replace(/[^0-9.-]+/g,""))
    }, 0)
    let minTransaction = transactions.reduce((acc, transaction) => {
        return Math.min(acc, parseFloat(transaction.amount.replace(/[^0-9.-]+/g,"")))
    }, 0)
    let averageTransaction = totalAmount / totalTransactions

    let totalAvailableThisMonth = 20000 + totalAmount

    document.querySelector("#totalTransactions").innerText = totalTransactions
    document.querySelector("#totalAmount").innerText = USDollar.format(totalAmount.toFixed(2))
    document.querySelector("#minTransaction").innerText = USDollar.format(minTransaction.toFixed(2))
    document.querySelector("#averageTransaction").innerText = USDollar.format(averageTransaction.toFixed(2))
    document.querySelector("#totalAvailableThisMonth").innerText = USDollar.format(totalAvailableThisMonth.toFixed(2))
});

