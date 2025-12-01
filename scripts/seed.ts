import "dotenv/config";
import { seedAdmin } from "../app/lib/seed";

seedAdmin()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });

