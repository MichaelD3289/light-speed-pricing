const main = document.querySelector('.content');
const laserNav = document.querySelector('.nav-item.laser');
const settingsNav = document.querySelector('.nav-item.settings');
const accountNav = document.querySelector('.nav-item.account');
const jobsNav = document.querySelector('.nav-item.jobs')
let userId = window.localStorage.getItem('user');

function navLaserPage () {
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }


  main.innerHTML = `
  <form id="laserForm">
  <section class="laserMain">
  <div class="grid height">
    <h2>H</h2>
    <input id="height" placeholder="height" type="number" />
  </div>
  <div class="grid width">
    <h2>W</h2>
    <input id="width" placeholder="width" type="number" />
  </div>

  <div class="grid table">

    <div class="flatInputs">
      <h2>Standard</h2>
      <div class="flatRowOne">
        <div class="inch oneOne flat">
          <h3>1 x 1</h3>
          <input type="number" placeholder="sec" class="flatinput one" />
        </div>
        <div class="inch twoOne flat">
          <h3>2 x 1</h3>
          <input type="number" placeholder="sec" class="flatinput twoOne" />
        </div>
        <div class="inch threeOne flat">
          <h3>3 x 1</h3>
          <input type="number" placeholder="sec" class="flatinput threeOne" />
        </div>
      </div>

      <div class="flatRowTwo">
        <div class="inch oneTwo flat">
          <h3>1 x 2</h3>
          <input type="number" placeholder="sec" class="flatinput oneTwo" />
        </div>
        <div class="inch oneTwo flat">
          <h3>2 x 2</h3>
          <input type="number" placeholder="sec" class="flatinput twoTwo" />
        </div>

      </div>

      <div class="flatRowThree">
        <div class="inch twoTwo flat">
          <h3>1 x 3</h3>
          <input type="number" placeholder="sec" class="flatinput oneThree" />
        </div>
        <div class="inch threeThree flat">
          <h3>3 x 3</h3>
          <input type="number" placeholder="sec" class="flatinput threeThree" />
        </div>
      </div>

      <div class="flatRowFour">
        <div>
          <input class="flatSpeed" placeholder="Speed" type="number" />
        </div>
        <div>
          <input class="flatDpi" placeholder="DPI" type="number" />
        </div>
      </div>

    </div>

    <div class="instructions">
      <h2>Instructions</h2>
      <ol class="steps">
        <li class="step">Start by putting the width and height of your laser table into the fields at the top and left side of this table. This will be in inches.</li>

        <li class="step">You will now run speed tests on your laser. You will need to create and send 7 files for both the standard and rotary engraving (If your laser does not have a rotary attachment feel free to skip that step).</li>

        <li class="step">Each Square you see represents a 1" by 1" square. The first file you test will be a 1" x 1" square. Remember to use the same speed and density settings throughout this test. <br><br> We recommend you use the speed and density settings most often used on your laser. This will ensure the hightest accuracy for the highest number of your jobs. <br><br> If you don't know we recommend using a DPI of 400 and speed setting of 70%.</li>

        <li class="step">Run each file with the size square/rectangle asked for. For the 3" x 1", this means a solid rectangle that is 3" wide by 1" tall. Input the time taken in seconds.</li>

        <li class="step">*Please Note*<br>The rotary width and height is based off width and height of the item while its sitting on a table and you are looking straight at it NOT based off how it is oriented in your laser.<br><br> The x and y will swap once its placed in the laser. Its important to make sure you put this in correctly. A quick check is to see that the 3" x 1" has a longer time needed than your 1" x 3".</li>
      </ol>
    </div>

    <div class="rotaryInputs">
      <h2>Rotary</h2>
      <div class="rotaryRowOne">
        <div class="inch oneOne rotary">
          <h3>1 x 1</h3>
          <input type="number" placeholder="sec" class="rotaryinput one" />
        </div>
        <div class="inch twoOne rotary">
          <h3>2 x 1</h3>
          <input type="number" placeholder="sec" class="rotaryinput twoOne" />
        </div>
        <div class="inch threeOne rotary">
          <h3>3 x 1</h3>
          <input type="number" placeholder="sec" class="rotaryinput threeOne" />
        </div>
      </div>

      <div class="rotaryRowTwo">
        <div class="inch oneTwo rotary">
          <h3>1 x 2</h3>
          <input type="number" placeholder="sec" class="rotaryinput oneTwo" />
        </div>
        <div class="inch oneTwo rotary">
          <h3>2 x 2</h3>
          <input type="number" placeholder="sec" class="rotaryinput twoTwo" />
        </div>

      </div>

      <div class="rotaryRowThree">
        <div class="inch twoTwo rotary">
          <h3>1 x 3</h3>
          <input type="number" placeholder="sec" class="rotaryinput oneThree" />
        </div>
        <div class="inch threeThree rotary">
          <h3>3 x 3</h3>
          <input type="number" placeholder="sec" class="rotaryinput threeThree" />
        </div>
      </div>

      <div class="rotaryRowFour">
        <div>
          <input class="rotarySpeed" placeholder="Speed" type="number" />
        </div>
        <div>
          <input class="rotaryDpi" placeholder="DPI" type="number" />
        </div>
      </div>


    </div>


  </div>

  </div>

  <div class="grid submit">
    <button class="laserSubmit button">Submit</button>
  </div>
</section>
</form>
 
  `
  const laserForm = document.querySelector('#laserForm');
  laserForm.addEventListener('submit', addLaser)

  getLaser(userId);
}

