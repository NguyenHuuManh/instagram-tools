import mysql, { MysqlError } from "mysql";
// Tạo kết nối
const pool = mysql.createPool({
  host: "localhost", // Thay đổi tùy theo host của MySQL của bạn
  user: "root", // Thay đổi tùy theo tên người dùng MySQL của bạn
  password: "123aA@123", // Thay đổi tùy theo mật khẩu của MySQL của bạn
  database: "social", // Thay đổi tùy theo tên cơ sở dữ liệu bạn muốn kết nối
});

const excuteQuery = async (sql: string, callback?: (result: any) => void) => {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error("Lỗi khi kết nối: " + err.stack);
      return;
    }

    connection.query(sql, (error: MysqlError, results: any) => {
      if (error) {
        console.error("excute faild: " + error.stack);
        throw error;
      }
      callback?.(results);
    });

    // Khi không cần thiết nữa, hãy giải phóng kết nối
    connection.release();
  });
};

export { excuteQuery };

export default pool;
