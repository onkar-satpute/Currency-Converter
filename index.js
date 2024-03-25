import countryList from "./codes.js";
const selects = document.querySelectorAll(".select-container select");
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-02/v1/currencies"
//https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-02/v1/currencies/eur.json
const updateFlag = ((event)=> {
  const flagImg = event.target.parentElement.querySelector("img");
  console.log(flagImg, event.target.value);
  let countryCode = countryList[event.target.value];
  flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  flagImg.alt=countryCode;
});

for (let select of selects) {
  for (let currCode in countryList) {
    const optionElem = document.createElement("option");
    optionElem.innerText = currCode;
    optionElem.value = currCode;
    if (currCode == "USD" && select.name == "from") {
      optionElem.defaultSelected = "true";
    } else if (currCode == "INR" && select.name == "to") {
      optionElem.defaultSelected = "true";
    }
    select.append(optionElem);
    select.addEventListener("change", updateFlag);
  }
}
const display = (fromCurrency, toCurrency, rate, amtVal)=> {
  const resultParas = document.querySelectorAll("#result p");
  resultParas[0].innerHTML = `1 ${fromCurrency} = ${rate.toFixed(2)} ${toCurrency}`
  resultParas[1].innerHTML = `${amtVal} ${fromCurrency} = ${amtVal*rate} ${toCurrency}`
}
const getExchangeRate = async()=> {
  const fromCurrency = document.querySelector("#from-select").value;
  const toCurrency = document.querySelector("#to-select").value;
  const URL = `${BASE_URL}/${fromCurrency.toLowerCase()}.json`;
  let amtInput= document.querySelector("#amount input");
  let response = await fetch(URL);
  let data = await response.json();
  if(amtInput.value<1){
    amtInput.value = 1;
  }
  let rate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
  display(fromCurrency,toCurrency,rate, amtInput.value);
}


const swapCurrencies=()=>{
  const selectContainer = document.querySelectorAll(".select-container");
  const imgFrom = selectContainer[0].querySelector("img");
  const imgTo =selectContainer[1].querySelector("img");
  const fromCurrency =selectContainer[0].querySelector("select");
  const toCurrency =selectContainer[1].querySelector("select");
  let temp;
  //sawpping flag images
  temp = imgTo.src;
  imgTo.src = imgFrom.src;
  imgFrom.src = temp;
  //swapping select values
  temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  getExchangeRate();
}
document.querySelector("form").addEventListener("submit", (e)=> {
  e.preventDefault();
  getExchangeRate();
})
document.querySelector("#swap-btn").addEventListener("click",(e)=>{
  e.target.classList.toggle("rotate")
  swapCurrencies()
});
window.addEventListener("load", getExchangeRate)