laserNav.addEventListener('click', navLaserPage);




const submitBtn = document.querySelector('.laserSubmit');

function addLaser (e) {
  e.preventDefault();
  updating();

  const width = document.querySelector('#width');
  const height = document.querySelector('#height');
  
  const flatSpeed = document.querySelector('.flatSpeed');
  const flatDpi = document.querySelector('.flatDpi');
  const rotarySpeed = document.querySelector('.rotarySpeed');
  const rotaryDpi = document.querySelector('.rotaryDpi');
  
  const fOne = document.querySelector('.flatinput.one')
  const fTwoOne = document.querySelector('.flatinput.twoOne')
  const fThreeOne = document.querySelector('.flatinput.threeOne')
  const fOneTwo = document.querySelector('.flatinput.oneTwo')
  const fOneThree = document.querySelector('.flatinput.oneThree')
  const fTwoTwo = document.querySelector('.flatinput.twoTwo')
  const fThreeThree = document.querySelector('.flatinput.threeThree')

  const rOne = document.querySelector('.rotaryinput.one')
  const rTwoOne = document.querySelector('.rotaryinput.twoOne')
  const rThreeOne = document.querySelector('.rotaryinput.threeOne')
  const rOneTwo = document.querySelector('.rotaryinput.oneTwo')
  const rOneThree = document.querySelector('.rotaryinput.oneThree')
  const rTwoTwo = document.querySelector('.rotaryinput.twoTwo')
  const rThreeThree = document.querySelector('.rotaryinput.threeThree')


const body = {
  laser: {
    tableW: width.value,
    tableH: height.value,
    user: userId
  },
  flat: {
    fdensity: flatDpi.value,
    fspeed: flatSpeed.value,
    fone: fOne.value,
    ftwoOne: fTwoOne.value,
    fthreeOne: fThreeOne.value,
    foneTwo: fOneTwo.value,
    foneThree: fOneThree.value,
    ftwoTwo: fTwoTwo.value,
    fthreeThree: fThreeThree.value
  },
  rotary: {
    rdensity: rotaryDpi.value,
    rspeed: rotarySpeed.value,
    rone: rOne.value,
    rtwoOne: rTwoOne.value,
    rthreeOne: rThreeOne.value,
    roneTwo: rOneTwo.value,
    roneThree: rOneThree.value,
    rtwoTwo: rTwoTwo.value,
    rthreeThree: rThreeThree.value
  }
}

  axios
    .post('/api/laser', body)
    .then(res => {
      successMessage();
    })
    .catch(() => {
      document.querySelector('.updating').remove()
      alert(`There was a error submitting your data. Please refresh the page and try again or contact us for support`)
  })

}

// Getting laser info to present to user

