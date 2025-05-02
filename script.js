let items = JSON.parse(localStorage.getItem("givebackItems")) || [];

function saveItems() {
  localStorage.setItem("givebackItems", JSON.stringify(items));
}

function renderItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = item.claimed ? "claimed" : "";
    li.innerHTML = `
      <strong>${item.name}</strong> — ${item.location}
      <p>${item.description}</p>
      <button onclick="claimItem(${index})" ${item.claimed ? "disabled" : ""}>
        ${item.claimed ? "Claimed" : "Claim"}
      </button>
    `;
    list.appendChild(li);
  });
}

function claimItem(index) {
  items[index].claimed = true;
  saveItems();
  renderItems();
}

document.getElementById("itemForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  items.push({ name, location, description, claimed: false });
  saveItems();
  renderItems();

  this.reset();
});

renderItems();
