const clickViewMore = async () => {
    console.log("Clicking View More")
    let viewMoreButton = document.querySelector("#view-more-activity-desktop")
    console.log(viewMoreButton)
    viewMoreButton?.click()
    await new Promise(resolve => setTimeout(resolve, 5000))
}

const getTransactions = () => {
    console.log("Loading Transactions...")
    let transactionsElements = Array.from(document.querySelectorAll("#txn-activity-table > tbody > tr.activity-row"))
    return transactionsElements.map(transaction => {
        console.log("processing transaction")
        return {
            date: transaction.querySelector(".date-cell").innerText != 'Processing' ? Date.parse(transaction.querySelector(".date-cell").innerText) : Date.now(),
            description: transaction.querySelector(".desc-cell").innerText,
            amount: transaction.querySelector(".amount-cell").innerText,
        }
    })
}

const scrapeTransactions = async () => {
    console.log("Scraping Transactions")
    chrome.runtime.sendMessage({gettingTransactions: true}, (response) => {
        console.log(response)
    })
    for (let i = 1; i <=0; i++) {
        await clickViewMore()
    }
    return getTransactions()
}
window.onload = async (event) => {
    console.log('page is fully loaded');
    // wait 3 seconds before scraping transactions
    await new Promise(resolve => setTimeout(resolve, 3000))
    scrapeTransactions().then(transactions => {
        console.log(transactions)
        chrome.storage.local.set({ transactions: transactions }, function(){
            console.log('Value is set to ', transactions);
        });
        
    }
    )
};

