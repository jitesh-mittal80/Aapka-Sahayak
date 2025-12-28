const { findOrCreateCitizen } = require("./http/services/citizen.service");

async function test() {
  const citizen1 = await findOrCreateCitizen({
    name: "Ramesh Kumar",
    phone: "9999999999",
    language: "hi",
  });

  console.log("Citizen 1:", citizen1);

  const citizen2 = await findOrCreateCitizen({
    name: "Ramesh Kumar",
    phone: "9999999999",
    language: "hi",
  });

  console.log("Citizen 2:", citizen2);
}

test();
