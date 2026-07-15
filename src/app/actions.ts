"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── Owner Actions ────────────────────────────────────────────────────────────

/** Fetch all employees from SQLite */
export async function getEmployees() {
  try {
    return await db.employee.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to get employees:", error);
    return [];
  }
}

/** Create a new employee in database */
export async function createEmployee(data: {
  name: string;
  role: string;
  phoneNumber: string;
  hourlyRate: number;
  bankName: string;
  bankAccountNumber: string;
}) {
  try {
    const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBuqhGkkCAjz6JBtkqr3p1-T0Y-qvhhckRpQOVI8eJn9S72kDj50y0b2W6nxg0RGiTWwNAW7shLhzsVzL9bO2R3LtG5b1sdxoefsbeVtJ2FepumcSqcFGQrXnA48y5RQ02AWxiAfw4yXbgtczTO_rfJGx3uB0rGrl4-InEazco1iHSStw8meWUYGCVYUjXLUDEz2tEfZvUsIPEaW58IWdLctiMCeTqx_b-TD1wW6S4rYwzLNBNxmL0fk1z79LHUooWta-q8D4oMkGU";
    
    // Find first company from seed
    const company = await db.company.findFirst();
    if (!company) throw new Error("No company found in database. Please run seed script first.");

    const employee = await db.employee.create({
      data: {
        companyId: company.id,
        name: data.name,
        role: data.role,
        phoneNumber: data.phoneNumber,
        hourlyRate: data.hourlyRate,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        avatar: defaultAvatar,
        status: "aktif",
      },
    });

    revalidatePath("/owner/employees");
    return { success: true, employee };
  } catch (error: any) {
    console.error("Failed to create employee:", error);
    return { success: false, error: error.message || "Gagal mendaftarkan karyawan" };
  }
}

/** Fetch all EWA cashout requests with employee info */
export async function getEWARequests() {
  try {
    return await db.cashoutRequest.findMany({
      include: {
        employee: true,
      },
      orderBy: { requestedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to get EWA requests:", error);
    return [];
  }
}

/** Approve a cashout request */
export async function approveEWARequest(id: string) {
  try {
    const txId = `EWA-TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const request = await db.cashoutRequest.update({
      where: { id },
      data: {
        status: "approved",
        paymentReference: txId,
      },
      include: {
        employee: true,
      },
    });

    revalidatePath("/owner/payroll");
    revalidatePath("/employee/payroll");
    return { success: true, request };
  } catch (error: any) {
    console.error("Failed to approve EWA request:", error);
    return { success: false, error: error.message };
  }
}

/** Reject a cashout request */
export async function rejectEWARequest(id: string) {
  try {
    const request = await db.cashoutRequest.update({
      where: { id },
      data: {
        status: "rejected",
      },
      include: {
        employee: true,
      },
    });

    revalidatePath("/owner/payroll");
    revalidatePath("/employee/payroll");
    return { success: true, request };
  } catch (error: any) {
    console.error("Failed to reject EWA request:", error);
    return { success: false, error: error.message };
  }
}


// ─── Employee Actions ─────────────────────────────────────────────────────────

/** Fetch dashboard & payroll data for employee based on phone */
export async function getEmployeeDashboardData(phoneNumber: string) {
  try {
    const employee = await db.employee.findUnique({
      where: { phoneNumber },
      include: {
        attendances: true,
        shifts: {
          include: {
            branch: true,
          },
          orderBy: { date: "asc" },
        },
        cashoutRequests: true,
      },
    });

    if (!employee) return null;

    // Find today's shift (e.g. YYYY-MM-DD)
    const todayStr = new Date().toISOString().split("T")[0];
    const todayShift = employee.shifts.find((s) => s.date === todayStr);

    // Find today's attendance record (if clocked in)
    const todayAttendance = todayShift
      ? employee.attendances.find((a) => a.shiftScheduleId === todayShift.id)
      : null;

    // Calculations: Completed shifts (expected clock out done)
    const completedShifts = employee.shifts.filter(
      (s) => s.status === "completed"
    );
    const totalShiftsCount = completedShifts.length;
    const totalHoursWorked = totalShiftsCount * 8; // Assume 8 hours per shift
    const totalWagesAccrued = totalHoursWorked * employee.hourlyRate;

    // Approved cashout requests EWA deductions
    const totalDeductions = employee.cashoutRequests
      .filter((r) => r.status === "approved" || r.status === "disbursed")
      .reduce((sum, r) => sum + r.amount, 0);

    // 50% limit of accrued wages
    const maxWithdrawable = Math.max(
      0,
      totalWagesAccrued * 0.5 - totalDeductions
    );

    return {
      employee,
      todayShift,
      todayAttendance,
      totalShiftsCount,
      totalHoursWorked,
      totalWagesAccrued,
      totalDeductions,
      maxWithdrawable,
    };
  } catch (error) {
    console.error("Failed to get employee dashboard:", error);
    return null;
  }
}

/** Record attendance Clock-In */
export async function clockIn(
  employeeId: string,
  shiftScheduleId: string,
  lat: number,
  lng: number,
  isFakeGps: boolean,
  photoUrl: string
) {
  try {
    const attendance = await db.attendance.create({
      data: {
        employeeId,
        shiftScheduleId,
        clockIn: new Date(),
        clockInLat: lat,
        clockInLng: lng,
        isFakeGpsDetected: isFakeGps,
        clockInPhotoUrl: photoUrl,
      },
    });

    // Update shift status to reflect clocked-in today
    await db.shiftSchedule.update({
      where: { id: shiftScheduleId },
      data: {
        status: "completed", // For demo simplifies active/completed transition
      },
    });

    revalidatePath("/employee");
    revalidatePath("/owner/reports");
    revalidatePath("/owner");
    return { success: true, attendance };
  } catch (error: any) {
    console.error("Failed to clock in:", error);
    return { success: false, error: error.message };
  }
}

/** Record attendance Clock-Out */
export async function clockOut(attendanceId: string) {
  try {
    const attendance = await db.attendance.update({
      where: { id: attendanceId },
      data: {
        clockOut: new Date(),
      },
    });

    revalidatePath("/employee");
    revalidatePath("/owner/reports");
    revalidatePath("/owner");
    return { success: true, attendance };
  } catch (error: any) {
    console.error("Failed to clock out:", error);
    return { success: false, error: error.message };
  }
}

/** Submit a new EWA Request from employee portal */
export async function requestEWA(
  employeeId: string,
  amount: number,
  method: string
) {
  try {
    const request = await db.cashoutRequest.create({
      data: {
        employeeId,
        amount,
        status: "pending",
      },
    });

    revalidatePath("/employee/payroll");
    revalidatePath("/owner/payroll");
    return { success: true, request };
  } catch (error: any) {
    console.error("Failed to submit EWA request:", error);
    return { success: false, error: error.message };
  }
}
