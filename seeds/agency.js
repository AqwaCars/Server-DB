const { db } = require("../models/index");
const agencies = [
    {

      name: "Rental S",
      companyNumber: "53147000",
      address:' {"latitude":36.743375,"longitude": 10.317884}',
      verificationStatus: 0,
      deposit: 10,
      transportation: 1,
      UserId:1,
      requestId:1
    },
    {

        name: "Rental J",
        companyNumber: "51977081",
        address: '{"latitude":36.733136,"longitude":10.296003}',
        verificationStatus: 1,
        deposit: 10,
        transportation: 1,
        UserId:2,
        requestId:2
    },
    {

        name: "Rental A",
        companyNumber: "52901225",
        address: '{"latitude":36.820205,"longitude":10.089529}',
        verificationStatus: 1,
        deposit: 10,
        transportation: 1,
        UserId:3,
        requestId:3
         
    },
    {

        name: "Rental Z",
        companyNumber: "55403836",
        address:' {"latitude":36.876995,"longitude":10.323278}',
        verificationStatus: 1,
        deposit: 10,
        transportation: 1,
        UserId:4,
        requestId:4
        
    },
  ];
  
  async function seedUsers() {
    for (let agency of agencies) {
      await db.Agency.create(agency);
    }
  }
  
  seedUsers().then(() => {
    console.log("Seed complete!");
    process.exit(0);
  });
  