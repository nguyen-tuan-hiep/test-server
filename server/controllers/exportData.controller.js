import ExcelJS from 'exceljs';
import pool from '../models/config.js';

function exportData(req, res) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Customers');
  pool.query(
    'select s.id id, s.name name, s.age age, c.id class_id, c.name class_name from student s join class c on s.class_id = c.id order by s.id;',
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error!');
        return;
      }
      const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'Age', key: 'age' },
        { header: 'Class ID', key: 'class_id' },
        { header: 'Class Name', key: 'class_name' },
      ];
      worksheet.columns = columns;
      // eslint-disable-next-line no-restricted-syntax
      for (const row of results.rows) {
        worksheet.addRow(row);
      }

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });

      // Set response headers and send the workbook as a response
      res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
      workbook.xlsx
        .write(res)
        .then(() => {
          res.end();
          // pool.end();
        })
        .catch(() => {
          console.error(err);
          res.status(500).send('Server error!');
          // pool.end();
        });
    },
  );
}

export default { exportData };
