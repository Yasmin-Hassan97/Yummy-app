const BASE_URL='https://www.themealdb.com/api/json/v1/1'
const closeIcon=document.querySelector(".close")
const openIcon=document.querySelector(".open");
const loadingScreen=document.querySelector('.loading-screen')
const rowData=document.getElementById('rowData');
const searchContainer= document.getElementById('searchContainer')

const innerSidebarWidth=$('.nav-tab').innerWidth()

$('.side-nav-menu').css({left:`-${innerSidebarWidth}px`});
openIcon.classList.toggle('d-none');
closeIcon.classList.toggle('d-none');




function toggleSideBar(){
const currentLeft=$('.side-nav-menu').css('left');

closeIcon.classList.toggle('d-none');
openIcon.classList.toggle('d-none');
$('.links li').css('top', '300px');

if(currentLeft=='0px'){
  $('.side-nav-menu').animate({left:`-${innerSidebarWidth}px`},500);

  $(".links li").animate({top: 300}, 500)
}else{
  $('.side-nav-menu').animate({left: 0},500);

  for (let i = 0; i < 5; i++) {
    $(".links li").eq(i).animate({
        top: 0
    }, (i + 5) * 100)}

}


}


function displayMeals(someMeals){
  let mealsContainer=``;
  for(let i=0; i<someMeals.length; i++){
 mealsContainer+=
 `
 <div class="col-md-3">
   <div  onclick="getMealDetails('${someMeals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
      <img class="w-100" src=${someMeals[i].strMealThumb} alt="" srcset="">
          <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
             <h3>${someMeals[i].strMeal}</h3>
           </div>
          </div>
        </div>
 `

 document.getElementById('rowData').innerHTML=mealsContainer
  }
}





async function getData(){
  const response= await fetch(`${BASE_URL}/search.php?s`);
  const data= await response.json();
  loadingScreen.classList.add('d-none')
  displayMeals(data.meals)
}
getData()

// =================search============================

function showSearchInputs(){
  toggleSideBar();
  let searchInputs=
  `
  <div class="row py-4 ">
    <div class="col-md-6 ">
        <input onkeyup=searchByName(this.value) class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input onkeyup=searchByLetter(this.value) maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
    </div>
</div>
  `
  searchContainer.innerHTML=searchInputs;
rowData.innerHTML = ""
}




async function searchByName(mealName){
  $(".inner-loading-screen").fadeIn(300)

  const response= await fetch(`${BASE_URL}/search.php?s=${mealName}`);
  const data= await response.json();

 
  data.meals ? displayMeals(data.meals) : displayMeals([])

  $(".inner-loading-screen").fadeOut(300)

}



async function searchByLetter(letter) {
  
  $(".inner-loading-screen").fadeIn(300)
  letter == "" ? letter = "a" : "";
  let response = await fetch(`${BASE_URL}/search.php?f=${letter}`)
let data= await response.json()

  data.meals ? displayMeals(data.meals) : displayMeals([])
  $(".inner-loading-screen").fadeOut(300)

}


// ==============================Categories===============================

async function getCategories() {
  toggleSideBar();
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)
  searchContainer.innerHTML = "";

  let response = await fetch(`${BASE_URL}/categories.php`)
  let data = await response.json()
console.log(data.categories);

  displayCategories(data.categories)
  $(".inner-loading-screen").fadeOut(300)

}

function displayCategories(arr) {
  let categoriesContainer = "";

  for (let i = 0; i < arr.length; i++) {
    categoriesContainer += `
      <div class="col-md-3">
              <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                  <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                  <div class="meal-layer position-absolute text-center text-black p-2">
                      <h3>${arr[i].strCategory}</h3>
                      <p>${arr[i].strCategoryDescription}</p>
                  </div>
              </div>
      </div>
      `
  }

  rowData.innerHTML = categoriesContainer
}

// ==================== Area =======================================================

async function getArea() {
  toggleSideBar();
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)
searchContainer.innerHTML = "";

  let response = await fetch(`${BASE_URL}/list.php?a=list`)
  let data = await response.json()
  console.log(data.meals);

  displayArea(data.meals)
  $(".inner-loading-screen").fadeOut(300)

}


function displayArea(arr) {
  let areaContainer = "";

  for (let i = 0; i < arr.length; i++) {
    areaContainer  += `
      <div class="col-md-3">
              <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                      <i class="fa-solid fa-house-laptop fa-4x"></i>
                      <h3>${arr[i].strArea}</h3>
              </div>
      </div>
      `
  }

  rowData.innerHTML =  areaContainer ;
}



