
/*
  QUY TRÌNH THEO DÕI LƯU CHUYỂN SÁCH THƯ VIỆN
  CRUD: Create - Read - Update - Delete
*/

// 1. Khởi tạo dữ liệu ban đầu
let circulationLogs = [
    {
        logId: "LOG001",
        studentCode: "SV001",
        bookIsbn: "ISBN001",
        status: "BORROWING",
        fineAmount: 0,
        borrowDate: "2026-10-01",
        dueDate: "2026-10-05",
        returnDate: null,
        finePaid: false,
        updatedAt: "2026-10-01"
    },
    {
        logId: "LOG002",
        studentCode: "SV002",
        bookIsbn: "ISBN002",
        status: "BORROWING",
        fineAmount: 0,
        borrowDate: "2026-10-02",
        dueDate: "2026-10-04",
        returnDate: null,
        finePaid: false,
        updatedAt: "2026-10-02"
    },
    {
        logId: "LOG003",
        studentCode: "SV003",
        bookIsbn: "ISBN003",
        status: "RETURNED",
        fineAmount: 10000,
        borrowDate: "2026-09-01",
        dueDate: "2026-09-05",
        returnDate: "2026-09-07",
        finePaid: true,
        updatedAt: "2026-09-07"
    }
];

// Danh sách sinh viên hợp lệ
const students = ["SV001", "SV002", "SV003", "SV004"];

// Kho sách: số lượng sách còn lại
let books = [
    { bookIsbn: "ISBN001", title: "Lap trinh JavaScript", stock: 3 },
    { bookIsbn: "ISBN002", title: "Co so du lieu", stock: 2 },
    { bookIsbn: "ISBN003", title: "Lap trinh Python", stock: 4 },
    { bookIsbn: "ISBN004", title: "Mang may tinh", stock: 2 }
];

// Ngày vận hành quầy
const today = "2026-10-14";


// 2. CREATE: Mượn sách mới
console.log("===== 1. TIEP NHAN MUON SACH =====");

const newBorrow = {
    logId: "LOG004",
    studentCode: "SV004",
    bookIsbn: "ISBN004",
    status: "BORROWING",
    fineAmount: 0,
    borrowDate: today,
    dueDate: "2026-10-20",
    returnDate: null,
    finePaid: false,
    updatedAt: today
};

if (!students.includes(newBorrow.studentCode)) {
    console.log("Loi: Ma sinh vien khong hop le!");
} else {
    const book = books.find(
        item => item.bookIsbn === newBorrow.bookIsbn
    );

    if (!book) {
        console.log("Loi: Khong tim thay sach!");
    } else if (book.stock <= 0) {
        console.log("Loi: Sach da het!");
    } else {
        circulationLogs.push(newBorrow);
        book.stock--;

        console.log("Muon sach thanh cong:", newBorrow.logId);
    }
}


// 3. GIA HAN SACH
console.log("\n===== 2. GIA HAN SACH =====");

const renewLogId = "LOG001";
const newDueDate = "2026-10-18";

const renewLog = circulationLogs.find(
    log => log.logId === renewLogId
);

if (renewLog && renewLog.status === "BORROWING") {
    renewLog.dueDate = newDueDate;
    renewLog.updatedAt = today;

    console.log("Gia han thanh cong:", renewLog.logId);
    console.log("Han tra moi:", renewLog.dueDate);
} else {
    console.log("Khong the gia han giao dich nay!");
}


// 4. UPDATE: Trả sách và tính tiền phạt
console.log("\n===== 3. TRA SACH VA TINH PHAT =====");

const returnLogId = "LOG002";
const actualReturnDate = "2026-10-10";
const isLost = false;

const returnLog = circulationLogs.find(
    log => log.logId === returnLogId
);

