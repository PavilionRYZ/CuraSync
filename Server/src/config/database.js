const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  ✅  MongoDB Connected Successfully                        ║
║                                                            ║
║  🖥️  Host: ${conn.connection.host.padEnd(47)}  ║
║  💾 Database: ${conn.connection.name.padEnd(44)} ║
║  📊 Status: ${conn.connection.readyState === 1 ? 'Active'.padEnd(46) : 'Unknown'.padEnd(46)} ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  ❌  MongoDB Connection Error                              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
      console.error(`Error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  ⚠️  MongoDB Disconnected                                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  👋  Shutting Down Gracefully                              ║
║                                                            ║
║  MongoDB connection closed                                 ║
║  Server terminated successfully                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
      process.exit(0);
    });
  } catch (error) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  💥  Fatal Error - Connection Failed                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;