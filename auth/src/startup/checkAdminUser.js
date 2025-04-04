// auth/src/startup/checkAdminUser.js
const bcrypt = require("bcryptjs");
const { User } = require("../models");

async function checkAdminUser() {
  const createAdminFlag = process.env.CREATE_DEFAULT_ADMIN === "true";
  if (!createAdminFlag) {
    return;
  }

  const existingAdmin = await User.findOne({ where: { role: "Admin" } });
  if (existingAdmin) {
    console.log(
      "An admin user already exists. Skipping default admin creation."
    );
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "Cannot create default admin: missing ADMIN_EMAIL or ADMIN_PASSWORD in environment."
    );
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newAdmin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: "Admin",
    });

    console.log(`Default admin created: ${newAdmin.email}`);
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
}

module.exports = checkAdminUser;
