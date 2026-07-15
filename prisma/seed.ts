import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // 1. Clean existing data
  await prisma.cashoutRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.shiftSchedule.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.company.deleteMany();

  // 2. Create Company
  const company = await prisma.company.create({
    data: {
      name: "Sifta Franchise Group",
    },
  });
  console.log(`Created Company: ${company.name}`);

  // 3. Create Branches
  const branchSudirman = await prisma.branch.create({
    data: {
      companyId: company.id,
      name: "Cabang Sudirman (Jakarta)",
      latitude: -6.2197,
      longitude: 106.8208,
      geofenceRadiusMeters: 20,
    },
  });

  const branchDago = await prisma.branch.create({
    data: {
      companyId: company.id,
      name: "Cabang Dago (Bandung)",
      latitude: -6.8915,
      longitude: 107.6161,
      geofenceRadiusMeters: 20,
    },
  });

  const branchThamrin = await prisma.branch.create({
    data: {
      companyId: company.id,
      name: "Cabang Thamrin (Jakarta)",
      latitude: -6.1950,
      longitude: 106.8230,
      geofenceRadiusMeters: 20,
    },
  });

  console.log("Created Branches: Sudirman, Dago, Thamrin");

  // 4. Create Employees
  const emp1 = await prisma.employee.create({
    data: {
      companyId: company.id,
      name: "Budi Santoso",
      role: "Security",
      phoneNumber: "0812-3456-7890",
      hourlyRate: 18000,
      bankName: "Bank BCA",
      bankAccountNumber: "1234567890",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU",
      status: "aktif",
    },
  });

  const emp2 = await prisma.employee.create({
    data: {
      companyId: company.id,
      name: "Siti Rahma",
      role: "Kasir",
      phoneNumber: "0823-4567-8901",
      hourlyRate: 15000,
      bankName: "GoPay",
      bankAccountNumber: "082345678901",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCAymBwikX0YI4xDJBuEYGlm-uOpkXlgx5jTvTyzE9AhL-ZjQw3wyP-BJibb9fHBsUGBrwN78NTC9HaHjv708pGMttzJIuvFqTrAnoRUzfUDDnkCPJGn3wCSDkXcQojQ46agiU7thANjqLLfx79AYXOZUWf8OtNTz_cNpmFu6kaSZ7R9Nn4KB4Eu_07QSOt31GTAEFIHW3TXx4_R4LDkVaaFXo417g90RmUdmXqGnoddwpoVB8C2NCAhfhupGn7VWil_ENxrn2YrQ",
      status: "aktif",
    },
  });

  const emp3 = await prisma.employee.create({
    data: {
      companyId: company.id,
      name: "Agus Riyadi",
      role: "Supervisor",
      phoneNumber: "0857-8901-2345",
      hourlyRate: 25000,
      bankName: "Bank Mandiri",
      bankAccountNumber: "9876543210",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIXL7RinGYceiiBWnDqGBLOaCsBtIcFhuHoZwMUd_6Y0Um7H7-VJcHLFcDjlhIW8WdP2ug0CSQx12YYJjjf4IgEtCyT1vkoOCZB5u_dQ2DZUr4KVmS_ChJ0rT8sZR4gfZqqGt5nRwMli8DBthH80rFrxOEupB1JvZjmuijycX47xEijawMOM9ot06hS6UlMULeUZAwGBXqhlUhG9oASYl84_kYL35AHbY7Nhxq81BS9VkxlAs3WOLK_uQvdYPBk5jWdpTiR6P3pFQ",
      status: "aktif",
    },
  });

  console.log("Created Employees: Budi, Siti, Agus");

  // Helper dates
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // 5. Create Shift Schedules
  // Yesterday's shifts (completed)
  const shiftYest1 = await prisma.shiftSchedule.create({
    data: {
      employeeId: emp1.id,
      branchId: branchSudirman.id,
      date: yesterdayStr,
      expectedClockIn: "08:00",
      expectedClockOut: "16:00",
      shiftName: "Shift Pagi",
      status: "completed",
    },
  });

  const shiftYest2 = await prisma.shiftSchedule.create({
    data: {
      employeeId: emp2.id,
      branchId: branchSudirman.id,
      date: yesterdayStr,
      expectedClockIn: "08:00",
      expectedClockOut: "16:00",
      shiftName: "Shift Pagi",
      status: "completed",
    },
  });

  // Today's shifts
  const shiftToday1 = await prisma.shiftSchedule.create({
    data: {
      employeeId: emp1.id,
      branchId: branchSudirman.id,
      date: todayStr,
      expectedClockIn: "08:00",
      expectedClockOut: "16:00",
      shiftName: "Shift Pagi",
      status: "today",
    },
  });

  const shiftToday2 = await prisma.shiftSchedule.create({
    data: {
      employeeId: emp2.id,
      branchId: branchSudirman.id,
      date: todayStr,
      expectedClockIn: "12:00",
      expectedClockOut: "20:00",
      shiftName: "Shift Siang",
      status: "today",
    },
  });

  const shiftToday3 = await prisma.shiftSchedule.create({
    data: {
      employeeId: emp3.id,
      branchId: branchThamrin.id,
      date: todayStr,
      expectedClockIn: "08:00",
      expectedClockOut: "16:00",
      shiftName: "Shift Pagi",
      status: "today",
    },
  });

  // Tomorrow's shifts
  await prisma.shiftSchedule.create({
    data: {
      employeeId: emp1.id,
      branchId: branchSudirman.id,
      date: tomorrowStr,
      expectedClockIn: "08:00",
      expectedClockOut: "16:00",
      shiftName: "Shift Pagi",
      status: "scheduled",
    },
  });

  await prisma.shiftSchedule.create({
    data: {
      employeeId: emp2.id,
      branchId: branchDago.id,
      date: tomorrowStr,
      expectedClockIn: "12:00",
      expectedClockOut: "20:00",
      shiftName: "Shift Siang",
      status: "scheduled",
    },
  });

  console.log("Created Shift Schedules for yesterday, today, and tomorrow");

  // 6. Create Attendances
  // Yesterday's completed attendances
  const clockInYest1 = new Date(yesterday);
  clockInYest1.setHours(7, 55, 0, 0); // On time
  const clockOutYest1 = new Date(yesterday);
  clockOutYest1.setHours(16, 5, 0, 0);

  await prisma.attendance.create({
    data: {
      shiftScheduleId: shiftYest1.id,
      employeeId: emp1.id,
      clockIn: clockInYest1,
      clockOut: clockOutYest1,
      clockInLat: -6.21972,
      clockInLng: 106.82081,
      isFakeGpsDetected: false,
    },
  });

  const clockInYest2 = new Date(yesterday);
  clockInYest2.setHours(8, 25, 0, 0); // Late 25 mins
  const clockOutYest2 = new Date(yesterday);
  clockOutYest2.setHours(16, 0, 0, 0);

  await prisma.attendance.create({
    data: {
      shiftScheduleId: shiftYest2.id,
      employeeId: emp2.id,
      clockIn: clockInYest2,
      clockOut: clockOutYest2,
      clockInLat: -6.21968,
      clockInLng: 106.82082,
      isFakeGpsDetected: false,
    },
  });

  // Today's completed attendance (e.g. Budi clocked in today)
  const clockInToday1 = new Date();
  clockInToday1.setHours(8, 2, 0, 0);

  await prisma.attendance.create({
    data: {
      shiftScheduleId: shiftToday1.id,
      employeeId: emp1.id,
      clockIn: clockInToday1,
      clockInLat: -6.21971,
      clockInLng: 106.82079,
      isFakeGpsDetected: false,
    },
  });

  // Fake GPS attendance attempt today (e.g. Siti Rahma tried from fake coordinates)
  const clockInToday2 = new Date();
  clockInToday2.setHours(12, 1, 0, 0);

  await prisma.attendance.create({
    data: {
      shiftScheduleId: shiftToday2.id,
      employeeId: emp2.id,
      clockIn: clockInToday2,
      clockInLat: -6.9999, // Way off
      clockInLng: 108.9999,
      isFakeGpsDetected: true,
      clockInPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    },
  });

  console.log("Created Attendances including on-time, late, and fake GPS attempts");

  // 7. Create Cashout Requests (EWA)
  await prisma.cashoutRequest.create({
    data: {
      employeeId: emp1.id,
      amount: 150000,
      status: "pending",
    },
  });

  await prisma.cashoutRequest.create({
    data: {
      employeeId: emp2.id,
      amount: 100000,
      status: "approved",
      paymentReference: "PAY-EWA-889271",
    },
  });

  console.log("Created Cashout Requests");
  console.log("Seeding completed successfully! 🎉");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
