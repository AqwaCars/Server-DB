const { db } = require("../models/index"); // Adjust the path to your models

const users = [
  {
    userName: "selim",
    phoneNumber: "53147000",
    password: "Louhichi94",
    email: "selim@gmail.com",
    dateOfBirth: "1994-10-13T00:00:00.000Z",
    idCard: "09623401",
  },
  {
    userName: "jihed",
    phoneNumber: "51977081",
    password: "Louhichi94",
    email: "jihed@gmail.com",
    dateOfBirth: "2002-02-02T00:00:00.000Z",
    idCard: "11221122",
  },
  {
    userName: "amine",
    phoneNumber: "52901225",
    password: "Louhichi94",
    email: "amine@gmail.com",
    dateOfBirth: "2000-03-03T00:00:00.000Z",
    idCard: "11122211",
  },
  {
    userName: "zeineb",
    phoneNumber: "55403836",
    password: "Louhichi94",
    email: "zeineb@gmail.com",
    dateOfBirth: "1996-04-04T00:00:00.000Z",
    idCard: "123456792",
  },
  {
    userName: "alaa",
    phoneNumber: "27418271",
    password: "Louhichi94",
    email: "alaa@gmail.com",
    dateOfBirth: "2002-05-05T00:00:00.000Z",
    idCard: "11221111",
  },
  {
    userName: "jesser",
    phoneNumber: "54162511",
    password: "Louhichi94",
    email: "jesser@gmail.com",
    dateOfBirth: "2000-06-06T00:00:00.000Z",
    idCard: "12312344",
  },
  {
    userName: "belahssen",
    phoneNumber: "22556644",
    password: "Louhichi94",
    email: "belahssen@gmail.com",
    dateOfBirth: "2002-07-07T00:00:00.000Z",
    idCard: "123456795",
  },
  {
    userName: "leith",
    phoneNumber: "52255225",
    password: "Louhichi94",
    email: "leith@gmail.com",
    dateOfBirth: "1997-08-08T00:00:00.000Z",
    idCard: "123456796",
  },
  {
    userName: "aymen",
    phoneNumber: "98692961",
    password: "Louhichi94",
    email: "aymen@gmail.com",
    dateOfBirth: "2001-09-09T00:00:00.000Z",
    idCard: "123456797",
  },
  {
    userName: "farouk",
    phoneNumber: "24512969",
    password: "Louhichi94",
    email: "alaasrioui@gmail.com",
    dateOfBirth: "1999-10-10T00:00:00.000Z",
    idCard: "123456798",
  },
];

async function seedUsers() {
  for (let user of users) {
    await db.User.create(user);
  }
}

seedUsers().then(() => {
  console.log("Seed complete!");
  process.exit(0);
});
