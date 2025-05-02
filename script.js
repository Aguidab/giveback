// Paste your Firebase config from Firebase Console here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      document.getElementById("message").innerText = err.message;
    });
}

// SIGN UP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      document.getElementById("message").innerText = err.message;
    });
}

// POST ITEM
function postItem() {
  const itemName = document.getElementById("itemName").value;
  const itemLocation = document.getElementById("itemLocation").value;
  const itemDescription = document.getElementById("itemDescription").value;

  db.collection("items").add({
    name: itemName,
    location: itemLocation,
    description: itemDescription,
    claimed: false,
    postedBy: auth.currentUser.email
  })
  .then(() => {
    alert("Item posted!");
    loadItems();
  });
}

// LOAD ITEMS
function loadItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  db.collection("items").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${data.name}</strong> – ${data.location}<br>
        ${data.description}
        <br>
        ${data.claimed ? "✅ Claimed" : `<button onclick="claimItem('${doc.id}')">Claim</button>`}
      `;
      list.appendChild(li);
    });
  });
}

// CLAIM ITEM
function claimItem(id) {
  db.collection("items").doc(id).update({
    claimed: true
  }).then(() => {
    alert("Item claimed!");
    loadItems();
  });
}

if (window.location.pathname.includes("dashboard")) {
  auth.onAuthStateChanged(user => {
    if (user) loadItems();
    else window.location.href = "login.html";
  });
}

