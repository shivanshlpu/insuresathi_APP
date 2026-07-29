import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function downloadPdf(element: HTMLElement, filename: string = 'InsureSathi-Record.pdf') {
  if (!element) return;

  try {
    const parentContainer = element.closest('.printable-area') || element;
    parentContainer.classList.add('exporting-pdf');
    await new Promise(r => setTimeout(r, 60));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    parentContainer.classList.remove('exporting-pdf');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF download:', error);
    throw error;
  } finally {
    const parentContainer = element.closest('.printable-area') || element;
    parentContainer.classList.remove('exporting-pdf');
  }
}
