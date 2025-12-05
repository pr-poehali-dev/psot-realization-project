interface PabData {
  doc_number: string;
  doc_date: string;
  inspector_fio: string;
  inspector_position: string;
  department: string;
  location: string;
  checked_object: string;
  observations: Array<{
    observation_number: number;
    description: string;
    category: string;
    conditions_actions: string;
    hazard_factors: string;
    measures: string;
    responsible_person: string;
    deadline: string;
  }>;
}

export function generatePabHtml(data: PabData): string {
  const observationsHtml = data.observations.map(obs => `
    <tr>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${obs.observation_number}</td>
      <td style="border: 1px solid #000; padding: 8px;">${obs.description}</td>
      <td style="border: 1px solid #000; padding: 8px;">${obs.category}</td>
      <td style="border: 1px solid #000; padding: 8px;">${obs.conditions_actions}</td>
      <td style="border: 1px solid #000; padding: 8px;">${obs.hazard_factors}</td>
      <td style="border: 1px solid #000; padding: 8px;">${obs.measures}</td>
      <td style="border: 1px solid #000; padding: 8px;">${obs.responsible_person}</td>
      <td style="border: 1px solid #000; padding: 8px;">${obs.deadline}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ПАБ ${data.doc_number}</title>
  <style>
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; }
    }
    
    body {
      font-family: 'Times New Roman', serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
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
      font-size: 18pt;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .info-section {
      margin-bottom: 20px;
      line-height: 1.8;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    
    .info-label {
      font-weight: bold;
      min-width: 200px;
    }
    
    .info-value {
      flex: 1;
      border-bottom: 1px solid #000;
      padding-left: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 10pt;
    }
    
    th {
      background: #f0f0f0;
      border: 1px solid #000;
      padding: 8px;
      text-align: center;
      font-weight: bold;
    }
    
    td {
      border: 1px solid #000;
      padding: 8px;
    }
    
    .actions {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
      z-index: 1000;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .btn-secondary {
      background: #10b981;
      color: white;
    }
    
    .btn-secondary:hover {
      background: #059669;
    }
  </style>
</head>
<body>
  <div class="actions no-print">
    <button class="btn btn-primary" onclick="downloadPDF()">
      📥 Скачать PDF
    </button>
    <button class="btn btn-secondary" onclick="window.print()">
      🖨️ Распечатать
    </button>
  </div>

  <div class="document-container">
    <div class="header">
      <h1>РЕГИСТРАЦИЯ ПОВЕДЕНЧЕСКОГО АУДИТА БЕЗОПАСНОСТИ (ПАБ)</h1>
      <div style="margin-top: 20px;">
        <strong>№ ${data.doc_number}</strong> от <strong>${new Date(data.doc_date).toLocaleDateString('ru-RU')}</strong>
      </div>
    </div>

    <div class="info-section">
      <div class="info-row">
        <span class="info-label">Проверяющий (ФИО):</span>
        <span class="info-value">${data.inspector_fio}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Должность:</span>
        <span class="info-value">${data.inspector_position}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Подразделение:</span>
        <span class="info-value">${data.department}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Место проведения:</span>
        <span class="info-value">${data.location}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Проверяемый объект:</span>
        <span class="info-value">${data.checked_object}</span>
      </div>
    </div>

    <h2 style="text-align: center; font-size: 14pt; margin: 30px 0 15px 0;">Выявленные наблюдения</h2>

    <table>
      <thead>
        <tr>
          <th style="width: 30px;">№</th>
          <th style="width: 15%;">Описание наблюдения</th>
          <th style="width: 10%;">Категория</th>
          <th style="width: 12%;">Условия/Действия</th>
          <th style="width: 12%;">Опасные факторы</th>
          <th style="width: 18%;">Рекомендуемые меры</th>
          <th style="width: 15%;">Ответственный</th>
          <th style="width: 10%;">Срок</th>
        </tr>
      </thead>
      <tbody>
        ${observationsHtml}
      </tbody>
    </table>

    <div style="margin-top: 50px;">
      <div style="display: flex; justify-content: space-between; margin-top: 60px;">
        <div>
          <div>Проверяющий: ___________________</div>
          <div style="margin-top: 5px; font-size: 9pt;">(подпись)</div>
        </div>
        <div>
          <div>Дата: ___________________</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function downloadPDF() {
      try {
        const element = document.querySelector('.document-container');
        
        // Используем html2pdf.js через CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(script);
        
        script.onload = () => {
          const opt = {
            margin: 10,
            filename: 'ПАБ_${data.doc_number}_${data.doc_date}.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          
          // @ts-ignore
          html2pdf().set(opt).from(element).save();
        };
      } catch (error) {
        alert('Ошибка создания PDF. Используйте функцию печати браузера.');
        console.error(error);
      }
    }
  </script>
</body>
</html>`;
}
