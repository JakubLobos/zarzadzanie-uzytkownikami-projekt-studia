let isDataLoading = false;
let users = [];
const userList = document.getElementById("user-list");
const btnSave = document.getElementById("save");
const btnAdd = document.getElementById("add");
const btnDownload = document.getElementById("download");
const btnReset = document.getElementById("reset");

btnReset.addEventListener("click", () => {
  localStorage.removeItem("users");
  users = [];
  loadData();
});

btnDownload.addEventListener("click", () => {
  const data = JSON.stringify(users);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users.json";
  a.click();
  URL.revokeObjectURL(url);
});

btnSave.addEventListener("click", () => {
  saveDataToLocalStorage();
});

btnAdd.addEventListener("click", () => {
  const newUser = {
    name: "Nowy użytkownik",
    username: "",
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
    },
    phone: "",
    website: "",
    company: {
      name: "",
    },
  };

  users.push(newUser);
  renderUsers();
  saveDataToLocalStorage();
});

const renderUsers = () => {
  userList.innerHTML = "";
  users.forEach((user, index) => {
    const li = document.createElement("li");
    const userDiv = document.createElement("div");
    const inputs = {};

    const userData = [
      { label: "Imie", value: user.name },
      { label: "Nazwa", value: user.username },
      { label: "Email", value: user.email },
      { label: "Ulica", value: user.address.street },
      { label: "Apartament", value: user.address.suite },
      { label: "Miasto", value: user.address.city },
      { label: "Kod pocztowy", value: user.address.zipcode },
      { label: "Numer telefonu", value: user.phone },
      { label: "Strona WWW", value: user.website },
      { label: "Firma", value: user.company.name },
    ];

    userData.forEach((data) => {
      const label = document.createElement("label");
      label.textContent = data.label;
      const input = document.createElement("input");
      input.value = data.value;
      input.disabled = true;
      inputs[data.label] = input;
      userDiv.appendChild(label);
      userDiv.appendChild(input);
    });

    const editButton = document.createElement("button");
    const removeButton = document.createElement("button");

    removeButton.style.marginTop = "10px";
    removeButton.textContent = "Usuń";
    removeButton.addEventListener("click", () => {
      users.splice(index, 1);
      renderUsers();
      saveDataToLocalStorage();
    });

    editButton.style.marginTop = "10px";

    editButton.textContent = "Edytuj";
    editButton.addEventListener("click", () => {
      Object.values(inputs).forEach((input) => (input.disabled = false));

      editButton.textContent = "Zapisz zmiany";
      editButton.addEventListener("click", () => {
        users[index].name = inputs["Imie"].value;
        users[index].username = inputs["Nazwa"].value;
        users[index].email = inputs["Email"].value;
        users[index].address.street = inputs["Ulica"].value;
        users[index].address.suite = inputs["Apartament"].value;
        users[index].address.city = inputs["Miasto"].value;
        users[index].address.zipcode = inputs["Kod pocztowy"].value;
        users[index].phone = inputs["Numer telefonu"].value;
        users[index].website = inputs["Strona WWW"].value;
        users[index].company.name = inputs["Firma"].value;

        renderUsers();
        saveDataToLocalStorage();
      });
    });

    userDiv.appendChild(editButton);
    userDiv.appendChild(removeButton);

    userDiv.style.display = "flex";
    userDiv.style.flexDirection = "column";
    userDiv.style.backgroundColor = "#1b1b1b1b";
    userDiv.style.border = "1px solid #000";
    userDiv.style.padding = "10px";

    li.appendChild(userDiv);
    userList.appendChild(li);
  });
};

const renderLoading = () => {
  userList.innerHTML = "Ładowanie...";
};

const renderError = () => {
  const refresh = document.createElement("button");

  userList.innerHTML = "Wystąpił błąd podczas pobierania danych!";
  refresh.textContent = "Odśwież";
  refresh.addEventListener("click", () => {
    loadData();
  });

  userList.appendChild(refresh);
};

const getEmployeesData = async () => {
  isDataLoading = true;
  if (isDataLoading) {
    renderLoading();
  }
  try {
    const data = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "get",
    });
    users = await data.json();
    renderUsers();
  } catch (err) {
    console.error(err);
    renderError();
  }
  isDataLoading = false;
};

const saveDataToLocalStorage = () => {
  localStorage.setItem("users", JSON.stringify(users));
};

const loadData = () => {
  const data = localStorage.getItem("users");
  if (data) {
    users = JSON.parse(data);
    renderUsers();
  } else {
    getEmployeesData();
  }
};

loadData();
