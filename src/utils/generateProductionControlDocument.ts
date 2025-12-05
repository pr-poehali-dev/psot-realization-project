import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle
} from 'docx';

interface ControlItem {
  item_number: number;
  control_area: string;
  inspection_date: string;
  findings: string;
  recommendations: string;
  responsible_person: string;
  deadline: string;
}

interface ProductionControlData {
  doc_number: string;
  doc_date: string;
  inspector_fio: string;
  inspector_position: string;
  department: string;
  control_items: ControlItem[];
}

export function generateProductionControlDocument(
  data: ProductionControlData
): Document {
  const tableRows: TableRow[] = [];

  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({ text: '№ документа', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 15, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Дата', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 15, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'ФИО проверяющего', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 25, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Должность', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 25, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Подразделение', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 20, type: WidthType.PERCENTAGE }
        })
      ]
    })
  );

  tableRows.push(
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(data.doc_number)] }),
        new TableCell({
          children: [
            new Paragraph(new Date(data.doc_date).toLocaleDateString('ru-RU'))
          ]
        }),
        new TableCell({ children: [new Paragraph(data.inspector_fio)] }),
        new TableCell({ children: [new Paragraph(data.inspector_position)] }),
        new TableCell({ children: [new Paragraph(data.department)] })
      ]
    })
  );

  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: '№', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 5, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Область контроля', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 15, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Дата проверки', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 12, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Выявленные факты', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 25, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Рекомендации', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 20, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Ответственный', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 15, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Срок', alignment: AlignmentType.CENTER, bold: true })
          ],
          width: { size: 8, type: WidthType.PERCENTAGE }
        })
      ]
    })
  );

  data.control_items.forEach((item) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(item.item_number.toString())] }),
          new TableCell({ children: [new Paragraph(item.control_area)] }),
          new TableCell({
            children: [
              new Paragraph(
                new Date(item.inspection_date).toLocaleDateString('ru-RU')
              )
            ]
          }),
          new TableCell({ children: [new Paragraph(item.findings)] }),
          new TableCell({ children: [new Paragraph(item.recommendations)] }),
          new TableCell({ children: [new Paragraph(item.responsible_person)] }),
          new TableCell({
            children: [
              new Paragraph(
                item.deadline
                  ? new Date(item.deadline).toLocaleDateString('ru-RU')
                  : ''
              )
            ]
          })
        ]
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'АКТ ПРОИЗВОДСТВЕННОГО КОНТРОЛЯ',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'АКТ ПРОИЗВОДСТВЕННОГО КОНТРОЛЯ',
                bold: true,
                size: 28
              })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 }
            }
          }),
          new Paragraph({ text: '', spacing: { before: 600, after: 200 } }),
          new Paragraph({
            text: 'Ответственный за устранение нарушений:',
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: 'ФИО: _____________________________ Подпись: _______________',
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: 'Проводивший проверку:',
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `ФИО: ${data.inspector_fio}`,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: `Должность: ${data.inspector_position}`,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: 'Подпись: _______________'
          })
        ]
      }
    ]
  });

  return doc;
}