function getLaser (u) {
   
    axios
      .get(`/api/laser/${u}`)
      .then(res =>  {

        let { flat_density, flat_speed, fone, fonethree, fonetwo, fthreeone, fthreethree, ftwoone, ftwotwo, rotary_density, rotary_speed, rone, ronethree, ronetwo, rthreeone, rthreethree, rtwoone, rtwotwo, table_height, table_width } = res.data[0]

        const width = document.querySelector('#width');
  const height = document.querySelector('#height');
  
  const flatSpeed = document.querySelector('.flatSpeed');
  const flatDpi = document.querySelector('.flatDpi');
  const rotarySpeed = document.querySelector('.rotarySpeed');
  const rotaryDpi = document.querySelector('.rotaryDpi');
  
  const fOne = document.querySelector('.flatinput.one')
  const fTwoOne = document.querySelector('.flatinput.twoOne')
  const fThreeOne = document.querySelector('.flatinput.threeOne')
  const fOneTwo = document.querySelector('.flatinput.oneTwo')
  const fOneThree = document.querySelector('.flatinput.oneThree')
  const fTwoTwo = document.querySelector('.flatinput.twoTwo')
  const fThreeThree = document.querySelector('.flatinput.threeThree')

  const rOne = document.querySelector('.rotaryinput.one')
  const rTwoOne = document.querySelector('.rotaryinput.twoOne')
  const rThreeOne = document.querySelector('.rotaryinput.threeOne')
  const rOneTwo = document.querySelector('.rotaryinput.oneTwo')
  const rOneThree = document.querySelector('.rotaryinput.oneThree')
  const rTwoTwo = document.querySelector('.rotaryinput.twoTwo')
  const rThreeThree = document.querySelector('.rotaryinput.threeThree')
  

         width.value = +table_height
         height.value = +table_width

         flatSpeed.value = +flat_speed
         flatDpi.value = +flat_density
         rotarySpeed.value = +rotary_speed
         rotaryDpi.value = +rotary_density
        
         fOne.value = +fone
         fTwoOne.value = +ftwoone
         fThreeOne.value = +fthreeone
         fOneTwo.value = +fonetwo
         fOneThree.value = +fonethree
         fTwoTwo.value = +ftwotwo
         fThreeThree.value = +fthreethree
      
         rOne.value = +rone
         rTwoOne.value = +rtwoone
         rThreeOne.value = +rthreeone
         rOneTwo.value = +ronetwo
         rOneThree.value = +ronethree
         rTwoTwo.value = +rtwotwo
         rThreeThree.value = +rthreethree


        
      })
      .catch(() => {
        document.querySelector('.updating').remove()
        alert(`There was a error getting your data. Please refresh the page and try again or contact us for support`)
      })
  
  }

  // 

  function navSettingsPage () {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
  
  
    main.innerHTML = `
    <form id="settingForm">
    <section class="settingsMain">

      <section class="company">
        <h2 class="company-title">Company</h2>
        <p class="tax">Tax %</p>
        <input id="taxInput" placeholder="(ex 7.25)" type="number" step="0.0001"/>
        <p class="rush">Rush Fee %</p>
        <input id="rushInput" placeholder="(ex 30)" type="number"  step="0.1"/>
        <h2 class="tem-title">Cut-Out Templates</h2>
        <p>Between Items</p>
        <input id="bet-items" placeholder="inches(ex 0.5)" type="number" step="0.01" />
        <p>From Top Ruler</p>
        <input id="top-ruler" placeholder="inches(ex 0.5)" type="number" step="0.01" />
        <p>From Left Ruler</p>
        <input id="left-ruler" placeholder="inches(ex 0.5)" type="number"  step="0.01"/>
        
        
      </section>

      <section class="qty-hourly">
        <h2 class="qty">Qty Breaks</h2>
        <h2 class="hour">Hourly Rates</h2>
        <p class="p-one">1</p>
        <input id="qtybreak1" placeholder="(ex 1)" type="number" />
        <input id="hourrate1" placeholder="$(ex 200)" type="number" />
        <p>2</p>
        <input id="qtybreak2" placeholder="(ex 25)" type="number" />
        <input id="hourrate2" placeholder="$(ex 175)" type="number" />
        <p>3</p>
        <input id="qtybreak3" placeholder="(ex 50)" type="number" />
        <input id="hourrate3" placeholder="$(ex 150)" type="number" />
        <p>4</p>
        <input id="qtybreak4" placeholder="(ex 100)" type="number" />
        <input id="hourrate4" placeholder="$(ex 125)" type="number" />
        <p>5</p>
        <input id="qtybreak5" placeholder="(ex 250)" type="number" />
        <input id="hourrate5" placeholder="$(ex 110)" type="number" />
        <p>6</p>
        <input id="qtybreak6" placeholder="(ex 500)" type="number" />
        <input id="hourrate6" placeholder="$(ex 90)" type="number" />
        <p>7</p>
        <input id="qtybreak7" placeholder="(ex 1000)" type="number" />
        <input id="hourrate7" placeholder="$(ex 75)" type="number" />
      </section>

      <section class="job-defaults">
        <h2 class="job-default">Job Defaults</h2>
        <p class="dpi">DPI</p>
        <input id="default-density" type="number" placeholder="DPI (ex 400)" />
        <p class="speed">Speed</p>
        <input id="default-speed" type="number" placeholder="Percent (ex 80)" />
        <p class="handling">Piece Handling Time</p>
        <input id="handle-time" type="number" placeholder="seconds (ex 12)" />
        <p class="setup">Set-up</p>
        <input id="setup" type="number" placeholder="dollars (ex 50)" />
        <input id="setup-check" type="checkbox" >
        <p class="price">Check box to include set-up price in unit cost</p>
      </section>
      
    </section>
    <button id="settingButton" class="button">Submit</button>
  </form>
    `;
    const settingForm = document.querySelector('#settingForm');
    settingForm.addEventListener('submit', addDefaultData)

    getDefaults(userId);

  }

 settingsNav.addEventListener('click', navSettingsPage);

