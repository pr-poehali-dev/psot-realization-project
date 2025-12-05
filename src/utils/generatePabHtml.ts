interface PabData {
  doc_number: string;
  doc_date: string;
  inspector_fio: string;
  inspector_position: string;
  department: string;
  location: string;
  checked_object: string;
  photo_base64?: string;
  observations: Array<{
    observation_number: number;
    description: string;
    category: string;
    conditions_actions: string;
    hazard_factors: string;
    measures: string;
    responsible_person: string;
    deadline: string;
    photo_base64?: string;
  }>;
}

export function generatePabHtml(data: PabData): string {
  const observationsHtml = data.observations.map(obs => `
    <div style="page-break-before: ${obs.observation_number > 1 ? 'always' : 'auto'}; margin-top: ${obs.observation_number > 1 ? '0' : '30px'};">
      ${obs.observation_number > 1 ? '<div style="text-align: right; font-size: 10pt; margin-bottom: 20px;">Регистрация ПАБ №${data.doc_number}</div>' : ''}
      
      <h2 style="font-size: 12pt; font-weight: bold; margin-bottom: 15px;">Наблюдение №${obs.observation_number}</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
        <tr>
          <td style="border: 1px solid #000; padding: 10px; width: 40%; font-weight: bold;">Дата</td>
          <td style="border: 1px solid #000; padding: 10px;">${new Date(data.doc_date).toLocaleDateString('ru-RU')}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Категория наблюдений</td>
          <td style="border: 1px solid #000; padding: 10px;">${obs.category}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Вид условий и действий</td>
          <td style="border: 1px solid #000; padding: 10px;">${obs.conditions_actions}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Опасные факторы</td>
          <td style="border: 1px solid #000; padding: 10px;">${obs.hazard_factors}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold; vertical-align: top;">Описание наблюдения №${obs.observation_number}</td>
          <td style="border: 1px solid #000; padding: 10px; white-space: pre-wrap;">${obs.description}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold; vertical-align: top;">Рекомендуемые мероприятия для устранения</td>
          <td style="border: 1px solid #000; padding: 10px; white-space: pre-wrap;">${obs.measures}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Ответственный за выполнение</td>
          <td style="border: 1px solid #000; padding: 10px;">${obs.responsible_person}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Срок</td>
          <td style="border: 1px solid #000; padding: 10px;">${new Date(obs.deadline).toLocaleDateString('ru-RU')}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">Статус</td>
          <td style="border: 1px solid #000; padding: 10px;">Новый</td>
        </tr>
        ${obs.photo_base64 ? `
        <tr>
          <td style="border: 1px solid #000; padding: 10px; font-weight: bold; vertical-align: top;">Фото наблюдения №${obs.observation_number}</td>
          <td style="border: 1px solid #000; padding: 10px; text-align: center;">
            <img src="${obs.photo_base64}" alt="Фото наблюдения ${obs.observation_number}" style="max-width: 100%; max-height: 500px;" />
          </td>
        </tr>
        ` : ''}
      </table>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Регистрация ПАБ №${data.doc_number}</title>
  <style>
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; padding: 0; }
      .page-break { page-break-before: always; }
    }
    
    body {
      font-family: 'Times New Roman', serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      font-size: 11pt;
    }
    
    .document-container {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      padding: 20mm;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .header h1 {
      font-size: 12pt;
      font-weight: bold;
      margin: 5px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11pt;
    }
    
    td {
      border: 1px solid #000;
      padding: 10px;
    }
    
    .signature-section {
      margin-top: 50px;
      page-break-inside: avoid;
    }
    
    .signature-row {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      align-items: flex-end;
    }
    
    .signature-line {
      min-width: 300px;
      border-bottom: 1px solid #000;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="document-container">
    <div class="header">
      <div style="text-align: right; font-size: 10pt; margin-bottom: 20px;">Регистрация ПАБ №${data.doc_number}</div>
      <h1>Регистрация ПАБ №${data.doc_number}</h1>
    </div>

    <table style="margin-bottom: 30px;">
      <tr>
        <td style="width: 40%; font-weight: bold;">Проверяющий (ФИО):</td>
        <td>${data.inspector_fio}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Должность:</td>
        <td>${data.inspector_position}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Подразделение:</td>
        <td>${data.department}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Место проведения:</td>
        <td>${data.location}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Проверяемый объект:</td>
        <td>${data.checked_object}</td>
      </tr>
    </table>

    ${observationsHtml}

    <div class="signature-section">
      <div class="signature-row">
        <span>Проверяющий:</span>
        <span class="signature-line"></span>
        <span>Дата: ${new Date(data.doc_date).toLocaleDateString('ru-RU')}</span>
      </div>
      <div style="text-align: center; font-size: 9pt; color: #666; margin-top: -10px; margin-left: 150px;">(Подпись)</div>
      
      <div class="signature-row" style="margin-top: 40px;">
        <span>Ответственный:</span>
        <span class="signature-line"></span>
        <span>Дата: ${new Date(data.doc_date).toLocaleDateString('ru-RU')}</span>
      </div>
      <div style="text-align: center; font-size: 9pt; color: #666; margin-top: -10px; margin-left: 150px;">(Подпись)</div>
    </div>
  </div>
</body>
</html>`;
}
