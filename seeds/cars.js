"use strict";

const { db } = require("../models/index"); // Adjust the path to your models

const cars = [
  {
    model: "Golf",
    brand: "volkswagen",
    price: 140,
    priceWeekly:900,
    priceMonthly: 3500,
    status: "available",
    horsePower: "5",
    typeOfFuel: "Gasoline",
    description: "Das Auto ",
    deposit: 10, // 10% of the car's price
    acceptation: "pending",
    typevehicle: "Economical",
    characteristics: "Automatic",
    AgencyId: 2,
    location: "Mahdia",
  },
  {
    model: "Passat",
    brand: "volkswagen",
    price: 160,
    priceWeekly: 950,
    priceMonthly: 3700,
    status: "available",
    horsePower: "7",
    typeOfFuel: "Gasoline",
    description: "Das Auto ",
    deposit: 15, // 15% of the car's price
    acceptation: "pending",
    typevehicle: "Luxury",
    characteristics: "Automatic",
    agencyId: 1,
    location: "Tunisia",

  },
  {
    model: "Clio",
    brand: "renault",
    price: 100,
    priceWeekly: 650,
    priceMonthly: 2500,
    status: "available",
    horsePower: "5",
    typeOfFuel: "Gasoline",
    description: "efficient Car",
    deposit: 10,
    acceptation: "pending",
    typevehicle: "Economical",
    characteristics: "Manual",
    agencyId: 1,
    location: "Sousse",

  },
  {
    model: "Laguna",
    brand: "renault",
    price: 120,
    priceWeekly: 800,
    priceMonthly: 3000,

    status: "available",
    horsePower: "6",
    typeOfFuel: "Gasoline",
    description: "French Car",
    deposit: 15,
    acceptation: "pending",
    typevehicle: "Luxury",
    characteristics: "Automatic",
    agencyId: 1,
    location: "Kairouan",

  },
  {
    model: "Fiesta",
    brand: "Ford",
    price: 110,
    priceWeekly: 700,
    priceMonthly: 2700,
    status: "available",
    horsePower: "5",
    typeOfFuel: "Gasoline",
    description: "American Car",
    deposit: 10,
    acceptation: "pending",
    typevehicle: "Economical",
    characteristics: "Manual",
    agencyId: 1,
    location: "Mahdia",

  },
  {
    model: "Focus",
    brand: "Ford",
    price: 120,
    priceWeekly: 750,
    priceMonthly: 2800,

    status: "available",
    horsePower: "6",
    typeOfFuel: "Gasoline",
    description: "Midsize luxury sedan with sporty performance.",
    warrantyInsurance:500,
    deposit: 15,
    acceptation: "pending",
    typevehicle: "Sports",
    characteristics: "Automatic",
    agencyId: 1,
    location: "Mahdia",

  },
  {
    model: "T-Roc",
    brand: "volkswagen",
    price: 160,
    priceWeekly:1050,
    priceMonthly: 4000,
    status: "available",
    horsePower: "8",
    typeOfFuel: "Diesel",
    description: "Das Auto",
    deposit: 10,
    acceptation: "pending",
    typevehicle: "Luxury",
    characteristics: "Automatic",
    agencyId: 1,
    location: "Mahdia",

  }
 
];

async function seedCars() {
  for (let car of cars) {
    await db.Car.create(car);
  }
}

seedCars().then(() => {
  console.log("Seed complete!");
  process.exit(0);
});
