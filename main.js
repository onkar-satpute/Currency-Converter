import countryList from "./codes.js";

const selects = document.querySelectorAll(".select-container select");
let amtInput = document.querySelector("#amount input");
const BASE_URL ="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-02/v1/currencies";
const createElement = (name, currCode)=>{
  const element = document.createElement(name);
  element.innerText = currCode;
  element.value=currCode;
  return element;
}
let lastCurrencyFetched = "";
let data;

(() => {
  for (let select of selects) {
    for (let currCode in countryList) {
      const optionElem = createElement("option", currCode);

      if (currCode == "USD" && select.name == "from") {
        optionElem.defaultSelected = "true";
      } else if (currCode == "INR" && select.name == "to") {
        optionElem.defaultSelected = "true";
      }
      select.append(optionElem);
    }
    select.addEventListener("change", updateFlag);
  }
})();

async function getExchangeRate() {
  const fromCurrency = document.querySelector("#from-select").value;
  const toCurrency = document.querySelector("#to-select").value;
  if (lastCurrencyFetched !== fromCurrency) {
    try {
      const URL = `${BASE_URL}/${fromCurrency.toLowerCase()}.json`;
      let response = await fetch(URL);
      data = await response.json();
      console.log(data);
    } catch (err) {
      alert("Something went wrong!", err)
      console.log("Something went wrong", err);
      return;
    }
  }

  lastCurrencyFetched = fromCurrency;

  if (amtInput.value < 1) {
    amtInput.value = 1;
  }
  let rate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
  display(fromCurrency, toCurrency, rate, amtInput.value);
}

function updateFlag(event) {
  const flagImg = event.target.parentElement.querySelector("img");
  let countryCode = countryList[event.target.value];
  flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  flagImg.alt = countryCode;
}

function display(fromCurrency, toCurrency, rate, amtVal) {
  const resultParas = document.querySelectorAll("#result p");
  resultParas[0].innerHTML = `1 ${fromCurrency} = ${rate.toFixed(
    2
  )} ${toCurrency}`;
  resultParas[1].innerHTML = `${amtVal} ${fromCurrency} = ${
    amtVal * rate
  } ${toCurrency}`;
}

function swapCurrencies() {
  const selectContainer = document.querySelectorAll(".select-container");
  const imgFrom = selectContainer[0].querySelector("img");
  const imgTo = selectContainer[1].querySelector("img");
  const fromCurrency = selectContainer[0].querySelector("select");
  const toCurrency = selectContainer[1].querySelector("select");
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

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  getExchangeRate();
});
document.querySelector("#swap-btn").addEventListener("click", (e) => {
  e.target.classList.toggle("rotate");
  swapCurrencies();
});

window.addEventListener("load", getExchangeRate);

//adding new function
document.querySelector('amount input').addEventListener('blur', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  const input = document.getElementById('numberInput').value;
  const errorDiv = document.getElementById('error');

  // Check if input is a number
  if (!/^\d+$/.test(input)) {
      errorDiv.textContent = 'Error: Please enter only numbers.';
  } else {
      errorDiv.textContent = ''; // Clear error message
      alert('Form submitted successfully!'); // Or handle form submission here
      // You can add code to submit the form data to the server
  }
});
