const { db } = require("../models/index");
const requests = [
    {

      agencyName: "Rental S",
      companyNumber: "53147000",
      address:' {"latitude":36.743375,"longitude": 10.317884}',
      verified: 1,
      deposit: 10,
      transportation: 1,
      UserId:1,
      
    },
    {

        agencyName: "Rental J",
        companyNumber: "51977081",
        address: '{"latitude":36.733136,"longitude":10.296003}',
        verified: 0,
        deposit: 10,
        transportation: 1,
        UserId:2
        
    },
    {

        agencyName: "Rental A",
        companyNumber: "52901225",
        address: '{"latitude":36.820205,"longitude":10.089529}',
        verified: 0,
        deposit: 10,
        transportation: 1,
        UserId:3
         
    },
    {

        agencyName: "Rental Z",
        companyNumber: "55403836",
        address:' {"latitude":36.876995,"longitude":10.323278}',
        verified: 0,
        deposit: 10,
        transportation: 1,
        UserId:4
        
    },
  ];
  
  async function seedRequests() {
    for (let request of requests) {
      await db.Request.create(request);
    }
  }
  
  seedRequests().then(() => {
    console.log("Seed complete!");
    process.exit(0);
  });
  