// adding default data

 function addDefaultData(e) {
   e.preventDefault();
   updating()

   const taxInput = document.querySelector('#taxInput');
   const rushInput = document.querySelector('#rushInput');

  const betweenItems = document.querySelector('#bet-items')
  const topRuler = document.querySelector('#top-ruler')
  const leftRuler = document.querySelector('#left-ruler')
 
  const qtyOne = document.querySelector('#qtybreak1')
  const qtyTwo = document.querySelector('#qtybreak2')
  const qtyThree = document.querySelector('#qtybreak3')
  const qtyFour = document.querySelector('#qtybreak4')
  const qtyFive = document.querySelector('#qtybreak5')
  const qtySix = document.querySelector('#qtybreak6')
  const qtySeven = document.querySelector('#qtybreak7')

  const hourOne = document.querySelector('#hourrate1');
  const hourTwo = document.querySelector('#hourrate2');
  const hourThree = document.querySelector('#hourrate3');
  const hourFour = document.querySelector('#hourrate4');
  const hourFive = document.querySelector('#hourrate5');
  const hourSix = document.querySelector('#hourrate6');
  const hourSeven = document.querySelector('#hourrate7');

  const defaultDpi = document.querySelector('#default-density')
  const defaultSpeed = document.querySelector('#default-speed')
  const handleTime = document.querySelector('#handle-time')
  const setup = document.querySelector('#setup')
  let setupCheck = document.querySelector('#setup-check');

  if (setupCheck.checked) {
    setupCheck = true
  } else {
    setupCheck = false
  }

  let settingsBody = {
    user: userId,
    company: {
      tax: taxInput.value,
      rush: rushInput.value,
    },
    qty: {
      qone: qtyOne.value,
      qtwo: qtyTwo.value,
      qthree: qtyThree.value,
      qfour: qtyFour.value,
      qfive: qtyFive.value,
      qsix: qtySix.value,
      qseven: qtySeven.value
    },
    hourly: {
      hone: hourOne.value,
      htwo: hourTwo.value,
      hthree: hourThree.value,
      hfour: hourFour.value,
      hfive: hourFive.value,
      hsix: hourSix.value,
      hseven: hourSeven.value
    },
    job: {
      density: defaultDpi.value,
      speed: defaultSpeed.value,
      piece: handleTime.value,
      setup: setup.value,
      setupInc: setupCheck,
      temBetween: betweenItems.value,
      temLeft: leftRuler.value,
      temTop: topRuler.value
    }
  }

  axios
    .post('/api/user/defaults', settingsBody)
    .then(() => {
      successMessage();
    })
    .catch(() => {
      document.querySelector('.updating').remove()
      alert(`There was an error submitting your data. Please try again or contact our support team if the problem persists.`)
  })

 }

 function getDefaults(u) {

  const taxInput = document.querySelector('#taxInput');
  const rushInput = document.querySelector('#rushInput');

 const betweenItems = document.querySelector('#bet-items')
 const topRuler = document.querySelector('#top-ruler')
 const leftRuler = document.querySelector('#left-ruler')

 const qtyOne = document.querySelector('#qtybreak1')
 const qtyTwo = document.querySelector('#qtybreak2')
 const qtyThree = document.querySelector('#qtybreak3')
 const qtyFour = document.querySelector('#qtybreak4')
 const qtyFive = document.querySelector('#qtybreak5')
 const qtySix = document.querySelector('#qtybreak6')
 const qtySeven = document.querySelector('#qtybreak7')

 const hourOne = document.querySelector('#hourrate1');
 const hourTwo = document.querySelector('#hourrate2');
 const hourThree = document.querySelector('#hourrate3');
 const hourFour = document.querySelector('#hourrate4');
 const hourFive = document.querySelector('#hourrate5');
 const hourSix = document.querySelector('#hourrate6');
 const hourSeven = document.querySelector('#hourrate7');

 const defaultDpi = document.querySelector('#default-density')
 const defaultSpeed = document.querySelector('#default-speed')
 const handleTime = document.querySelector('#handle-time')
 const setup = document.querySelector('#setup')
 let setupCheck = document.querySelector('#setup-check');


  axios
    .get(`/api/user/defaults/${u}`)
    .then(res => {
      
      let { tax, rush, density, speed, piece, setup_cost, setupcheck, tem_between, tem_left, tem_top, q1, q2, q3, q4, q5, q6, q7, h1, h2, h3, h4, h5, h6, h7 } = res.data[0]

      taxInput.value = +tax;
      rushInput.value = +rush;

      betweenItems.value = +tem_between;
      topRuler.value = +tem_top;
      leftRuler.value = +tem_left;

      qtyOne.value = +q1;
      qtyTwo.value = +q2;
      qtyThree.value = +q3;
      qtyFour.value = +q4;
      qtyFive.value = +q5;
      qtySix.value = +q6;
      qtySeven.value = +q7;

      hourOne.value = +h1;
      hourTwo.value = +h2;
      hourThree.value = +h3;
      hourFour.value = +h4;
      hourFive.value = +h5;
      hourSix.value = +h6;
      hourSeven.value = +h7;

      defaultDpi.value = +density;
      defaultSpeed.value = +speed;
      handleTime.value = +piece;
      setup.value = +setup_cost;
     
      if(setupcheck === true) { setupCheck.checked = true }
      else { setupCheck.checked = false }

    }
    )
    .catch(() => {
      document.querySelector('.updating').remove()
      alert(`There was a error getting your data. Please refresh the page and try again or contact us for support`)
    })

 }

