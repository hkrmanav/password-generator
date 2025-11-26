const inputSlider=document.querySelector("[data-lengthSlider]");
// custom attribute used to fetch the data
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#number");
const symbolsCheck=document.querySelector("#symbol");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbol='~`!@#$%^&*()_-=+{[}]:;",<.>/?';


let password="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");


// set passwordLength
function handleSlider(){
    // password length ko UI pe display krta h bas itna hi kaam h iska
    // tbhi jaha bhi hum passwordLength change kr rhe toh isko call kr rhe h
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    
    inputSlider.style.backgroundSize=( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    // shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRanInteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRanInteger(0,9);
}

function generateLowerCase(){
    // Note the change of int to character
    return String.fromCharCode(getRanInteger(97,123));
}

function generateUpperCase(){
    // Note the change of int to character
    return String.fromCharCode(getRanInteger(65,90));
}

function generateSymbol(){
    const randNum=getRanInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if (uppercaseCheck.checked) hasUpper=true;
    if (lowercaseCheck.checked) hasLower=true;
    if (numbersCheck.checked) hasNum=true;
    if (symbolsCheck.checked) hasSym=true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) && 
        (hasNum || hasSym) && 
        passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

function shufflePassword(shufflePassword){
    // Fisher Yates Method=>shuffling array and most common method
    for (let i=shufflePassword.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=shufflePassword[i];
        shufflePassword[i]=shufflePassword[j];
        shufflePassword[j]=temp;
    }
    let str="";
    shufflePassword.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked)
            checkCount++; 
    })

    // special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();    
    }
}

allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change',handleCheckBoxChange);
})

generateBtn.addEventListener('click',()=>{
    // none of the checkbox are selected
    if(checkCount<=0) return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // lets find the new password
    // remove old password
    password="";

    // lets put the stuff mentioned by checkbox
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }

    // if (lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }

    // if (numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }

    // if (symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

// doing the above thing with different approach
    let funArr=[];
    if (uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funArr.push(generateSymbol);

    // compulsory addition
    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }

    // remaining addition
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex=getRanInteger(0,funArr.length);
        password+=funArr[randIndex]();
    }
    
    // shuffule the password
    password=shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value=password;


    // calculate strength
    calcStrength();
})