if (returnLog && returnLog.status === "BORROWING") {
    const book = books.find(
        item => item.bookIsbn === returnLog.bookIsbn
    );

    if (isLost) {
        returnLog.status = "LOST";
        returnLog.fineAmount = 200000;
    } else {
        returnLog.status = "RETURNED";

        // Tính số ngày trả trễ
        const due = new Date(returnLog.dueDate);
        const actual = new Date(actualReturnDate);

        const lateDays = Math.max(
            0,
            Math.floor((actual - due) / (1000 * 60 * 60 * 24))
        );

        returnLog.fineAmount = lateDays * 5000;

        // Sách được nhập lại kho khi trả
        if (book) {
            book.stock++;
        }
    }

    returnLog.returnDate = actualReturnDate;
    returnLog.updatedAt = today;

    console.log("Ma giao dich:", returnLog.logId);
    console.log("Trang thai:", returnLog.status);
    console.log(
        "Tien phat:",
        returnLog.fineAmount.toLocaleString("vi-VN"),
        "VND"
    );
} else {
    console.log("Giao dich khong ton tai hoac sach da duoc xu ly!");
}


// 5. QUYẾT TOÁN TIỀN PHẠT
console.log("\n===== 4. QUYET TOAN TIEN PHAT =====");

const paymentLogId = "LOG002";

const paymentLog = circulationLogs.find(
    log => log.logId === paymentLogId
);

if (
    paymentLog &&
    paymentLog.status !== "BORROWING" &&
    paymentLog.fineAmount > 0 &&
    !paymentLog.finePaid
) {
    paymentLog.finePaid = true;
    paymentLog.updatedAt = today;

    console.log("Da thu tien phat:", paymentLog.fineAmount, "VND");
} else if (paymentLog && paymentLog.fineAmount === 0) {
    console.log("Giao dich khong co tien phat.");
} else {
    console.log("Khong the quyet toan giao dich nay!");
}


// 6. DELETE: Xóa nhật ký đã hoàn tất quá 30 ngày
console.log("\n===== 5. DON DEP NHAT KY =====");

const cutoffDate = new Date(today);
cutoffDate.setDate(cutoffDate.getDate() - 30);

const beforeDelete = circulationLogs.length;

circulationLogs = circulationLogs.filter(log => {
    const updatedDate = new Date(log.updatedAt);

    const completed =
        log.status !== "BORROWING" &&
        (log.fineAmount === 0 || log.finePaid);

    const olderThan30Days = updatedDate < cutoffDate;

    return !(completed && olderThan30Days);
});

console.log(
    "So nhat ky da xoa:",
    beforeDelete - circulationLogs.length
);


// 7. READ: Báo cáo tổng kết cuối ngày
console.log("\n===== 6. BAO CAO CUOI NGAY =====");

const borrowingCount = circulationLogs.filter(
    log => log.status === "BORROWING"
).length;

const returnedCount = circulationLogs.filter(
    log => log.status === "RETURNED"
).length;

const lostCount = circulationLogs.filter(
    log => log.status === "LOST"
).length;

const totalFineCollected = circulationLogs
    .filter(log => log.finePaid)
    .reduce((total, log) => total + log.fineAmount, 0);

const totalFineUnpaid = circulationLogs
    .filter(log => !log.finePaid)
    .reduce((total, log) => total + log.fineAmount, 0);

console.log("Ngay bao cao:", today);
console.log("Tong giao dich con luu:", circulationLogs.length);
console.log("So sach dang duoc muon:", borrowingCount);
console.log("So giao dich da tra:", returnedCount);
console.log("So giao dich mat sach:", lostCount);

console.log(
    "Tong tien phat da thu:",
    totalFineCollected.toLocaleString("vi-VN"),
    "VND"
);

console.log(
    "Tong tien phat chua thu:",
    totalFineUnpaid.toLocaleString("vi-VN"),
    "VND"
);

console.log("\n===== CHI TIET NHAT KY =====");
console.table(circulationLogs);

console.log("\n===== TON KHO SACH =====");
console.table(books);