function successMessage() {
  while(document.querySelector('.updating')) {
  document.querySelector('.updating').remove()
  }

  if(!document.querySelector('.success-message')){
  let newDiv = document.createElement('div')
  newDiv.classList.add('success-message')
  let newHeading = document.createElement('p')
  newHeading.textContent = "User Information Updated Successfully"
  newDiv.appendChild(newHeading)

  main.appendChild(newDiv)

  setTimeout(() => {
    newDiv.remove();
  }, 1500)}

}

function updating() {
  if(!document.querySelector('.updating')){
  let newDiv = document.createElement('div')
  newDiv.classList.add('updating')
  let newHeading = document.createElement('p')
  newHeading.textContent = "Updating, Please Wait"
  newDiv.appendChild(newHeading)

  main.appendChild(newDiv)
  }
}

// User Account Page ----------------------------

function navAccountPage () {
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }


  main.innerHTML = `
  <form id="accountForm">
    <section id="accountMain">
      <div class="accountitem a1">
        <h2>Account</h2>
      </div>
      <div class="empty"></div>
      <div class="accountitem a2">
        <h3>Log-In</h3>
      </div>
      <div class="accountitem a3">
        <h3>Info</h3>
      </div>
      <div class="empty2"></div>
      <div class="accountitem a4">
        <p>email</p>
      </div>
      <div class="accountitem a5">
        <input type="email" placeholder="email" class="email" />
      </div>
      <div class="accountitem a6">
        <input type="text" placeholder="first name" class="fname" />
      </div>
      <div class="accountitem a7">
        <p>First Name</p>
      </div>
      <div class="accountitem a8">
        <p>New Password</p>
      </div>
      <div class="accountitem a9 after">
        <input type="password" id="newPass" placeholder="new password" />
      </div>
      <div class="accountitem a10">
        <input type="text" class="lname" placeholder="last name" />
      </div>
      <div class="accountitem a11">
        <p>Last Name</p>
      </div>
      <div class="accountitem a12">
        <p>Confirm</p>
      </div>
      <div class="accountitem a13">
        <input type="password" id="confirmPass" placeholder="confirm password" />
      </div>
      <div class="accountitem a14">
        <input type="text" class="phone" placeholder="xxx-xxx-xxxx" />
      </div>
      <div class="accountitem a15">
        <p>Phone Number</p>
      </div>
      <div class="accountitem a16">
        <p>Enter Password to Update Info</p>
        <input type="password" id="oldPass" placeholder="account password" />
      </div>
      <div class="accountitem a17">
        <button class="button" id="Submit-New">Submit</button>
      </div>
      <div class="accountitem a18">
        <button class="button" id="log-out">Log-Out</button>
      </div>
    </section>
  </form>
  `
const accountForm = document.querySelector('#accountForm');
accountForm.addEventListener('submit', updateUserInfo)
}

accountNav.addEventListener('click', navAccountPage);

function updateUserInfo(e) {
  e.preventDefault()

  axios
}