// ================================== ingredients=======================

async function getIngredients() {

  toggleSideBar();
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  searchContainer.innerHTML = "";

  let respone = await fetch(`${BASE_URL}/list.php?i=list`)
  let data = await respone.json()
  console.log(data.meals.slice(0, 20));

  displayIngredients(data.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}

function displayIngredients(arr) {
  let ingredientsContainer = "";

  for (let i = 0; i < arr.length; i++) {
    ingredientsContainer  += `
      <div class="col-md-3">
              <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                      <h3>${arr[i].strIngredient}</h3>
                      <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
              </div>
      </div>
      `
  }

  rowData.innerHTML = ingredientsContainer 
}


// ============================================get category meals===============================

async function getCategoryMeals(category) {
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  let response = await fetch(`${BASE_URL}/filter.php?c=${category}`)
  let data = await response.json()


  displayMeals(data.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}

// ===========================================get area meal=======================================

async function getAreaMeals(area) {
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  let response = await fetch(`${BASE_URL}/filter.php?a=${area}`)
  let data= await response.json()
console.log(data.meals)

  displayMeals(data.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}

// ============================================ get ingredients meals=============================

async function getIngredientsMeals(ingredients) {
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  let response = await fetch(`${BASE_URL}/filter.php?i=${ingredients}`)
  let data = await response.json()


  displayMeals(data.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}


// =============================== get meal Details ==============================


async function getMealDetails(mealID) {
   rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

   searchContainer.innerHTML = "";
  let response = await fetch(`${BASE_URL}/lookup.php?i=${mealID}`);
  let data = await response.json();
  console.log(data.meals[0]);
  displayMealDetails(data.meals[0])
  
  
  $(".inner-loading-screen").fadeOut(300)

}


function displayMealDetails(meal) {
    
  searchContainer.innerHTML = "";


  let ingredients = ``

  for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
          ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
      }
  }
// ==========
  let tags = meal.strTags?.split(",")
  
  if (!tags) tags = []

  let tagsStr = ''
  for (let i = 0; i < tags.length; i++) {
      tagsStr += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
  }
// =========


  let mealDetailsContainer = `
  <div class="col-md-4">
              <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                  alt="">
                  <h2>${meal.strMeal}</h2>
          </div>
          <div class="col-md-8">
              <h2>Instructions</h2>
              <p>${meal.strInstructions}</p>
              <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
              <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredients}
              </ul>

              <h3>Tags :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsStr}
              </ul>

              <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
              <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
          </div>`

  rowData.innerHTML = mealDetailsContainer;
}


// ==============================contacts========================================

function showContacts() {

  toggleSideBar();
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="rePasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="rePasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid rePassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `
  submitBtn = document.getElementById("submitBtn")


  document.getElementById("nameInput").addEventListener("focus", () => {
      nameInputTouched = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
      emailInputTouched = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
      phoneInputTouched = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
      ageInputTouched = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
      passwordInputTouched = true
  })

  document.getElementById("rePasswordInput").addEventListener("focus", () => {
      rePasswordInputTouched = true
  })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let rePasswordInputTouched = false;


function inputsValidation() {
  if (nameInputTouched) {
      if (nameValidation()) {
          document.getElementById("nameAlert").classList.replace("d-block", "d-none")

      } else {
          document.getElementById("nameAlert").classList.replace("d-none", "d-block")

      }
  }
  if (emailInputTouched) {

      if (emailValidation()) {
          document.getElementById("emailAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("emailAlert").classList.replace("d-none", "d-block")

      }
  }

  if (phoneInputTouched) {
      if (phoneValidation()) {
          document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

      }
  }

  if (ageInputTouched) {
      if (ageValidation()) {
          document.getElementById("ageAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("ageAlert").classList.replace("d-none", "d-block")

      }
  }

  if (passwordInputTouched) {
      if (passwordValidation()) {
          document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

      }
  }
  if (rePasswordInputTouched) {
      if (rePasswordValidation()) {
          document.getElementById("rePasswordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("rePasswordAlert").classList.replace("d-none", "d-block")

      }
  }


  if (nameValidation() &&
      emailValidation() &&
      phoneValidation() &&
      ageValidation() &&
      passwordValidation() &&
      rePasswordValidation()) {
      submitBtn.removeAttribute("disabled")
  } else {
      submitBtn.setAttribute("disabled", true)
  }
}


function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function rePasswordValidation() {
  return document.getElementById("rePasswordInput").value == document.getElementById("passwordInput").value
}