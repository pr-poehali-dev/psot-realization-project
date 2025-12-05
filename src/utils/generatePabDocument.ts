import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';

interface Observation {
  observation_number: number;
  description: string;
  category: string;
  conditions_actions: string;
  hazard_factors: string;
  measures: string;
  responsible_person: string;
  deadline: string;
}

interface PabData {
  doc_number: string;
  doc_date: string;
  inspector_fio: string;
  inspector_position: string;
  department: string;
  location: string;
  checked_object: string;
  observations: Observation[];
}

export function generatePabDocument(data: PabData): Document {
  const tableRows: TableRow[] = [];

  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: '№ ПАБ', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Дата', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'ФИО проверяющего', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Должность', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Подразделение', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Место', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Проверяемый объект', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 20, type: WidthType.PERCENTAGE },
        }),
      ],
    })
  );

  tableRows.push(
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(data.doc_number)] }),
        new TableCell({ children: [new Paragraph(new Date(data.doc_date).toLocaleDateString('ru-RU'))] }),
        new TableCell({ children: [new Paragraph(data.inspector_fio)] }),
        new TableCell({ children: [new Paragraph(data.inspector_position)] }),
        new TableCell({ children: [new Paragraph(data.department)] }),
        new TableCell({ children: [new Paragraph(data.location)] }),
        new TableCell({ children: [new Paragraph(data.checked_object)] }),
      ],
    })
  );

  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: '№', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 5, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Описание наблюдения', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 20, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Категория', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 12, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Условия/действия', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 13, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Опасный фактор', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 13, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Меры устранения', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 20, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Ответственный', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 12, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Срок', alignment: AlignmentType.CENTER, bold: true })],
          width: { size: 5, type: WidthType.PERCENTAGE },
        }),
      ],
    })
  );

  data.observations.forEach((obs) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(obs.observation_number.toString())] }),
          new TableCell({ children: [new Paragraph(obs.description)] }),
          new TableCell({ children: [new Paragraph(obs.category)] }),
          new TableCell({ children: [new Paragraph(obs.conditions_actions)] }),
          new TableCell({ children: [new Paragraph(obs.hazard_factors)] }),
          new TableCell({ children: [new Paragraph(obs.measures)] }),
          new TableCell({ children: [new Paragraph(obs.responsible_person)] }),
          new TableCell({ children: [new Paragraph(obs.deadline ? new Date(obs.deadline).toLocaleDateString('ru-RU') : '')] }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'ПРЕДПИСАНИЕ ПО БЕЗОПАСНОСТИ И АУДИТУ (ПАБ)',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'ПРЕДПИСАНИЕ ПО БЕЗОПАСНОСТИ И АУДИТУ (ПАБ)',
                bold: true,
                size: 28,
              }),
            ],
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
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),
          new Paragraph({ text: '', spacing: { before: 600, after: 200 } }),
          new Paragraph({
            text: 'Ответственный за устранение нарушений:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'ФИО: _____________________________ Подпись: _______________',
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Выдавший предписание:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `ФИО: ${data.inspector_fio}`,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Должность: ${data.inspector_position}`,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'Подпись: _______________',
          }),
        ],
      },
    ],
  });

  return doc;
}
